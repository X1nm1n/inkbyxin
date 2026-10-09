/* CATEGORIE: ai, web, design (illustrazioni), photo (fotografie), study (materiali universitari).
   Per pubblicare un nuovo contenuto copia un oggetto tra quelli esistenti e modifica tutti i campi.
   Opzioni facoltative:
      image: "./assets/media/fotografie/foto.jpg", // copertina della scheda
      alt: "Descrizione accessibile della fotografia",
      file: "./assets/media/studio/formulario.pdf", // link PDF/ZIP visibile nel dettaglio
      credit: "Foto e illustrazione: Nome autore",
      license: "Tutti i diritti riservati" // oppure una licenza effettivamente concessa.
   Non aggiungere immagini identificabili di altre persone senza le verifiche e autorizzazioni necessarie.
   NON pubblicare materiali didattici di terzi senza diritti di distribuzione. */
window.XIN_PROJECTS = [
  {
    "id": "spec-trace",
    "number": "01",
    "category": "ai",
    "year": "2026",
    "title": "SpecTrace",
    "eyebrow": "AI ENGINEERING / API RESEARCH",
    "summary": "Agenti AI che esplorano API REST e ne ricostruiscono la struttura, senza conoscere il codice sorgente.",
    "description": "Un percorso di ricerca sulla ricostruzione black-box di specifiche OpenAPI: un agente interroga un servizio REST, interpreta le risposte e raffina progressivamente la propria conoscenza. Sono state confrontate strategie con e senza Retrieval-Augmented Generation (RAG), osservando sia la qualità della ricostruzione sia il costo delle interazioni.",
    "role": "Ricerca, sperimentazione e implementazione",
    "tech": [
      "Python",
      "REST API",
      "OpenAPI",
      "LLM",
      "RAG"
    ],
    "highlights": [
      "Esplorazione automatica degli endpoint",
      "Confronto sperimentale RAG / no-RAG",
      "Analisi di coverage e budget di richieste"
    ],
    "visual": "ai",
    "size": "featured",
    "status": "Ricerca"
  },
  {
    "id": "server-craft",
    "number": "02",
    "category": "web",
    "year": "2026",
    "title": "Servercraft",
    "eyebrow": "BACKEND / FULL-STACK",
    "summary": "Progettare API robuste, dati organizzati e interfacce capaci di dialogare tra loro.",
    "description": "Un progetto applicativo orientato allo sviluppo web, con un backend Python che espone servizi REST e gestisce dati persistenti. Il focus è sulla separazione delle responsabilità, sulla validazione e sull'integrazione tra client e server.",
    "role": "Progettazione e sviluppo software",
    "tech": [
      "Python",
      "FastAPI",
      "SQLModel",
      "HTML",
      "JavaScript"
    ],
    "highlights": [
      "API REST e validazione dei dati",
      "Persistenza e modellazione delle entità",
      "Interfaccia e backend integrati"
    ],
    "visual": "web",
    "size": "standard",
    "status": "Progetto"
  },
  {
    "id": "vector-playground",
    "number": "03",
    "category": "design",
    "year": "2026",
    "title": "Vector Playground",
    "eyebrow": "DIGITAL ART / SVG DESIGN",
    "summary": "Illustrazioni vettoriali costruite con forme, geometrie e una direzione visiva riconoscibile.",
    "description": "Una raccolta di sperimentazioni grafiche pensate per restare nitide a ogni scala: linee pulite, forme modificabili, composizioni originali e attenzione al dettaglio. Un punto d'incontro tra precisione tecnica e sensibilità visiva.",
    "role": "Concept, illustrazione e direzione visiva",
    "tech": [
      "SVG",
      "Illustrator",
      "Vector Art",
      "Visual Design"
    ],
    "highlights": [
      "Elementi vettoriali modificabili",
      "Composizioni scalabili e responsive",
      "Approccio orientato a forme e dettagli"
    ],
    "visual": "design",
    "size": "wide",
    "status": "Esplorazione"
  }
,
  {
    id: 'appunti-triennale', number: '04', category: 'study', year: '2026',
    title: 'Appunti di Ingegneria Informatica', eyebrow: 'STUDY ARCHIVE / UNICA',
    summary: 'Un archivio per materia e anno di corso, con appunti personali e risorse in PDF.',
    description: 'Catalogo di studio organizzato per singola materia. Le schede delle materie sono predisposte; i PDF originali saranno aggiunti progressivamente dopo la verifica dei contenuti e dei metadati.',
    role: 'Redazione e organizzazione di materiali personali',
    tech: ['Appunti originali', 'PDF', 'Ingegneria Informatica'],
    highlights: ['Catalogo per singola materia', 'Ricerca e filtri per anno', 'Materiali caricati progressivamente'],
    visual: 'study', size: 'standard', status: 'In allestimento',
    file: './studio.html', credit: 'Appunti originali: Xinmin Giuseppe Farano',
    license: 'Tutti i diritti riservati, salvo diversa indicazione sul documento.'
  }
];
