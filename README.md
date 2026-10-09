# XIN® — Portfolio online con GitHub Pages

**Questo è il progetto giusto per PyCharm + GitHub Pages.** Il sito è composto soltanto da HTML, CSS e JavaScript: per pubblicarlo **non servono Python, FastAPI, SQLite, Node.js o server da mantenere attivi**. GitHub Pages lo rende pubblico online e aggiorna il sito a ogni push sulla branch configurata.

## 1. Aprilo in PyCharm

1. Decomprimi lo ZIP.
2. PyCharm → **File → Open** → seleziona la cartella `XIN-Portfolio-GitHub-Pages`.
3. Modifica il codice. Apri `index.html` con la funzione anteprima browser di PyCharm, oppure per un'anteprima con server di sviluppo apri il terminale ed esegui `py -m http.server 8000`, poi visita `http://localhost:8000`. **Questo server serve soltanto a controllare le modifiche sul PC**: il sito finale sarà online su GitHub Pages.

## 2. Pubblica online su GitHub (senza altri hosting)

1. Accedi a **github.com** e crea un nuovo repository **pubblico**, per esempio `xin-portfolio`.
2. Carica **il contenuto** della cartella (non una cartella esterna) nella root del repository: `index.html`, `css/`, `js/`, `assets/`, `.nojekyll`, `privacy.html` ecc.
3. Apri il repository e vai in **Settings → Pages**.
4. In **Build and deployment → Source** scegli **Deploy from a branch**.
5. Seleziona **main** e **/(root)**, poi **Save**.
6. Il sito sarà pubblicato all'indirizzo `https://TUO-USERNAME.github.io/xin-portfolio/` (il nome dipende dal repository). Il primo deploy può richiedere qualche minuto.
7. Per aggiornare il sito: modifica i file in PyCharm, fai commit e push su `main` (Git → Commit, Git → Push), e GitHub Pages pubblicherà i cambiamenti.

> Se scegli invece come repository `TUO-USERNAME.github.io`, il sito risponderà direttamente su `https://TUO-USERNAME.github.io/`. Non inventare un URL: il link effettivo appare in Settings → Pages dopo la pubblicazione.

## 3. Collega il modulo contatti (una sola configurazione)

**Il modulo non può inviare email direttamente con GitHub Pages.** Per questo è pronto per [FormSubmit](https://formsubmit.co/), che inoltra i messaggi attraverso un servizio esterno. Non contiene password e non richiede backend personale.

1. Apri `js/config.js` e imposta `contactEmail: 'latuaemail@esempio.it'`.
2. Pubblica i file aggiornati su GitHub Pages.
3. Dal sito **online** invia un primo messaggio di prova; segui l'email di attivazione che FormSubmit ti invia. **Fino all'attivazione non puoi considerare la ricezione operativa.** Verifica poi che il messaggio di prova arrivi (controlla anche spam).
4. Il modulo mostra errori se l'indirizzo non è configurato o l'invio fallisce; non finge di aver ricevuto il messaggio.

**Attenzione privacy:** la tua email configurata in `js/config.js` è visibile nel codice sorgente del sito. Usa un indirizzo dedicato, non inserire mai password o token. I dati del modulo passano a FormSubmit e non sono salvati in un tuo database. **Prima della pubblicazione modifica `privacy.html`**, inserendo i dati del titolare e le informazioni corrette sul trattamento, poi controlla il consenso nel modulo.

## 4. Personalizza il portfolio

| Cosa | File |
| --- | --- |
| Titoli, testi e link | `index.html` (italiano) e `js/main.js` (traduzioni IT/EN) |
| Progetti mostrati con schede e filtri | `js/projects.js` |
| Email del modulo contatti | `js/config.js` |
| Colori, griglie, animazioni, mobile | `css/style.css` |
| Logo/favicon | `assets/favicon.svg` |
| Informativa privacy | `privacy.html` |

La pagina iniziale include esempi di progetti: verifica titoli, descrizioni e risultati prima di presentarli come portfolio professionale.

## 5. Cosa funziona su GitHub Pages

- Home animata, grafica orbitale, particelle, transizioni
- Menu mobile, navigazione, scorciatoie `Ctrl+K` / `⌘+K`
- Progetti da `js/projects.js`, filtri, ricerca e finestre di dettaglio
- Italiano/inglese, modalità scura/chiara persistente
- Form contatti con controlli di validazione e invio tramite FormSubmit **dopo configurazione e attivazione dell'email**
- Percorsi relativi compatibili sia con `username.github.io/repo/` che con un dominio personale

## Struttura del progetto

```text
XIN-Portfolio-GitHub-Pages/
├── index.html
├── privacy.html
├── .nojekyll
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── config.js         # Imposta l'email contatti
│   ├── projects.js       # Modifica i progetti
│   └── main.js           # UI, lingua, animazioni, modulo
└── assets/
    └── favicon.svg
```

**Differenza tecnica importante:** GitHub *ospita i file e pubblica il sito con GitHub Pages*, ma non esegue `app.py`. Se in futuro vorrai login, area riservata, database o API Python personalizzate, serve un backend ospitato a parte (per esempio Render o un altro hosting Python) e il frontend può continuare a rimanere su GitHub Pages.
