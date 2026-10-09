# XIN — Portfolio grafico con archivio universitario separato

## Gerarchia del sito

- **Homepage (`index.html`)**: esclusivamente il portfolio grafico di Xinmin Giuseppe Farano: brand identity, illustrazioni, fotografia e design editoriale.
- **Area universitaria (`studio.html`)**: sezione separata, con materie organizzate per anno, PDF e appunti originali. Accessibile dal menu e da un piccolo invito sotto «Chi sono». Gli appunti **non** entrano nelle categorie del portfolio grafico.
- `privacy.html` e `diritti.html`: informative e diritti d’uso.

## Avvio e pubblicazione

Apri questa cartella in PyCharm. Non serve installare Python o un server per la pubblicazione. Carica il contenuto della cartella nella root di un repository GitHub pubblico, poi abilita GitHub Pages da **Settings → Pages → Deploy from a branch → main / (root)**.

## Aggiungere lavori grafici

1. Salva le immagini nella cartella `assets/media/progetti`, `assets/media/illustrazioni` o `assets/media/fotografie`.
2. Apri `js/projects.js` e sostituisci le schede **«in arrivo»** con lavori reali, mettendo `image:'./assets/media/...'`, un titolo e una descrizione.
3. Usa le categorie `branding`, `design`, `photo` o `editorial`.
4. Carica le modifiche su GitHub.

Il logo XIN che hai inviato è già utilizzato sia in homepage sia nella prima scheda di identità visiva.

## Materiale universitario

Le schede delle materie si gestiscono esclusivamente da `js/materie.js` e i PDF originali da `assets/media/studio`. Segui `GUIDA-PUBBLICAZIONE.md` per esempi. Non pubblicare dispense di altri o PDF firmati dai clienti.

## Modulo contatti

È configurato per inviare tramite FormSubmit a `X1ngraphic1@gmail.com`; la prima attivazione richiede una conferma nella casella email. Verifica l'invio dopo aver pubblicato il sito.

Le sezioni «Illustrazioni», «Fotografia» ed «Editoriale» contengono segnaposto dichiarati, **non** lavori inventati. L'informativa privacy e le liberatorie richiedono sempre verifica rispetto al trattamento effettivo dei dati e alle pubblicazioni effettuate.
