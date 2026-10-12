
from urllib.parse import urlparse
from playwright.sync_api import Page

BASE_URL = "http://localhost:8000"

def test_collegamenti_sito(page: Page):
    errori = []

    page.on("pageerror", lambda e:
            errori.append(f"JavaScript: {e}"))

    risposta = page.goto(BASE_URL)
    assert risposta is not None and risposta.ok

    collegamenti = page.locator("a[href]").evaluate_all(
        "(els) => els.map(a => a.href)"
    )

    for url in sorted(set(collegamenti)):
        if urlparse(url).netloc != urlparse(BASE_URL).netloc:
            continue

        try:
            risposta = page.request.head(url, timeout=15000)
            if risposta.status in (405, 501):
                risposta = page.request.get(url, timeout=15000)

            if risposta.status >= 400:
                errori.append(f"HTTP {risposta.status}: {url}")
        except Exception as e:
            errori.append(f"ERRORE: {url} - {e}")

    assert not errori, "\n".join(errori)
