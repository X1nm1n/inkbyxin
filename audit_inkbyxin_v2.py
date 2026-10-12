#!/usr/bin/env python3
"""Audit locale InkByXin: files, HTML/CSS/JS references and browser pages.

Copia questo file nella cartella principale di InkByXin e lancia:
    python audit_inkbyxin.py
    python audit_inkbyxin.py --browser

Il test statico usa soltanto la libreria standard di Python.
Per --browser: python -m pip install playwright && python -m playwright install chromium
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import posixpath
import re
import sys
import threading
from collections import Counter, defaultdict, deque
from datetime import datetime
from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parent
STUDIO = Path('assets/media/studio')
REPORT_FOLDER = 'report_test_sito'
SKIP_DIRS = {'.git', '.venv', 'venv', 'node_modules', '.idea', '__pycache__', '.pytest_cache', REPORT_FOLDER}
DOC_EXT = {'.pdf', '.docx', '.pptx', '.mp4', '.zip'}
ASSET_EXT = DOC_EXT | {'.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.json', '.webm', '.avif'}
CODE_EXT = {'.html', '.css', '.js'}
# Il JS viene letto come testo: nessuna esecuzione di codice in fase statica.
JS_LITERAL = re.compile(r'([\'"`])((?:\\.|(?!\1).)*?)\1', re.DOTALL)
CSS_URL = re.compile(r'url\(\s*[\'\"]?([^\)\'\"]+)[\'\"]?\s*\)', re.I)
CSS_IMPORT = re.compile(r'@import\s+[\'\"]([^\'\"]+)[\'\"]', re.I)


class HTMLLinks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        att = dict(attrs)
        for key in ('src', 'href', 'poster', 'data-src'):
            value = att.get(key)
            if value:
                self.refs.append((f'<{tag}> {key}', value))
        for key in ('srcset', 'data-srcset'):
            if att.get(key):
                for item in att[key].split(','):
                    src = item.strip().split(' ', 1)[0]
                    if src:
                        self.refs.append((f'<{tag}> {key}', src))


class Audit:
    def __init__(self, root: Path, strict: bool = False):
        self.root = root
        self.strict = strict
        self.files: dict[str, Path] = {}
        self.lower: dict[str, list[str]] = defaultdict(list)
        self.by_name: dict[str, list[str]] = defaultdict(list)
        self.records: list[dict] = []
        self.seen_issue: set[tuple[str, str, str]] = set()
        self.docs: list[dict] = []
        self.js_docs_referenced: set[str] = set()
        self.js_strings = 0
        self.dynamic_pages: set[str] = set()
        self.checked_local_references = 0
        self.browser_pages = 0
        self.browser_links = 0

    def record(self, level: str, area: str, message: str):
        signature = (level, area, message)
        if signature in self.seen_issue:
            return
        self.seen_issue.add(signature)
        self.records.append({'livello': level, 'area': area, 'dettaglio': message})

    def gather(self):
        for current, dirs, files in os.walk(self.root):
            dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)
            for name in sorted(files):
                full = Path(current) / name
                rel = full.relative_to(self.root).as_posix()
                self.files[rel] = full
                self.lower[rel.casefold()].append(rel)
                self.by_name[name.casefold()].append(rel)
        for key, actuals in self.lower.items():
            if len(actuals) > 1:
                self.record('ERRORE', 'nomi', f'Conflitto maiuscole/minuscole: {actuals}')

    def path_from_ref(self, ref: str, source: str) -> str | None:
        ref = ref.strip()
        if not ref or ref.startswith(('#', '//', '${', '{{')):
            return None
        # Frammenti SVG: url(#id) o url(%23id). Non sono file locali.
        # Un url(%23n) può comparire dentro una data:image/svg+xml,
        # anche quando un'espressione regolare intercetta l'url() annidato.
        if unquote(ref).startswith('#'):
            return None
        if re.match(r'^(?:mailto|tel|javascript|data|blob):', ref, re.I):
            return None
        if '${' in ref or '{{' in ref or '<%' in ref:
            return None
        try:
            parsed = urlsplit(ref)
        except ValueError:
            self.record('AVVISO', 'collegamenti', f'{source}: URL malformato: {ref[:160]}')
            return None
        if parsed.netloc or parsed.scheme:
            return None
        path = unquote(parsed.path).replace('\\', '/')
        if not path or path == '.':
            return None
        if path.startswith('/'):
            path = path.lstrip('/')
            # GitHub Pages può aggiungere il nome del repository ai percorsi assoluti.
            repo = self.root.name
            if path.lower().startswith(repo.lower() + '/'):
                path = path[len(repo) + 1:]
        else:
            path = posixpath.join(posixpath.dirname(source), path)
        result = posixpath.normpath(path)
        if result in ('', '.'):
            return None
        if result.startswith('../') or result == '..':
            return '!FUORI_ROOT! ' + ref
        if result.endswith('/'):
            result += 'index.html'
        return result

    def check_ref(self, source: str, kind: str, ref: str):
        path = self.path_from_ref(ref, source)
        if path is None:
            return
        self.checked_local_references += 1
        if path.startswith('!FUORI_ROOT!'):
            self.record('ERRORE', 'collegamenti', f'{source} [{kind}]: percorso fuori progetto: {ref}')
            return
        if path in self.files:
            return
        if path.casefold() in self.lower:
            actual = self.lower[path.casefold()][0]
            self.record('ERRORE', 'maiuscole', f'{source} [{kind}] -> {ref}\n  Usa esattamente: {actual}')
            return
        if '/' not in ref and (ref.lower().endswith('.html') or ref == '/'):
            # Possibile rotta virtuale? Il browser farà anche un controllo HTTP.
            pass
        self.record('ERRORE', 'collegamenti', f'{source} [{kind}] -> {ref}\n  File atteso: {path}')

    def check_structure(self):
        expected = ['index.html', 'studio.html', 'materia.html', 'js/materie.js',
                    'js/studio.js', 'js/materia.js', 'css/studio.css', 'css/materia.css']
        for rel in expected:
            if rel not in self.files:
                self.record('ERRORE', 'struttura', f'File principale mancante: {rel}')
        actual_studio = [x for x in self.files if x.startswith(STUDIO.as_posix() + '/')]
        if not actual_studio:
            self.record('ERRORE', 'struttura', 'Nessun materiale trovato in assets/media/studio/')

    def check_documents(self):
        for rel, full in self.files.items():
            if not rel.startswith(STUDIO.as_posix() + '/'):
                continue
            ext = full.suffix.lower()
            if ext not in DOC_EXT:
                continue
            size = full.stat().st_size
            parts = PurePosixPath(rel).parts
            anno = parts[3] if len(parts) > 3 else '?'
            materia = parts[4] if len(parts) > 4 else '?'
            self.docs.append({'anno': anno, 'materia': materia, 'file': rel,
                              'dimensione_mb': round(size / 1_000_000, 2),
                              'citato_in_materie_js': 'non verificato'})
            if size == 0:
                self.record('ERRORE', 'documenti', f'File vuoto: {rel}')
            elif ext == '.pdf':
                try:
                    with full.open('rb') as f:
                        header = f.read(1024)
                    if b'%PDF-' not in header:
                        self.record('ERRORE', 'documenti', f'PDF con intestazione non valida: {rel}')
                except OSError as exc:
                    self.record('ERRORE', 'documenti', f'Impossibile leggere: {rel} ({exc})')
            elif ext in {'.docx', '.pptx'}:
                try:
                    with full.open('rb') as f:
                        signature = f.read(4)
                    if signature[:2] != b'PK':
                        self.record('ERRORE', 'documenti', f'File Office non ZIP valido: {rel}')
                except OSError as exc:
                    self.record('ERRORE', 'documenti', f'Impossibile leggere: {rel} ({exc})')
            if size >= 100_000_000:
                self.record('ERRORE', 'git', f'File almeno 100 MB, GitHub potrebbe rifiutare il push: {rel} ({size/1e6:.1f} MB)')
            elif size >= 50_000_000:
                self.record('AVVISO', 'git', f'File almeno 50 MB, GitHub potrebbe segnalare un warning: {rel} ({size/1e6:.1f} MB)')
        for suffix in ('1-anno', '2-anno', '3-anno'):
            if not (self.root / STUDIO / suffix).is_dir():
                self.record('ERRORE', 'struttura', f'Cartella anno mancante: {STUDIO / suffix}')

    def check_markup(self):
        for rel, full in self.files.items():
            if full.suffix.lower() not in {'.html', '.css'}:
                continue
            try:
                content = full.read_text(encoding='utf-8-sig')
            except (UnicodeError, OSError) as exc:
                self.record('ERRORE', 'codice', f'Impossibile leggere {rel}: {exc}')
                continue
            refs = []
            if rel.endswith('.html'):
                parser = HTMLLinks()
                parser.feed(content)
                refs = parser.refs
            else:
                refs = [('CSS url()', value) for value in CSS_URL.findall(content)]
                refs += [('CSS @import', value) for value in CSS_IMPORT.findall(content)]
            for kind, value in refs:
                self.check_ref(rel, kind, value)

    def check_js_assets(self):
        for rel, full in self.files.items():
            if not rel.endswith('.js'):
                continue
            try:
                code = full.read_text(encoding='utf-8-sig')
            except (UnicodeError, OSError) as exc:
                self.record('ERRORE', 'codice', f'Impossibile leggere JS {rel}: {exc}')
                continue
            for match in JS_LITERAL.finditer(code):
                value = match.group(2).replace('\\/', '/')
                # Considera riferimenti espliciti ad asset, non etichette, route o stringhe dinamiche.
                if '${' in value or '\\' in value and not value.endswith('\\'):
                    # Windows escape in JS: non inferire percorsi complessi.
                    continue
                try:
                    parsed = urlsplit(value)
                except ValueError:
                    continue
                candidate = unquote(parsed.path.replace('\\', '/'))
                ext = PurePosixPath(candidate).suffix.lower()
                if ext not in ASSET_EXT:
                    continue
                if parsed.scheme or parsed.netloc:
                    continue
                if rel == 'js/materie.js' and ext in DOC_EXT:
                    self.js_strings += 1
                # Se c'è il percorso esatto assets/ o un riferimento relativo chiaro, controllalo.
                if candidate.startswith(('assets/', '/assets/', '../assets/', './assets/')):
                    normal = candidate[1:] if candidate.startswith('/assets/') else candidate
                    normal = normal[2:] if normal.startswith('./assets/') else normal
                    from_file = 'index.html' if normal.startswith('assets/') else rel
                    self.check_ref(from_file, f'JS ({rel})', normal)
                    if rel == 'js/materie.js' and ext in DOC_EXT:
                        base = PurePosixPath(candidate).name.casefold()
                        self.js_docs_referenced.update(self.by_name.get(base, []))
                elif ext in DOC_EXT and rel == 'js/materie.js':
                    # Se l'app crea il prefisso a runtime, il nome deve almeno esistere sul disco.
                    base = PurePosixPath(candidate).name
                    matches = self.by_name.get(base.casefold(), [])
                    if not matches:
                        self.record('ERRORE', 'materie.js', f'File dichiarato in materie.js ma non trovato nel progetto: {base}')
                    else:
                        if '/' in candidate:
                            suffix = candidate.lstrip('./').casefold()
                            matched = [x for x in matches if x.casefold().endswith('/' + suffix)]
                            if not matched:
                                self.record('ERRORE', 'materie.js',
                                            f'Percorso file non corrispondente alle cartelle: {candidate} (file con stesso nome: {matches})')
                            else:
                                self.js_docs_referenced.update(matched)
                                if not any(x.endswith('/' + candidate.lstrip('./')) for x in matched):
                                    self.record('ERRORE', 'maiuscole', f'Maiuscole diverse nel percorso JS: {candidate}; sul disco: {matched}')
                        else:
                            self.js_docs_referenced.update(matches)
                            if not any(PurePosixPath(x).name == base for x in matches):
                                self.record('ERRORE', 'maiuscole', f'Nome in materie.js con maiuscole diverse: {base}; sul disco: {matches}')
                elif candidate.startswith(('../', './')) or '/' in candidate:
                    # Altri script possono usare percorsi calcolati a runtime: qui test solo di riferimenti chiari.
                    self.check_ref(rel, f'JS ({rel})', candidate)
        if 'js/materie.js' not in self.files:
            return
        for doc in self.docs:
            doc['citato_in_materie_js'] = 'sì' if doc['file'] in self.js_docs_referenced else 'non individuato'
        if self.js_strings:
            missing = [d['file'] for d in self.docs if d['file'] not in self.js_docs_referenced]
            if missing:
                self.record('AVVISO', 'materie.js',
                            f'{len(missing)} file di studio senza riferimento letterale individuato in materie.js. '
                            'Potrebbero essere generati dinamicamente: NON significa necessariamente che siano scollegati. '
                            'Consulta inventario_materiale.csv.')
        else:
            self.record('AVVISO', 'materie.js', 'Nessun filename di materiale ricavato dalle stringhe letterali; il catalogo potrebbe essere dinamico. Verifica con --browser.')

    def compare_snapshot(self):
        snap = self.root / 'struttura_progetto.txt'
        if not snap.exists():
            return
        try:
            expected = snap.read_text(encoding='utf-8-sig').splitlines()
        except (UnicodeError, OSError):
            return
        missing = []
        for rel in expected:
            rel = rel.strip().replace('\\', '/')
            if rel.startswith(STUDIO.as_posix() + '/') and Path(rel).suffix.lower() in DOC_EXT:
                if rel not in self.files:
                    missing.append(rel)
        for rel in missing[:50]:
            self.record('AVVISO', 'snapshot', f'Nel precedente elenco ma ora assente: {rel}')
        if len(missing) > 50:
            self.record('AVVISO', 'snapshot', f'Altri {len(missing)-50} file del precedente elenco non presenti.')

    def run_browser(self):
        try:
            from playwright.sync_api import sync_playwright, Error as PlaywrightError
        except ImportError:
            self.record('AVVISO', 'browser', 'Playwright non installato. Comando: python -m pip install playwright')
            return

        class QuietHandler(SimpleHTTPRequestHandler):
            def log_message(self, format, *args):
                return

        server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(self.root)))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base_url = f'http://127.0.0.1:{server.server_port}/'
        try:
            with sync_playwright() as p:
                try:
                    browser = p.chromium.launch(headless=True)
                except PlaywrightError as exc:
                    self.record('ERRORE', 'browser', f'Impossibile avviare Chromium: {str(exc)[:200]}. Prova: python -m playwright install chromium')
                    return
                context = browser.new_context(viewport={'width': 1365, 'height': 800},
                                              accept_downloads=True)
                seeds = [s for s in ('index.html', 'studio.html', 'privacy.html', 'diritti.html')
                         if s in self.files]
                queue = deque(urljoin(base_url, s) for s in seeds)
                visited = set()
                asset_urls = set()
                max_pages = 100
                while queue and len(visited) < max_pages:
                    url = queue.popleft()
                    if url in visited:
                        continue
                    visited.add(url)
                    page = context.new_page()
                    errors = []
                    page.on('pageerror', lambda err: errors.append(f'Errore JavaScript: {err}'))
                    page.on('console', lambda msg: errors.append(f'Console JS: {msg.text}')
                            if msg.type == 'error' and msg.location.get('url', '').startswith(base_url) else None)
                    page.on('response', lambda response: errors.append(f'HTTP {response.status}: {response.url}')
                            if response.url.startswith(base_url) and response.status >= 400 else None)
                    try:
                        resp = page.goto(url, wait_until='domcontentloaded', timeout=15000)
                        if resp is None or resp.status >= 400:
                            self.record('ERRORE', 'browser', f'Pagina non caricata: {url} (HTTP {resp.status if resp else "nessuna risposta"})')
                        else:
                            page.wait_for_timeout(550)
                            self.browser_pages += 1
                            page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                            page.wait_for_timeout(250)
                            hrefs = page.locator('a[href]').evaluate_all(
                                '(items) => items.map(a => a.href)')
                            srcs = page.locator('img[src], source[src], video[src], iframe[src]').evaluate_all(
                                '(items) => items.map(a => a.src)')
                            links = hrefs + srcs
                            for href in links:
                                target = urlsplit(href)
                                if target.scheme not in ('http', 'https') or target.netloc != urlsplit(base_url).netloc:
                                    continue
                                path = unquote(target.path)
                                if not path or path == '/':
                                    continue
                                ext = PurePosixPath(path).suffix.lower()
                                if ext in (ASSET_EXT | {'.html'}) or path.endswith('/'):
                                    if ext == '.html' or path.endswith('/'):
                                        if href not in visited:
                                            queue.append(href.split('#', 1)[0])
                                    else:
                                        asset_urls.add(href.split('#', 1)[0])
                            broken_images = page.locator('img').evaluate_all(
                                '(items) => items.filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute("src")).map(i => i.getAttribute("src"))')
                            for src in broken_images:
                                errors.append(f'Immagine non caricata: {src}')
                    except Exception as exc:
                        errors.append(f'Errore caricamento {url}: {str(exc)[:180]}')
                    for error in set(errors):
                        self.record('ERRORE', 'browser', f'{url}: {error}')
                    page.close()
                if len(visited) >= max_pages:
                    self.record('AVVISO', 'browser', f'Raggiunto limite scansione di {max_pages} URL. Una parte del sito non è stata esplorata.')
                for url in sorted(asset_urls):
                    self.browser_links += 1
                    try:
                        resp = context.request.head(url, timeout=12000)
                        if resp.status in (405, 501):
                            resp = context.request.get(url, timeout=12000)
                        if resp.status >= 400:
                            self.record('ERRORE', 'browser', f'Link a file non funzionante: HTTP {resp.status}: {url}')
                    except Exception as exc:
                        self.record('ERRORE', 'browser', f'Link a file non raggiungibile: {url}: {str(exc)[:120]}')
                context.close()
                browser.close()
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=3)

    def output(self):
        folder = self.root / REPORT_FOLDER
        folder.mkdir(exist_ok=True)
        counts = Counter(record['livello'] for record in self.records)
        subjects = Counter((d['anno'], d['materia']) for d in self.docs)
        info = {
            'eseguito_il': datetime.now().astimezone().isoformat(timespec='seconds'),
            'directory': str(self.root),
            'file_totali': len(self.files),
            'materie': len(subjects),
            'materiali': len(self.docs),
            'pdf_di_studio': sum(d['file'].lower().endswith('.pdf') for d in self.docs),
            'materiali_con_nome_individuato_in_materie_js': sum(
                d['citato_in_materie_js'] == 'sì' for d in self.docs),
            'riferimenti_statici_verificati': self.checked_local_references,
            'pagine_browser': self.browser_pages,
            'collegamenti_file_browser': self.browser_links,
            'errori': counts['ERRORE'],
            'avvisi': counts['AVVISO'],
            'materie_dettaglio': [{'anno': x[0], 'materia': x[1], 'file': n}
                                 for x, n in sorted(subjects.items())],
            'problemi': self.records
        }
        (folder / 'risultati.json').write_text(json.dumps(info, indent=2, ensure_ascii=False), encoding='utf-8')
        with (folder / 'inventario_materiale.csv').open('w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['anno', 'materia', 'file', 'dimensione_mb', 'citato_in_materie_js'])
            writer.writeheader()
            writer.writerows(sorted(self.docs, key=lambda d: d['file'].casefold()))
        lines = [
            'AUDIT INKBYXIN',
            '=' * 70,
            f'Directory: {self.root}',
            f'File totali rilevati: {len(self.files)}',
            f'Materie: {len(subjects)}',
            f'Materiali di studio: {len(self.docs)}',
            f'PDF di studio: {info["pdf_di_studio"]}',
            f'Materiali con nome individuato in materie.js: {info["materiali_con_nome_individuato_in_materie_js"]}/{len(self.docs)} (non garantisce l’URL finale)',
            f'Riferimenti HTML/CSS/JS controllati: {self.checked_local_references}',
            f'Pagine aperte nel browser: {self.browser_pages}',
            f'Collegamenti ai file controllati nel browser: {self.browser_links}',
            f'ERRORI: {counts["ERRORE"]}  |  AVVISI: {counts["AVVISO"]}',
            '', 'MATERIE', '-' * 70,
        ]
        lines.extend(f'{anno:8} | {subject:34} | {n:3} file'
                     for (anno, subject), n in sorted(subjects.items()))
        lines.extend(['', 'PROBLEMI E AVVISI', '-' * 70])
        if not self.records:
            lines.append('Nessun problema rilevato dai controlli eseguiti.')
        for record in self.records:
            lines.append(f'[{record["livello"]}] [{record["area"]}] {record["dettaglio"]}')
        lines.extend(['', 'NOTA: l’assenza di errori non dimostra che tutte le funzionalità del sito '
                       'siano corrette. I collegamenti generati solo dopo click/interazioni '
                       'complesse richiedono test specifici.'])
        report_path = folder / 'report.txt'
        report_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
        print('\n'.join(lines[:11]))
        print(f'\nReport: {report_path}')
        print(f'Inventario: {folder / "inventario_materiale.csv"}')
        print(f'JSON: {folder / "risultati.json"}')
        if counts['ERRORE']:
            print('\nPRIMI ERRORI:')
            for r in [x for x in self.records if x['livello'] == 'ERRORE'][:10]:
                print(f' - {r["area"]}: {r["dettaglio"]}')
        return counts['ERRORE']


def main():
    parser = argparse.ArgumentParser(description='Test completo dei file InkByXin e dei link locali.')
    parser.add_argument('--browser', action='store_true', help='Apri le pagine reali con Playwright/Chromium.')
    parser.add_argument('--strict', action='store_true', help='Uscita non-zero anche per gli avvisi.')
    args = parser.parse_args()
    audit = Audit(ROOT, args.strict)
    print('Scansione del progetto:', ROOT)
    audit.gather()
    audit.check_structure()
    audit.check_documents()
    audit.check_markup()
    audit.check_js_assets()
    audit.compare_snapshot()
    if not args.browser:
        print('Nota: browser non eseguito; aggiungi --browser per controllare le pagine e i link HTTP.')
    if args.browser:
        print('Controllo browser in corso (server locale automatico)...')
        audit.run_browser()
    failures = audit.output()
    return 1 if failures or (args.strict and any(x['livello'] == 'AVVISO' for x in audit.records)) else 0


if __name__ == '__main__':
    sys.exit(main())
