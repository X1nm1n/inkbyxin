# AGGIORNAMENTO DEFINITIVO — elimina il vecchio "Chi sono"

La schermata con il **cerchio lilla, il logo enorme e le righe "Competenze / Base / Università"** appartiene a una versione PRECEDENTE del sito. **Non è presente** in questa release.

## Se il sito vecchio continua a comparire

1. Estrai `XIN-Portfolio-CHI-SONO-CORRETTO.zip` e apri **questa** cartella in PyCharm. Non usare i precedenti ZIP o cartelle del progetto.
2. Apri `index.html` e usa `Ctrl+F` per trovare `NON RESTO FERMO` (il testo è diviso in tre elementi HTML: `NON`, `RESTO`, `FERMO`). Cerca anche `id="expStage"`. Se li trovi, è il file corretto.
3. Nel repository GitHub che pubblica il sito, sostituisci **il contenuto della root** con i nuovi file. `index.html`, `css/`, `js/`, `assets/`, `studio.html`, `privacy.html` devono stare direttamente nella root, non dentro una cartella in più. Esegui Commit e Push su `main`.
4. In GitHub vai in **Settings → Pages** e verifica che l'origine sia **Deploy from a branch → main → /(root)**. Attendi che il deploy risulti completato.
5. Apri `https://TUO-USERNAME.github.io/NOME-REPO/verifica-versione.txt` (o `https://TUO-USERNAME.github.io/verifica-versione.txt` per un repository username.github.io). Se compare `20261009-ABOUT-NUOVO`, la nuova versione è online.
6. Apri il sito con `Ctrl+Shift+R` oppure in una finestra anonima. Clicca "Chi sono". Ora compare il **laboratorio tipografico** al posto del cerchio. Se `verifica-versione.txt` dà 404, è ancora pubblicato il repository, la branch o la cartella sbagliati.

I query parametri `?v=20261009-ABOUT-NUOVO` sui file CSS e JavaScript permettono di evitare la cache dei vecchi asset. Se nel browser compare ancora la vecchia sezione, è `index.html` a non essere stato pubblicato oppure stai visitando un altro indirizzo.

La pubblicazione GitHub NON avviene scaricando questo ZIP: devi sostituire i file sul repository. Il modulo contatti deve essere testato dopo aver attivato FormSubmit. Non caricare moduli clienti firmati in pubblico.
