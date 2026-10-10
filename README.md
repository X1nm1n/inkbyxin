# XIN — Portfolio grafico · Segno vivo

Sito statico per **GitHub Pages**, modificabile in **PyCharm**.

## Novità di questa versione
- Rimossa completamente la mascotte e il relativo sistema di animazione.
- La sezione tra l’introduzione e il racconto dei tre linguaggi contiene ora **Living Ink**, una composizione SVG originale che cambia forma tra Design, Illustrazione e Fotografia e che viene tracciata da un pennino animato.
- Non ci sono login amministratore, CMS o script di statistiche.
- Rimane la galleria Portfolio in versione pulita (senza cornici da stampe), l’introduzione animata del logo, la pagina Università, Privacy, Diritti e il modulo Contatti.

## Modifiche
- `index.html` — sezioni della homepage
- `css/ink-lab.css` — stile della nuova scena
- `js/ink-lab.js` — selettore dei tre linguaggi e tracciamento
- `js/projects.js` — progetti grafici
- `js/materie.js` — materie e PDF
- `assets/media/` — immagini e appunti

Il modulo contatti usa FormSubmit e richiede l'attivazione tramite la casella Gmail configurata. Non pubblicare liberatorie firmate dei clienti nel repository.

## Pubblicazione
Carica **il contenuto della cartella** alla radice del repository GitHub Pages, non lo ZIP come file. Attendi il deploy e fai un refresh forzato (`Ctrl+Shift+R`) sul sito.

## Animazioni e accessibilità
Usa i pulsanti Design / Illustrazione / Fotografia o le frecce della tastiera per cambiare scena. Il pulsante “Rivedi il tratto” riavvia il disegno. Le preferenze `prefers-reduced-motion` vengono rispettate.
