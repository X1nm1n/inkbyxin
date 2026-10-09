# XIN / Material Atelier — aggiornamento per il sito live

Questa versione **sostituisce** la precedente e mantiene la struttura già concordata: un portfolio grafico per branding, illustrazione, fotografia ed editoriale; **Università** rimane una pagina separata (`studio.html`) e non compare come progetto creativo.

## Cosa cambia visivamente
- Hero: stampe CSS originali sovrapposte, texture di carta, nastro, clip, ticket, matita e ombre stratificate; lieve profondità al mouse e allo scroll. Il tasto **Scomponi le stampe** cambia fisicamente la disposizione delle carte.
- Un intermezzo con tre campioni di stampa dimostrativi collega la narrazione verticale alla selezione dei lavori. Sono composizioni decorative realizzate per il sito, non lavori commissionati.
- Schede portfolio con proporzioni editoriali asimmetriche, bordo di carta, nastri e ombre realistiche; restano ricerca, filtri e finestre dei dettagli.
- Sezione "Chi sono": rimane il laboratorio sperimentale **senza il vecchio cerchio con il logo**. Aggiunti piccoli dettagli materiali.
- Tema chiaro: sabbia, marroncino, terracotta; tema scuro: blu notte del sito; logo originale invariato.

## Pubblicazione corretta
1. Estrai lo ZIP e apri la cartella in PyCharm.
2. Nella cartella del repository pubblico **sostituisci anche `index.html`** e carica le **nuove risorse** `css/material.css` e `js/material.js`, insieme al resto dei file.
3. Commit e push sul branch usato da GitHub Pages. Assicurati che `index.html` sia nella directory principale.
4. Aspetta che la build Pages sia completata; riapri il sito con `Ctrl + Shift + R`.
5. Apri `https://TUO-USERNAME.github.io/TUO-REPOSITORY/verifica-versione.txt`: deve contenere `20261009-INTRO-STATIC`.

Il sito è statico e non richiede backend o installazioni Python. La form contatti richiede comunque la conferma iniziale FormSubmit e un invio di prova reale sul sito pubblico.

## Per inserire lavori reali
Modifica `js/projects.js` e inserisci le copertine in `assets/media/progetti/`. Lo styling cartaceo avvolge anche le immagini reali. Sostituisci i segnaposto prima di presentare la galleria come portfolio completo. Non caricare mai liberatorie firmate sul repository pubblico.
