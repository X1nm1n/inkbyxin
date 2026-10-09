# Mascotte XIN con movimento articolato

La mascotte nella sezione “Un unico filo visivo” è ora uno **SVG originale composto da parti separate** dentro `index.html`. Non è più una PNG che oscilla. Gambe, polpacci, braccia, corpo, occhi e pennino hanno animazioni autonome.

Sequenza: camminata con alternanza dei passi e oscillazione delle braccia → salto con capriola → atterraggio → pennino che traccia una linea → respiro e occhiolino. Il pulsante “Riguarda l’animazione” la ripete.

- Il codice delle sequenze è in `js/mascot.js`.
- Le articolazioni e il loro movimento sono in `css/mascot-rig.css`.
- Il disegno SVG è in `index.html` nel blocco `id="xinMascotActor"`.
- Supporta `prefers-reduced-motion` (nessun effetto obbligatorio per chi riduce le animazioni).
- Non richiede backend né librerie esterne e funziona su GitHub Pages.

## Pubblicazione
Estrai lo ZIP, apri la cartella in PyCharm, copia tutti i file nel repository GitHub Pages (con `index.html` in radice) e fai commit/push. Dopo il deploy usa Ctrl+Shift+R per svuotare eventuale cache.

Nota: questa è una **mascotte SVG riggata**, non un filmato frame-by-frame. Le gambe e i piedi si muovono veramente separatamente, ma il movimento è stilizzato e non raggiunge la complessità di un cortometraggio disegnato a mano.
