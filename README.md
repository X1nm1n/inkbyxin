# XIN — Graphic Design Portfolio

Sito statico HTML/CSS/JavaScript per PyCharm e GitHub Pages.

## Behind the Art — tre immagini

La sezione **Behind the Art** presenta tre immagini dello stesso ritratto:

1. **Foto originale**, con il suo sfondo e le persone presenti nella scena.
2. **Bozza dei contorni**, ricavata dal vettoriale finale mantenendo anche i tracciati dello sfondo.
3. **Vettoriale finale**, l'illustrazione completa derivata dal lavoro dell'autore.

Le tre immagini sono visibili nella stessa galleria. Cliccando una fotografia la si può ingrandire e si possono confrontare le fasi con i pulsanti *Precedente/Successiva* o con le frecce della tastiera. Il precedente timelapse è stato rimosso.

**Trasparenza sul processo:** la bozza non è un disegno preparatorio storico dell'autore, ma una ricostruzione dei contorni ottenuta a partire dall'immagine vettoriale finale. Le altre due immagini provengono dalla fotografia e dal vettoriale forniti dall'autore. Tutte conservano la scena dello sfondo.

## Sezione Chi sono

Resta invariato il ritratto vettoriale intero sulla sinistra e la presentazione sulla destra, con "Xinmin." in marroncino.

## File principali

- `index.html`: struttura della homepage e delle sezioni.
- `css/behind-art.css`: layout desktop/mobile della galleria a tre fasi.
- `js/behind-art.js`: ingrandimento e navigazione fra le immagini.
- `assets/custom/behind-photo.jpg`: fotografia originale.
- `assets/custom/behind-sketch-contours.png`: bozza a contorni ricostruita.
- `assets/custom/behind-final.png`: illustrazione vettoriale finale (immagine).
- `css/portrait-lab.css`: sezione Chi sono.
- `js/projects.js`: lavori del portfolio.
- `js/materie.js`: archivio universitario.

## Pubblicazione

Apri la cartella estratta in PyCharm. Copia i **contenuti della cartella** alla radice del repository GitHub Pages, non il file ZIP né un'ulteriore cartella contenitore. Verifica che `index.html` sia alla radice. Dopo la pubblicazione ricarica forzatamente la pagina con `Ctrl+Shift+R`.
