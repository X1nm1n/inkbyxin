# XIN — Portfolio grafico immersivo (2026)

Progetto statico HTML + CSS + JavaScript pronto da aprire in **PyCharm** e pubblicare su **GitHub Pages**. Il sito principale è un portfolio di **graphic design**; gli appunti universitari non appaiono nella galleria dei lavori, ma nella pagina indipendente `studio.html`.

## Novità: direzione visiva ATELIER

- **Tema chiaro:** carta sabbia `#eee3d5`, superfici avorio `#faf5ed`, blu XIN `#17264b`, accento terracotta `#9c6448`.
- **Tema scuro:** blu notte `#101c35`, superfici `#172644`, testi chiari e riflessi caldi.
- **Hero interattiva:** poster a più livelli con il tuo logo XIN, movimento al passaggio del puntatore, un tasto «Cambia prospettiva» e animazioni CSS. L'elemento funziona anche con tastiera.
- **Percorso verticale:** una composizione visiva rimane ferma mentre il racconto cambia in tre capitoli: branding, illustrazione, fotografia. Il tutto risponde allo scroll; i pallini consentono di saltare direttamente a una scena.
- **Portfolio:** galleria filtrabile, ricerca, schede progetto apribili; soltanto la tua identità XIN è presentata come progetto reale. Gli altri lavori sono segnaposto dichiarati.
- **Università:** archivio completamente autonomo, ordinato per anno e materia, predisposto per PDF originali personali.
- **Contatti:** FormSubmit verso `X1ngraphic1@gmail.com`. La ricezione richiede l'attivazione dell'indirizzo e una prova reale dopo la pubblicazione.

## Pubblica su GitHub Pages

1. Estrai lo ZIP. In PyCharm scegli **File → Open** e apri la cartella.
2. Non servono `pip install`, FastAPI, Python o Node in produzione. Il browser esegue direttamente gli script JavaScript.
3. Carica il contenuto della cartella (incluso `index.html` nella root) in un repository GitHub pubblico.
4. **Settings → Pages → Deploy from a branch → main / (root)**. Attendi l'indirizzo pubblico.
5. Verifica navigazione, tema, immagini, PDF e modulo contatti. Conferma la prima richiesta di attivazione FormSubmit nella tua Gmail.

## Dove modificare i contenuti

- `index.html` — testi e struttura; `css/style.css` è lo stile legacy, **`css/atelier.css`** contiene la nuova direzione visiva.
- `js/main.js` — funzionalità della galleria, menu, contatti e ricerca; `js/atelier.js` — esperienza verticale e composizione interattiva.
- `js/projects.js` — aggiungi progetti grafici e copertine in `assets/media/{progetti,fotografie,illustrazioni}`.
- `js/materie.js` — aggiungi le materie della triennale; i PDF originali vanno in `assets/media/studio/`.
- `assets/logo-xin.svg` — simbolo XIN blu con pennino fornito dall'autore, senza scritta sottostante.
- `privacy.html`, `diritti.html`, `documenti/` — informative e modelli di liberatoria. Devono essere verificati rispetto ai trattamenti reali prima dell'uso con clienti. **Non pubblicare PDF firmati dai clienti nel repository.**

L'accessibilità include rispetto di `prefers-reduced-motion`, navigazione con tastiera e fallback statici per l'esperienza animata. È un sito senza pannello admin: nuovi file e contenuti vengono pubblicati modificando il progetto e inviandolo a GitHub.


## XIN / Experimental Type Lab (2026)
La sezione Chi sono ora ospita una composizione tipografica interattiva, senza il logo gigante. I tre elementi si possono trascinare con mouse o touch (oppure spostare con i tasti freccia), e **Rimescola** alterna i layout. Al passaggio del puntatore compaiono tracce grafiche che svaniscono. Il nastro tipografico che precede la sezione reagisce allo scorrimento.

Implementazione solo HTML/CSS/JavaScript, nessuna libreria né backend: `css/experimental.css` e `js/experimental.js`. Su dispositivi con preferenza di movimento ridotto gli effetti di movimento automatico sono disattivati. La composizione iniziale rimane visibile anche senza JavaScript.
