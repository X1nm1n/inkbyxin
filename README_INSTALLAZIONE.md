# InkByXin — Preferiti, segnalazioni, condivisione e ZIP per materia

Aggiornamento delle pagine **studio.html** e **materia.html** per il sito statico InkByXin (GitHub Pages).

## Installazione (PyCharm / Windows)

1. Salva una copia di sicurezza della cartella del progetto e delle tue modifiche locali.
2. Estrai `InkByXin_4_funzionalita_codice.zip` **nella cartella principale del sito**, dove si trovano `index.html`, `studio.html`, `materia.html`, `css` e `js`. Consenti la sovrascrittura dei file con lo stesso nome.
3. **Non cancellare** le cartelle del progetto che non sono presenti nello ZIP: il pacchetto contiene il codice e i file grafici essenziali forniti, **non** tutti i PDF, i video e le immagini originarie.
4. Da PyCharm, avvia il sito localmente con `python -m http.server 8000` e apri `http://localhost:8000/studio.html`.
5. Controlla che i pulsanti Preferiti, Condividi e Segnala aprano le rispettive funzioni. Per testare l'invio reale della segnalazione bisogna verificare anche l'arrivo dell'email.

## 1 — Preferiti

- Cuore `♡ Preferiti` su ogni scheda e pulsante sulla pagina della materia.
- Filtro `♡ Preferiti` a fianco dei filtri degli anni.
- I preferiti restano nel **browser e dispositivo** usati (`localStorage`, chiave `xin-study-favorites`). Nessun account e nessun invio a un server.
- Sono stati aggiornati i riferimenti in `privacy.html`.

## 2 — Segnala un problema

- Pulsante generale nella pagina della materia e pulsante `⚑ Segnala` accanto a ciascun documento.
- Modulo con tipo di problema, documento preimpostato, descrizione, email facoltativa e presa visione della privacy.
- Invio tramite **FormSubmit** alla mail di `js/config.js`, già utilizzata dal modulo contatti del portfolio. Se l'invio automatico fallisce compare il collegamento **Invia tramite email**.
- FormSubmit può richiedere l'attivazione dell'indirizzo dal messaggio di verifica. L'invio va provato sul sito online: non possiamo verificarlo senza accesso al servizio e alla tua casella.
- Le segnalazioni non finiscono automaticamente in GitHub Issues o in un database: arrivano tramite FormSubmit/email.

## 3 — Condivisione

- Pulsante `↗ Condividi` su schede e dettaglio.
- Su dispositivi compatibili usa il menu di condivisione nativo; in alternativa copia il collegamento alla materia.
- Nel dettaglio trovi anche i collegamenti a WhatsApp e Telegram.
- L'URL viene costruito a partire dalla pagina effettiva, quindi funziona anche se il sito è pubblicato sotto un sottopercorso di GitHub Pages.

## 4 — Download ZIP per materia

**Importante:** lo ZIP consegnato a ChatGPT non conteneva i 393 materiali. Per questo gli archivi non sono già generati: inizialmente la pagina mostrerà **"ZIP in preparazione"**.

Con tutti i PDF e gli altri materiali presenti nelle rispettive cartelle sul tuo PC, nel terminale di PyCharm usa:

```powershell
python genera_zip_materie.py --list
python genera_zip_materie.py --materia analisi-2
```

Per preparare tutte le materie:

```powershell
python genera_zip_materie.py --all
```

Lo script:
- legge **l'intero** `js/materie.js` e controlla l'esistenza dei file reali;
- crea gli ZIP in `assets/media/studio/zip/`, separando i documenti in più archivi autonomi se necessario;
- applica una soglia conservativa di **95 MB** per archivio, inferiore a 99 MB;
- verifica che ogni archivio sia leggibile, aggiorna `js/zip-manifest.js` e rinnova le versioni del catalogo negli HTML per evitare cache vecchie;
- con `--materia` aggiorna solo il corso scelto, preservando le altre voci del manifest.

Per pubblicare i download devi caricare su GitHub **sia gli ZIP creati sia `js/zip-manifest.js` e le pagine HTML aggiornate**. Se il manifest è pubblicato ma gli ZIP no, i download produrranno errore 404.

**Dimensioni del sito:** distribuire sia i PDF singoli sia gli ZIP ne aumenta sensibilmente la dimensione complessiva. GitHub può imporre limiti alla pubblicazione su Pages e al repository. Se il sito diventa troppo grande, sarà opportuno valutare un servizio di hosting file esterno anziché caricare tutti gli ZIP nel repository.

Se uno dei file sorgente supera da solo il limite, lo script ti segnala che è necessario ridurlo prima di generare lo ZIP della materia.

## Nuove materie

Aggiungi normalmente le nuove materie e le risorse al **file completo** `js/materie.js`. Non devi modificare gli script di preferiti, condivisione, segnalazione o ZIP. Esegui solo:

```powershell
python genera_zip_materie.py --materia slug-nuova-materia
```

Usa lo `slug` dell'attributo `id` in `materie.js`.

## Test consigliati

```powershell
python audit_inkbyxin_v2.py --browser
```

Lo script di audit resta quello che hai già sul tuo PC. Verifica inoltre il comportamento dei pulsanti e fai un invio **reale** di segnalazione prima di considerare l'integrazione conclusa. I nuovi file sono sorgenti autonomi, non richiedono installazioni Python per funzionare sul server GitHub Pages.

## File modificati o aggiunti

- `studio.html`, `materia.html`, `privacy.html`
- `js/studio.js`, `js/materia.js`
- `js/study-features.js` (nuovo)
- `js/zip-manifest.js` (nuovo, inizialmente vuoto)
- `css/study-features.css` (nuovo)
- `genera_zip_materie.py` (nuovo)

`js/materie.js` è completo e **non è stato accorciato né ricostruito**: tutte le 15 materie e 393 risorse originali restano presenti.
