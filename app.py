"""Xin Portfolio — sito statico con piccola API FastAPI.

Esegui con `python app.py` da PyCharm. La raccolta dei messaggi è locale
finché non configuri un servizio SMTP e una destinazione CONTACT_TO.
"""
from __future__ import annotations

import json
import logging
import os
import re
import smtplib
import sqlite3
import threading
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field, field_validator

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
LOG = logging.getLogger(__name__)


def database_path() -> Path:
    configured = Path(os.getenv("DATABASE_PATH", "data/contacts.db"))
    return configured if configured.is_absolute() else BASE_DIR / configured


def init_db() -> None:
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(path, timeout=10) as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                topic TEXT NOT NULL,
                message TEXT NOT NULL
            )
        """)
        db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="Xin Portfolio", version="1.0.0", docs_url=None, redoc_url=None, lifespan=lifespan)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


class ContactPayload(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    topic: str = Field(min_length=2, max_length=80)
    message: str = Field(min_length=15, max_length=3000)
    consent: bool
    website: str = Field(default="", max_length=200)  # campo anti-bot nascosto

    @field_validator("name", "topic", "message", mode="before")
    @classmethod
    def clean(cls, value: str) -> str:
        if not isinstance(value, str):
            raise ValueError("Il campo deve essere un testo")
        return value.strip()


# Finestra di 15 minuti, massimo 5 POST per IP. Protezione basilare, in memoria.
_WINDOW_SECONDS = 15 * 60
_MAX_REQUESTS = 5
_ATTEMPTS: dict[str, deque[float]] = defaultdict(deque)
_LIMIT_LOCK = threading.Lock()


def is_rate_limited(ip: str) -> bool:
    now = time.monotonic()
    with _LIMIT_LOCK:
        attempts = _ATTEMPTS[ip]
        while attempts and now - attempts[0] >= _WINDOW_SECONDS:
            attempts.popleft()
        if len(attempts) >= _MAX_REQUESTS:
            return True
        attempts.append(now)
        return False


def send_notification(payload: ContactPayload) -> bool:
    """Opzionale: invio via SMTP. Mai inserire credenziali nel frontend."""
    host = os.getenv("SMTP_HOST", "").strip()
    to_address = os.getenv("CONTACT_TO", "").strip()
    from_address = os.getenv("SMTP_FROM", "").strip()
    if not all([host, to_address, from_address]):
        return False

    email = EmailMessage()
    email["Subject"] = f"[Portfolio] Nuovo messaggio: {payload.topic}"
    email["From"] = from_address
    email["To"] = to_address
    email["Reply-To"] = str(payload.email)
    email.set_content(
        f"Nome: {payload.name}\nEmail: {payload.email}\n"
        f"Argomento: {payload.topic}\n\n{payload.message}"
    )
    try:
        port = int(os.getenv("SMTP_PORT", "587"))
        with smtplib.SMTP(host, port, timeout=7) as server:
            if os.getenv("SMTP_USE_TLS", "true").lower() == "true":
                server.starttls()
            user = os.getenv("SMTP_USER", "")
            password = os.getenv("SMTP_PASSWORD", "")
            if user and password:
                server.login(user, password)
            server.send_message(email)
        return True
    except (OSError, smtplib.SMTPException, ValueError):
        LOG.exception("Notifica email non inviata. Messaggio conservato in SQLite.")
        return False


@app.get("/", include_in_schema=False)
def homepage():
    return FileResponse(BASE_DIR / "static" / "index.html")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/projects")
def projects():
    path = BASE_DIR / "data" / "projects.json"
    with path.open(encoding="utf-8") as file:
        return JSONResponse(json.load(file))


@app.post("/api/contact", status_code=201)
def contact(payload: ContactPayload, request: Request):
    # Non fidarsi di X-Forwarded-For se il proxy non è configurato correttamente.
    ip = request.client.host if request.client else "unknown"
    if is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Troppi tentativi. Riprova fra 15 minuti.")
    if payload.website:  # bot honeypot: risposta neutra, senza archiviare
        return {"ok": True, "message": "Messaggio ricevuto."}
    if not payload.consent:
        raise HTTPException(status_code=422, detail="È necessario accettare l'informativa sui dati.")
    if not re.search(r"[A-Za-zÀ-ÿ]", payload.message):
        raise HTTPException(status_code=422, detail="Inserisci un messaggio valido.")

    with sqlite3.connect(database_path(), timeout=10) as db:
        db.execute(
            "INSERT INTO messages (created_at, name, email, topic, message) VALUES (?, ?, ?, ?, ?)",
            (datetime.now(timezone.utc).isoformat(), payload.name, str(payload.email), payload.topic, payload.message),
        )
        db.commit()

    # Evita blocchi importanti della richiesta solo per l'eventuale SMTP.
    # Per un sito con traffico reale sposta in una coda/background worker.
    send_notification(payload)
    return {"ok": True, "message": "Messaggio ricevuto."}


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    # Font Google opzionali per stile: font-system fallback se offline.
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; "
        "connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    )
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=os.getenv("SITE_HOST", "127.0.0.1"),
        port=int(os.getenv("SITE_PORT", "8000")),
        reload=False,
    )
