# XIN — Graphic Design Portfolio

Sito statico HTML/CSS/JavaScript, pronto per PyCharm e GitHub Pages.

## Modifiche del 10 ottobre 2026

### Behind the Art — Dentro il processo

Al posto della vecchia grafica ripetuta trovi un video di **24 secondi** che mostra:

1. la fotografia originale;
2. la comparsa graduale delle linee e dei tracciati;
3. la costruzione delle campiture cromatiche;
4. il vettoriale finale.

Il video è una **ricostruzione dimostrativa** delle fasi, non una registrazione di una vera sessione di Illustrator. Puoi riprodurlo, fermarlo, scorrere la timeline o usare i pulsanti per andare a una delle quattro fasi.

### Chi sono — ritratto interattivo

Sostituito il precedente collage impreciso. Il ritratto viene **ricomposto esattamente** da dieci elementi ricavati dal lavoro fornito in `definitivo.ai`: copricapo, volto, occhi, sopracciglia, naso, bocca, colletto e gilet.

Le aree visibili sono indipendenti, i clic attraversano le zone trasparenti e i pezzi possono essere spostati anche su smartphone. Il pulsante **Ricomponi** riporta tutte le parti al loro posto; **Mescola** crea una piccola scomposizione. Usa le frecce della tastiera su un pezzo selezionato per spostarlo.

Il titolo **Xinmin.** è nuovamente marroncino (`#9C6448`). Layout e dimensioni della sezione About sono stati rivisti per desktop e mobile.

## Dove modificare

- `index.html` — contenuto delle sezioni;
- `css/behind-art.css` e `js/behind-art.js` — video e interazione;
- `css/portrait-lab.css` e `js/portrait-lab.js` — ritratto interattivo;
- `assets/custom/behind-process.mp4` — video finale;
- `assets/custom/portrait-base.png` e `assets/custom/piece-*.png` — tasselli del ritratto;
- `js/projects.js` — lavori del portfolio;
- `js/materie.js` — contenuti Università.

La galleria dei lavori rimane nella versione pulita; sono conservati l'introduzione del logo, i temi chiaro/scuro, Università, Privacy, Diritti e Contatti. Non sono stati aggiunti login o statistiche.

## Pubblicazione

Apri la cartella in PyCharm, poi pubblica **i file della cartella alla radice** del repository di GitHub Pages. Non caricare il solo file ZIP. Attendi il deploy e, se vedi la vecchia versione, premi `Ctrl+Shift+R`.

**Nota:** i riferimenti originali e le fasi intermedie sono dimostrazioni visive realizzate a partire dalla foto e dal vettoriale forniti, non vanno presentati come bozze storiche del lavoro.
