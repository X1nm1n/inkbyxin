# Come pubblicare foto, progetti e appunti da PyCharm

Questa versione NON usa un CMS né un pannello di amministrazione. Non raccoglie statistiche di navigazione. Le modifiche si fanno in PyCharm e si pubblicano con GitHub.

## Aggiungere un progetto grafico
1. Copia una tua immagine `.webp`, `.jpg`, `.png` o `.svg` nella cartella `assets/media/progetti/`, `assets/media/fotografie/` oppure `assets/media/illustrazioni/`.
2. Apri **`js/projects.js`** e aggiungi una scheda nell'array `window.XIN_PROJECTS` (puoi duplicare una scheda esistente). Cambia almeno `id`, `title`, `category`, `summary`, `description`, `image` e `alt`.
3. La categoria deve essere `branding`, `design`, `photo` oppure `editorial`. Esempio di campo immagine: `image:'./assets/media/progetti/copertina.webp'`.
4. Salva e invia le modifiche al repository pubblico (Commit e Push).

## Aggiungere una materia o un documento universitario
1. Copia il tuo PDF originale in `assets/media/studio/1-anno/`, `2-anno/` o `3-anno/`.
2. Apri **`js/materie.js`**. Aggiungi una scheda nell'array `window.XIN_MATERIE` con `id`, `anno` (`1`, `2` o `3`), `titolo`, `descrizione`, `argomenti` e `risorse`.
3. In `risorse`, inserisci per esempio: `{ titolo:'Formulario', tipo:'PDF', file:'./assets/media/studio/3-anno/formulario.pdf' }`.
4. Salva, fai Commit e Push. Il PDF sarà raggiungibile dalla pagina Università.

**Attenzione:** tutti i file caricati in un repository GitHub Pages pubblico sono accessibili a chiunque. Non pubblicare liberatorie firmate, dati dei clienti o documenti di terzi senza autorizzazione.

## Come verificare
Dopo il deploy GitHub Pages, apri l'indirizzo del tuo sito e prova filtri e link PDF. `verifica-versione.txt` deve contenere `20261009-INTRO-STATIC`.

Per rivedere la sequenza iniziale della X, aggiungi `?intro=1` all'URL della homepage. Il modulo contatti richiede l'attivazione iniziale di FormSubmit e un messaggio di prova.
