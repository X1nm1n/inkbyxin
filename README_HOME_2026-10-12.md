# InkByXin — Homepage aggiornata (12 ottobre 2026)

Questa release modifica **solo la homepage**. Le funzioni precedenti (preferiti, segnalazioni, condivisione e ZIP per materia) restano disponibili. Il file `js/materie.js` è conservato integralmente: non è necessario modificarlo per queste novità.

## Installazione da PyCharm

1. Fai un backup della cartella principale del progetto `inkbyxin`.
2. Consiglio **InkByXin_home_solo_modifiche.zip**: estrailo direttamente dentro `inkbyxin` mantenendo la struttura delle cartelle e accettando la sostituzione di `index.html`.
3. Conserva le cartelle già presenti in `assets/custom/` e `assets/media/studio/`: **non** cancellarle. Gli archivi che ti consegno contengono soltanto il codice, non le centinaia di PDF e non le fotografie personali.
4. Apri `index.html` tramite un server locale. Dal terminale PowerShell: `python -m http.server 8000`. Poi apri `http://localhost:8000/index.html`.
5. Dopo l'installazione prova anche `python audit_inkbyxin_v2.py --browser`, se hai conservato lo script di verifica.

## Novità

- **Confronto fotografico** nella sezione `Behind the Art`: usa `assets/custom/behind-photo.jpg` e `assets/custom/behind-final.png`, già previsti dal sito. Muovi la linea direttamente con mouse o touch oppure usa il cursore accessibile anche con la tastiera.
- **Ultime novità**: tre aggiornamenti iniziali, creati dal file `js/home-data.js`.
- **Strumenti e competenze**: pannelli compatti con strumenti di grafica e sviluppo, modificabili dallo stesso file.
- **Social e portfolio**: Instagram, GitHub e Behance sono predisposti **senza link inventati**. Fino a quando non inserisci gli URL esatti, compaiono disattivati. L'email è già collegata a `X1ngraphic1@gmail.com`.
- **Spaziature**: ridotte in alcune sezioni senza alterare le altre pagine del sito.

## Come aggiungere i tuoi social

Apri `js/home-data.js` e cerca:

```js
social: [
  { name: 'Instagram', detail: '...', short: 'IG', url: '' },
  { name: 'GitHub', detail: '...', short: 'GH', url: '' },
  // ...
]
```

Sostituisci i campi `url: ''` con i link pubblici esatti, per esempio `url: 'https://www.instagram.com/TUO_PROFILO/'` (sostituendo il testo segnaposto con il tuo profilo reale). Gli URL devono iniziare con `https://`; non mettere password o token nel file.

## Come aggiornare le notizie

Apri `js/home-data.js`, sezione `updates`. Ogni elemento ha `date` (formato `YYYY-MM-DD`), `type`, `title`, `description`, `href` e `cta`. Metti la novità più recente in cima. Sono visibili fino a sei aggiornamenti, senza necessità di modificare l'HTML. I link devono essere riferimenti interni validi, ad esempio `./studio.html` o `#journey`.

## Come cambiare gli strumenti

Nello stesso file modifica l'elenco `skills` (campi `initials`, `title`, `area`, `tone`). Non sono indicati livelli numerici o certificazioni non confermate.

## Verifiche

- Sintassi dei nuovi JavaScript: verificata.
- Test isolati Chromium su desktop (1366px) e smartphone (390px): le novità vengono renderizzate, le schede social senza URL non sono cliccabili, comparatore su 0–100% funzionante, nessun errore JS e nessun overflow orizzontale.
- Non è stato possibile completare una navigazione HTTP end-to-end in questo ambiente, perché le richieste a `localhost` sono bloccate; esegui il test integrale in PyCharm prima del push su GitHub.

## Note

La cartella `assets/custom/` con le immagini reali non è stata inviata nell'archivio del codice originale: le immagini del comparatore **devono continuare a essere presenti nel progetto sul tuo PC**, con i nomi già usati da `Behind the Art`. Il codice non modifica né elimina alcun PDF.
