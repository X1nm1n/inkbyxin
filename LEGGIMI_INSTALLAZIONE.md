# InkByXin — eliminazione download ZIP per materia

Questo aggiornamento rimuove **solo** gli archivi ZIP scaricabili dalle pagine delle materie.
Rimangono: download singolo di PDF, DOCX, PPTX e MP4; preferiti; condivisione; segnalazione dei problemi.
La sezione Università mantiene la posizione attuale nella homepage; restano gli ultimi spazi ottimizzati e tutti i social.

## Installazione in PyCharm

1. Fai un backup o un commit Git.
2. Estrai `InkByXin_senza_download_ZIP_solo_modifiche.zip` nella **radice** del progetto `inkbyxin`.
3. Mantieni le cartelle presenti e **sovrascrivi solo i sette file** contenuti nell'archivio.
4. Non eliminare alcun PDF né sostituire `js/materie.js`: il catalogo è lasciato invariato.
5. In PyCharm apri `materia.html?id=analisi-1` tramite server locale e verifica i pulsanti «Apri» e «Scarica» per un PDF.
6. Verifica preferiti, condivisione e segnalazioni. Esegui anche `python audit_inkbyxin_v2.py --browser`.
7. Aggiorna la pagina con Ctrl+F5.

## Pulizia facoltativa dei file ora inutilizzati

Dopo aver aggiornato le pagine puoi eliminare due file *esclusivamente* se esistono:

```powershell
Remove-Item .\genera_zip_materie.py, .\js\zip-manifest.js -ErrorAction SilentlyContinue
```

Questi file non sono più richiamati dal sito, dunque puoi anche lasciarli fino a quando hai verificato la nuova versione.
Se hai già generato ZIP in `assets/media/studio/zip`, questi non sono più usati dalle pagine; puoi eliminarli **se desideri**, dopo aver verificato che siano realmente vecchi archivi. Nessun archivio o PDF viene cancellato automaticamente.

## File aggiornati

- `materia.html`: eliminati contenitore degli ZIP e import dello ZIP manifest.
- `js/materia.js`: rimossa generazione dei pulsanti ZIP; lasciati download singoli e segnalazioni.
- `css/study-features.css`: rimosse regole obsolete degli archivi.
- `js/studio.js`: conteggio materiale senza ZIP.
- `studio.html`: rinnovo versioni delle risorse, per svuotare la cache.
- `js/home-data.js`: aggiornata la notizia della homepage e preservati Instagram grafico, Instagram personale e GitHub.
- `index.html`: rinnovo versione delle novità; preservate le ultime correzioni di spaziatura.

Questo aggiornamento non include materiali universitari né una nuova copia di `materie.js`: sono tutti conservati nel tuo progetto.
