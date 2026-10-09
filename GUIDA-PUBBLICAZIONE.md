# Pubblicare nuovi lavori e appunti — XIN

## Portfolio grafico

1. Metti una tua immagine `.webp`, `.jpg`, `.png` o `.svg` in `assets/media/progetti/`, `assets/media/illustrazioni/` o `assets/media/fotografie/`.
2. Apri `js/projects.js`, modifica una scheda dimostrativa oppure duplicala assegnando un `id` nuovo e unico.
3. Scegli una categoria: `branding`, `design`, `photo` o `editorial`. Inserisci `image:'./assets/media/progetti/nome.webp'`, `title`, `summary`, `description`, `alt`, `role`, `status` e `highlights`.
4. Salva, esegui Commit e Push su GitHub. L'immagine apparirà nella galleria con filtri, ricerca e finestra dettagli.

Non usare foto di persone riconoscibili senza adeguata base giuridica e autorizzazioni per le finalità specifiche.

## Appunti università, materia per materia

1. Vai in `js/materie.js` e aggiungi una materia con anno `1`, `2` o `3`, titolo, descrizione, argomenti e un array `risorse`.
2. Per ogni PDF originale creato da te, copia il documento nella cartella `assets/media/studio/3-anno/` o equivalente.
3. Aggiungi in `risorse` un elemento come `{ titolo:'Formulario', tipo:'PDF', file:'./assets/media/studio/3-anno/formulario.pdf' }`.
4. La pagina `studio.html` raggruppa e filtra le materie automaticamente. L'archivio è indipendente dal portfolio grafico.

Non caricare dispense dei docenti, libri o altri materiali protetti.

## Colori e animazioni

Modifica le variabili all'inizio di `css/atelier.css`. I colori principali sono `#eee3d5` (sabbia), `#17264b` (logo/navy), `#9c6448` (terracotta) e `#101c35` (tema scuro). Le animazioni sono in `js/atelier.js` e vengono ridotte automaticamente quando il sistema operativo richiede meno movimento.

## Privacy e contatti

Il modulo comunica con FormSubmit, servizio esterno che deve essere attivato tramite l'email inviata a `X1ngraphic1@gmail.com`. Prima di pubblicare, controlla `privacy.html`, la conservazione dei dati, i tuoi trattamenti effettivi e le autorizzazioni per le fotografie. Le liberatorie compilate non vanno caricate su GitHub.
