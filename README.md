# XIN — Portfolio redesign 2026

Nuova versione del portfolio di **Xinmin Giuseppe Farano**, con il suo **logo blu a forma di X e pennino**. Il sito è statico e può essere pubblicato gratuitamente tramite GitHub Pages.

## Come usarlo in PyCharm

1. Estrai lo ZIP.
2. In PyCharm scegli **File > Open** e apri la cartella `XIN-Portfolio-Redesign-2026`.
3. Per visualizzare il sito durante lo sviluppo, fai clic destro su `index.html` e scegli **Open in Browser**; se PyCharm non offre l'anteprima, puoi usare il terminale con `python -m http.server 8000` e aprire `http://localhost:8000` nel tuo browser.
4. Modifica HTML, CSS e JavaScript. **Non servono pip, Flask o un backend Python** per GitHub Pages.

## Pubblica con GitHub Pages

1. Crea un repository pubblico, per esempio `portfolio`.
2. Carica il **contenuto della cartella**, non la cartella come sottocartella: `index.html` deve trovarsi alla radice del repository.
3. Apri **Settings > Pages > Build and deployment**, imposta **Deploy from a branch**, branch `main`, cartella `/(root)`, poi **Save**.
4. Il sito apparirà su `https://TUO-USERNAME.github.io/portfolio/` dopo la pubblicazione.
5. Per modifiche successive esegui commit e push da PyCharm: il sito si aggiorna tramite GitHub Pages.

I percorsi dei file sono relativi (`./css/...`, `./assets/...`), quindi funzionano anche nei project site `username.github.io/portfolio/`.

## Il tuo logo

- `assets/logo-xin.svg`: vettoriale ottenuto dal simbolo inviato; usato nel sito e come favicon.
- `assets/logo-xin.png`: versione PNG con sfondo trasparente.
- **Non è inclusa la scritta** `Xinmin Farano — Graphic Designer` nell'emblema.
- Se vuoi cambiare logo, sostituisci il file SVG mantenendo il nome del file, o aggiorna i riferimenti all'immagine nei file HTML.

## Aggiungere progetti, fotografie e illustrazioni

Apri `js/projects.js`. Ogni elemento di `window.XIN_PROJECTS` corrisponde a una scheda. Puoi usare le categorie:

- `ai`: ricerca AI / OpenAPI
- `web`: sviluppo e programmazione
- `design`: illustrazioni e graphic design
- `photo`: fotografia
- `study`: studio e appunti

Per aggiungere una foto originale, prima inserisci l'immagine in `assets/media/fotografie/`, quindi aggiungi all'oggetto desiderato:

```js
image: './assets/media/fotografie/ritratto-01.jpg',
alt: 'Ritratto fotografico di una persona in esterni',
credit: 'Fotografia: Xinmin Giuseppe Farano',
license: 'Tutti i diritti riservati'
```

Le **copertine astratte presenti adesso sono illustrazioni segnaposto del layout**, non fotografie o illustrazioni commissionate realmente. Gli esempi `SpecTrace`, `Servercraft` e `Vector Playground` vanno personalizzati con titolo, descrizione, immagini e crediti coerenti con il lavoro effettivamente pubblicato. Evita di presentare prototipi e concept come incarichi conclusi.

Per fotografie di persone riconoscibili, verifica diritti, autorizzazioni e base giuridica prima della pubblicazione; vedi `diritti.html` e i PDF nella cartella `documenti/`.

## Appunti, materia per materia

I dati della pagina `studio.html` si trovano nel file `js/materie.js`. Ogni materia ha `anno` (1, 2, 3), `titolo`, `descrizione`, `argomenti` e un elenco `risorse`. La struttura permette un numero qualsiasi di materie per anno; **al momento ci sono solo due schede di esempio del terzo anno e nessun PDF pubblicato**.

Per aggiungere un nuovo corso:

```js
{
  id: 'algoritmi',
  anno: 2,
  titolo: 'Algoritmi e strutture dati',
  descrizione: 'I miei appunti originali',
  argomenti: ['Algoritmi', 'Complessità'],
  risorse: [
    { titolo: 'Appunti', tipo: 'PDF', file: './assets/media/studio/2-anno/algoritmi.pdf' }
  ]
}
```

Copia il PDF originale nella cartella `assets/media/studio/2-anno/`. Se i file sono grandi, rispetta i limiti del tuo repository e di GitHub Pages. **Non caricare materiale dei docenti o colleghi senza autorizzazione**, né dati personali non necessari.

## Modulo contatti Gmail

Il destinatario è già configurato in `js/config.js`:

```js
window.XIN_CONFIG = { contactEmail: 'X1ngraphic1@gmail.com' };
```

Il modulo invia i dati con la API AJAX HTTPS di **FormSubmit**. Non occorre un backend Python. Per abilitarlo in produzione:

1. Pubblica su GitHub Pages.
2. Compila il modulo e invia un **primo messaggio di test** dal sito online.
3. Controlla la casella Gmail del destinatario e completa la conferma di attivazione inviata da FormSubmit (controlla anche Spam).
4. Invia un **secondo messaggio di prova** e verifica che arrivi.

Nota: **non è stato effettuato un invio reale alla tua Gmail** da questo progetto. La consegna dipende dal servizio esterno e dall'attivazione. L'indirizzo destinatario resta leggibile nel JavaScript pubblico, come in qualunque modulo di questo tipo con destinatario non mascherato.

## Privacy e documenti fotografici

- `privacy.html`: informativa dei trattamenti dichiarati e dei servizi del sito.
- `diritti.html`: informazioni su copyright, ritratti e materiali universitari.
- `documenti/Liberatoria_XIN_Adulti.pdf` e `documenti/Liberatoria_XIN_Minori.pdf`: modelli da stampare e adattare al singolo incarico. Non pubblicare mai PDF già compilati o firmati nel repository!
- La privacy deve corrispondere ai trattamenti effettivi, alle modalità di conservazione e ai servizi in uso: prima dell'utilizzo professionale è opportuno verificarla con un legale esperto del settore.

## Funzioni interattive

- Modale progetto con dettagli, crediti e collegamenti ai file.
- Filtri per categoria e ricerca testuale.
- Menu hamburger accessibile su smartphone.
- Tema chiaro/scuro memorizzato nel browser (`xin-theme`).
- Navigazione rapida `Ctrl+K` / `Cmd+K` nella homepage.
- Micro-animazioni, effetto leggero al movimento del mouse e rispetto delle preferenze `prefers-reduced-motion`.
- Layout responsive, nessuna API Python locale necessaria.

## Architettura

```
index.html
studio.html
privacy.html
diritti.html
css/style.css
css/studio.css
css/legal.css
js/main.js
js/shared.js
js/projects.js
js/materie.js
js/studio.js
js/config.js
assets/logo-xin.svg
assets/logo-xin.png
assets/favicon.svg
assets/media/{fotografie,illustrazioni,progetti,studio}/
documenti/*.pdf
.nojekyll
```

© 2026 Xinmin Giuseppe Farano — XIN. File di progetto preparati per poter essere modificati in PyCharm.
