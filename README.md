# XIN® — Portfolio personale

Un sito portfolio moderno, responsive e interattivo, **da aprire direttamente con PyCharm**. Frontend in HTML, CSS e JavaScript vanilla; backend Python con FastAPI, API progetti e modulo di contatto funzionante. Non servono Node.js, npm o un database esterno.

## Avvio in PyCharm (Windows)

1. Decomprimi lo ZIP e in PyCharm fai **File → Open**, selezionando la cartella `xin-portfolio`.
2. Se PyCharm propone un interprete virtuale, crea un **Virtualenv Python 3.11+**. In alternativa, nel terminale integrato:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   ```

   Se PowerShell blocca l'attivazione, usa `\.venv\Scripts\python.exe -m pip install -r requirements.txt` e lo stesso interprete per eseguire `app.py`.

3. Tasto destro su `app.py` → **Run 'app'** (oppure `python app.py` nel terminale).
4. Apri **http://127.0.0.1:8000/** nel browser.

> **Importante:** non aprire `index.html` con un doppio clic (`file://`). Va eseguito il backend, perché i progetti vengono caricati con `/api/projects` e il modulo usa `/api/contact`.

## Cosa funziona già

- Home interattiva con orb 3D, rete di particelle canvas, microanimazioni e scroll progress
- Layout desktop/tablet/mobile; menu mobile e navigazione accessibile
- Filtri per categoria, ricerca live e schede progetto in finestre dettagliate
- Tema chiaro/scuro e lingua italiano/inglese memorizzati sul dispositivo
- Ricerca comandi `Ctrl+K` (su Mac `⌘+K`) o voce «Scorciatoie» nel footer
- Modulo contatti con validazione client/server e salvataggio SQLite
- Honeypot anti-bot e rate limit basilare (5 invii / 15 min per IP)
- Notifiche email SMTP **opzionali**; file `.env.example` già pronto
- Riduzione animazioni per chi usa `prefers-reduced-motion`

## Personalizzazione

| Modifica | Dove intervenire |
| --- | --- |
| Testi principali | `static/index.html` e traduzioni `i18n` in `static/js/main.js` |
| Progetti (titolo, stack, descrizione) | `data/projects.json` |
| Traduzione inglese dei progetti | `projectEnglish` in `static/js/main.js` |
| Palette, spazi, font, animazioni | `static/css/style.css` |
| Grafica vettoriale in CSS dei progetti | `projectArt()` in `static/js/main.js` + CSS `visual-*` |
| Backend e database | `app.py` |
| Logo favicon | `static/assets/favicon.svg` |

I progetti iniziali sono esempi basati su **ambiti di studio/sperimentazione**: aggiorna testi e nomi prima di pubblicare un portfolio definitivo. Nessun link fittizio a repository esterni è presente.

## Come ricevere i messaggi via email

1. Duplica `.env.example` e rinominalo `.env`.
2. Configura `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` e `CONTACT_TO` secondo il tuo provider SMTP.
3. Riavvia Python. Tutti i messaggi vengono sempre salvati in `data/contacts.db` (SQLite); se SMTP è impostato arriva anche la notifica email.

Puoi verificare i messaggi con il pannello **Database** di PyCharm Professional, con [DB Browser for SQLite](https://sqlitebrowser.org/) o con un breve script Python locale:

```python
import sqlite3
with sqlite3.connect('data/contacts.db') as db:
    for row in db.execute('SELECT created_at, name, email, topic, message FROM messages ORDER BY id DESC'):
        print(row)
```

**Privacy:** in questa versione i dati vengono salvati sul server senza scadenza automatica. Prima di pubblicare occorre definire una vera informativa privacy, un periodo di conservazione, proteggere backup e database, configurare HTTPS e predisporre una policy antispam/antiabuso adatta al traffico.

## Distribuzione online

Puoi eseguire il sito su qualsiasi hosting Python con il comando:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

Per la produzione configura HTTPS e un reverse proxy, una directory SQLite persistente, un servizio di posta valido e misure anti-spam aggiuntive. Il rate limit attuale è **in memoria per processo**, utile come difesa iniziale ma non sufficiente su più worker o dietro proxy non configurati. Evita servizi con disco effimero per salvare i messaggi.

## Test

```bash
python -m pip install pytest httpx
python -m pytest -q
```

## Struttura

```text
xin-portfolio/
├── app.py                   # Server FastAPI e modulo contatti
├── requirements.txt
├── .env.example
├── README.md
├── data/
│   └── projects.json        # Progetti modificabili
├── static/
│   ├── index.html           # Struttura sito
│   ├── css/style.css        # Layout e animazioni
│   ├── js/main.js           # Interazioni e lingua
│   └── assets/favicon.svg
└── tests/test_app.py
```

Creato senza librerie frontend aggiuntive: tutto il design resta modificabile dal codice in PyCharm.
