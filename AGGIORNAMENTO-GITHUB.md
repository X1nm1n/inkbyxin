# Aggiornare il sito su GitHub Pages

Questa release elimina **Pages CMS e la possibilità di gestione mediante pannello amministrativo**, oltre a qualsiasi predisposizione per statistiche di visita. Rimangono le animazioni, il portfolio grafico, la sezione Università e il modulo contatti.

1. Estrarre questo ZIP e aprire la cartella in PyCharm.
2. Nel repository GitHub che pubblica il sito, sostituire il progetto precedente con questi file. Assicurarsi che `index.html` sia direttamente nella root pubblicata.
3. **Eliminare dal repository** anche i vecchi file `.pages.yml`, `content/progetti.json`, `content/materie.json`, `GUIDA-INTRO-ADMIN-STATISTICHE.md`, se presenti: non sono più necessari e non vengono cancellati automaticamente caricando soltanto i file nuovi.
4. Controllare in **Settings → Pages** la branch e la cartella di pubblicazione (es. `main` / `root`). Eseguire Commit e Push.
5. Dopo il deploy, controllare `https://TUO-USERNAME.github.io/TUO-REPO/verifica-versione.txt` per la versione `20261009-INTRO-STATIC`, quindi ricaricare con Ctrl+Shift+R.

Per aggiungere contenuti in futuro, usa `js/projects.js`, `js/materie.js` e `assets/media/`. Guida completa: `GUIDA-CARICAMENTO.md`.

L'animazione iniziale del logo è ancora attiva. Modulo contatti e privacy sono invariati: è necessario verificare il recapito con FormSubmit e aggiornare l'informativa se cambiano i servizi usati.
