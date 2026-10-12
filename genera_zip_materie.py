#!/usr/bin/env python3
"""Genera ZIP statici (<95 MB decimal) per materia e aggiorna js/zip-manifest.js.

Da eseguire nella root InkByXin DOPO aver copiato qui i documenti reali.
Esempi:
    python genera_zip_materie.py --materia analisi-2
    python genera_zip_materie.py --all
    python genera_zip_materie.py --list

Non serve un backend in produzione: GitHub Pages serve direttamente gli ZIP creati.
Non pubblicare materiale senza il diritto di distribuirlo.
"""

from __future__ import annotations
import argparse
import json
import os
import re
import sys
import time
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / 'js' / 'materie.js'
MANIFEST = ROOT / 'js' / 'zip-manifest.js'
OUT = ROOT / 'assets' / 'media' / 'studio' / 'zip'
MAX_BYTES = 95_000_000  # Inferiore a 99 MB (decimali), con margine per GitHub.
RESOURCE_PREFIX = './assets/media/studio/'
MANIFEST_PREFIX = 'window.XIN_ZIP_MANIFEST = '


def load_catalog() -> list[dict]:
    data = CATALOG.read_text(encoding='utf-8-sig')
    m = re.search(r'window\.XIN_MATERIE\s*=\s*(\[.*\]);?\s*$', data, re.S)
    if m is None:
        raise ValueError('Catalogo materie.js non nel formato atteso: window.XIN_MATERIE = [...];')
    catalog = json.loads(m.group(1))
    if not isinstance(catalog, list):
        raise ValueError('Catalogo materie non valido')
    return catalog


def read_manifest() -> dict:
    if not MANIFEST.is_file():
        return {}
    source = MANIFEST.read_text(encoding='utf-8').strip()
    m = re.search(r'window\.XIN_ZIP_MANIFEST\s*=\s*(\{.*\});?\s*$', source, re.S)
    if not m:
        raise ValueError('Formato js/zip-manifest.js non riconosciuto; non sovrascrivo il file')
    result = json.loads(m.group(1))
    if not isinstance(result, dict):
        raise ValueError('Manifest ZIP non valido')
    return result


def resolve_resource(url: str) -> Path:
    if not isinstance(url, str) or not url.startswith(RESOURCE_PREFIX):
        raise ValueError(f'Percorso fuori archivio: {url!r}')
    parsed = urlsplit(url)
    if parsed.query or parsed.fragment or parsed.scheme or parsed.netloc:
        raise ValueError(f'URL materiale non supportato: {url!r}')
    rest = unquote(url[len(RESOURCE_PREFIX):]).replace('\\', '/')
    parts = Path(rest).parts
    if not parts or any(part in ('.', '..') for part in parts):
        raise ValueError(f'Percorso materiale pericoloso: {url!r}')
    resolved = (ROOT / 'assets/media/studio' / Path(*parts)).resolve()
    if not resolved.is_relative_to((ROOT / 'assets/media/studio').resolve()):
        raise ValueError(f'Percorso materiale fuori dalla cartella: {url!r}')
    return resolved


def group_by_capacity(paths: list[Path]) -> list[list[Path]]:
    groups: list[list[Path]] = []
    current: list[Path] = []
    size = 22
    for f in paths:
        # ZIP_STORED: overhead entry  + UTF-8 extra fields. Sovrastima prudenziale.
        estimated = f.stat().st_size + max(2048, len(f.name.encode('utf-8')) * 3 + 512)
        if estimated > MAX_BYTES:
            raise ValueError(f'{f.name} supera il limite per un singolo ZIP (95 MB). '
                             'Riduci il file sorgente prima di generare l’archivio.')
        if current and size + estimated > MAX_BYTES:
            groups.append(current)
            current, size = [], 22
        current.append(f)
        size += estimated
    if current:
        groups.append(current)
    return groups


def create_subject(item: dict, existing: dict) -> list[dict]:
    id = item.get('id', '')
    if not isinstance(id, str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]*', id):
        raise ValueError(f'Identificativo materia non valido: {id!r}')
    resources = item.get('risorse', [])
    if not isinstance(resources, list):
        raise ValueError(f'Risorse non valide per {id}')
    docs: list[Path] = []
    missing: list[str] = []
    names: set[str] = set()
    for resource in resources:
        file = resolve_resource(resource.get('file', ''))
        if not file.is_file():
            missing.append(str(file.relative_to(ROOT)))
        else:
            if file.name in names:
                raise ValueError(f'Due documenti hanno lo stesso nome: {file.name}')
            names.add(file.name)
            docs.append(file)
    if missing:
        raise ValueError('Documenti mancanti: ' + '; '.join(missing[:8]) +
                         (f' (+{len(missing)-8} altri)' if len(missing) > 8 else ''))
    if not docs:
        raise ValueError('Materia senza documenti: non genero ZIP vuoti')
    groups = group_by_capacity(docs)
    OUT.mkdir(parents=True, exist_ok=True)
    pending: list[tuple[Path, Path]] = []
    info: list[dict] = []
    try:
        for idx, chunk in enumerate(groups, 1):
            filename = f'{id}-parte-{idx:02}.zip'
            final_path = OUT / filename
            with tempfile.NamedTemporaryFile(dir=OUT, suffix='.tmp', delete=False) as tmp:
                temporary_path = Path(tmp.name)
            pending.append((temporary_path, final_path))
            with zipfile.ZipFile(temporary_path, mode='w', compression=zipfile.ZIP_STORED, allowZip64=True) as archive:
                for f in chunk:
                    archive.write(f, arcname=f.name)
            bytes_count = temporary_path.stat().st_size
            if bytes_count >= 99_000_000:
                raise ValueError(f'{filename} troppo grande ({bytes_count} byte): nessun ZIP aggiornato')
            with zipfile.ZipFile(temporary_path) as archive:
                if archive.testzip() is not None:
                    raise ValueError(f'{filename} corrotto')
            info.append({'file': f'./assets/media/studio/zip/{filename}',
                         'bytes': bytes_count, 'documenti': len(chunk)})
        # Solo dopo che ogni parte è stata verificata, sostituisco quelle precedenti.
        for temp, dest in pending:
            os.replace(temp, dest)
        expected = {p.name for _, p in pending}
        for old in existing.get(id, []):
            old_path = OUT / Path(old.get('file', '')).name
            if old_path.is_file() and old_path.name.startswith(f'{id}-parte-') and old_path.name not in expected:
                old_path.unlink()
        return info
    finally:
        for temporary_path, _ in pending:
            temporary_path.unlink(missing_ok=True)


def bump_cache_versions() -> None:
    """Fa ricaricare catalogo e manifest aggiornati ai browser dopo il deploy."""
    stamp = str(time.time_ns())
    pattern = re.compile(r'(\./js/(?:materie|zip-manifest)\.js\?v=)[^"\s<>]+')
    for name in ('studio.html', 'materia.html'):
        file = ROOT / name
        if not file.is_file():
            continue
        html = file.read_text(encoding='utf-8')
        updated = pattern.sub(lambda m: m.group(1) + stamp, html)
        if updated != html:
            file.write_text(updated, encoding='utf-8')


def write_manifest(data: dict) -> None:
    js = '/* Generato da genera_zip_materie.py. NON modificare manualmente. */\n' + \
        MANIFEST_PREFIX + json.dumps(data, indent=2, ensure_ascii=False) + ';\n'
    with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=MANIFEST.parent,
                                     suffix='.tmp', delete=False) as tmp:
        tmp.write(js)
        name = tmp.name
    os.replace(name, MANIFEST)
    bump_cache_versions()


def main() -> int:
    ap = argparse.ArgumentParser(description='Genera gli ZIP di InkByXin e il manifest per la pagina delle materie.')
    selection = ap.add_mutually_exclusive_group(required=True)
    selection.add_argument('--materia', metavar='ID', help='Rigenera soltanto la materia indicata (es. analisi-2).')
    selection.add_argument('--all', action='store_true', help='Genera tutte le materie (richiede tutti i materiali sul disco).')
    selection.add_argument('--list', action='store_true', help='Elenca i nomi identificativi delle materie.')
    args = ap.parse_args()
    try:
        catalog = load_catalog()
        if args.list:
            for item in catalog:
                print(f"{item['id']:<40} {item.get('titolo','')} — {len(item.get('risorse',[]))} file")
            return 0
        targets = [i for i in catalog if args.all or i.get('id') == args.materia]
        if not targets:
            print('Materia non trovata; usa --list', file=sys.stderr)
            return 2
        manifest = read_manifest()
        errors = 0
        for item in targets:
            try:
                parts = create_subject(item, manifest)
                manifest[item['id']] = parts
                write_manifest(manifest)
                print(f"OK {item['id']}: {sum(x['documenti'] for x in parts)} file in {len(parts)} ZIP; "
                      f"{sum(x['bytes'] for x in parts)/1_000_000:.1f} MB complessivi")
            except (ValueError, OSError, zipfile.BadZipFile) as exc:
                errors += 1
                print(f"ERRORE {item.get('id')}: {exc}", file=sys.stderr)
        print(f'Finito: {len(targets) - errors} materie elaborate, {errors} errori.')
        return 1 if errors else 0
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print(f'ERRORE: {exc}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
