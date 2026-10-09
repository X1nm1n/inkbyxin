/* XIN® PORTFOLIO · Vanilla JavaScript · No build system or framework. */
(() => {
  'use strict';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = { projects: [], filter: 'all', query: '', lang: 'it', theme: 'dark' };
  const i18n = {
    it: {
      'nav.work': 'Progetti', 'nav.about': 'Chi sono', 'nav.expertise': 'Competenze', 'nav.contact': 'Contatti', 'nav.talk': 'Parliamone',
      'hero.eyebrow': 'SOFTWARE ENGINEERING × DIGITAL CREATIVITY', 'hero.line1': 'Il futuro', 'hero.line2': 'si scrive', 'hero.line3': 'diversamente',
      'hero.description': "Creo esperienze digitali dove il codice incontra l'immaginazione. Progetti intelligenti, interfacce curate, idee fuori dall'ordinario.",
      'hero.see': 'Esplora i progetti', 'hero.about': 'Scopri chi sono', 'hero.availability': 'Disponibile a nuove collaborazioni', 'hero.scroll': 'SCORRI PER ESPLORARE',
      'section.work': 'PROGETTI SELEZIONATI', 'section.about': 'DIETRO IL CODICE', 'section.expertise': 'QUELLO CHE FACCIO', 'section.contact': 'METTIAMOCI IN CONTATTO',
      'work.title1': 'Non solo codice.', 'work.title2': 'Idee che prendono forma.', 'work.description': 'Ogni progetto è un esperimento: un problema da capire, una soluzione da costruire e un dettaglio che fa la differenza.',
      'work.note': 'Progetti di studio, ricerca e sperimentazione. Nuove idee sono sempre in lavorazione.', 'work.empty': 'Nessun progetto trovato', 'work.emptydesc': 'Prova una ricerca o un filtro differente.', 'work.reset': 'Azzera filtri',
      'filters.all': 'Tutti', 'filters.searchlabel': 'Cerca progetto',
      'about.intro': 'CIAO, SONO XIN', 'about.title1': 'Curioso', 'about.title2': 'per natura.', 'about.title3': 'Preciso per scelta.',
      'about.lead': "Studio Ingegneria Informatica all'Università di Cagliari. Mi interessa tutto ciò che succede quando logica, tecnologia e creatività iniziano a collaborare.",
      'about.body': "Esploro lo sviluppo web, l'intelligenza artificiale e il design digitale. Mi piace comprendere un sistema fino in fondo e poi cercare un modo più interessante per farlo funzionare.",
      'about.focuslabel': 'FOCUS ATTUALE', 'about.loclabel': 'BASE', 'about.connect': 'Conosciamoci meglio',
      'expertise.title1': 'Una mente tecnica.', 'expertise.title2': 'Un occhio creativo.', 'expertise.description': "Non mi fermo a una sola disciplina. Unisco strumenti diversi per trovare la soluzione giusta, senza rinunciare all'estetica.",
      'expertise.web': 'Interfacce responsive, backend Python, API REST, struttura del codice e attenzione alle prestazioni.',
      'expertise.ai': 'Sperimentazione con LLM, agenti software, retrieval e automazione di processi complessi.',
      'expertise.design': 'Identità visive, grafica vettoriale, microinterazioni e dettagli che rendono memorabile un prodotto.',
      'approach.label': 'IL MIO APPROCCIO', 'approach.step1': 'Capire il problema', 'approach.step2': 'Progettare con criterio', 'approach.step3': 'Costruire e perfezionare',
      'contact.title1': "Hai un'idea", 'contact.title2': 'che merita', 'contact.title3': 'di esistere?',
      'contact.description': 'Un progetto, una collaborazione o semplicemente una bella idea? Raccontamela. Le cose interessanti iniziano sempre con una conversazione.',
      'contact.available': 'APERTI A NUOVE CONNESSIONI', 'contact.formtitle': 'Scrivimi due righe.',
      'form.name': 'COME TI CHIAMI? *', 'form.email': 'LA TUA EMAIL *', 'form.topic': 'DI COSA PARLIAMO? *', 'form.message': 'RACCONTAMI LA TUA IDEA * ',
      'form.choose': 'Scegli un argomento', 'form.collab': 'Collaborazione', 'form.web': 'Progetto web', 'form.ai': 'AI / Automazione', 'form.design': 'Design', 'form.other': 'Altro',
      'form.consent': 'Acconsento all’invio dei dati tramite FormSubmit per ricevere una risposta.',
      'form.submit': 'Invia il messaggio', 'form.required': '* CAMPI OBBLIGATORI', 'privacy.link': 'Informativa privacy ↗',
      'footer.tagline': 'Idee audaci. Codice pulito. Un dettaglio alla volta.', 'footer.explore': 'ESPLORA', 'footer.next': 'PROSSIMO PASSO', 'footer.write': 'Scrivimi ↗',
      'footer.shortcuts': 'Scorciatoie ↗', 'footer.crafted': 'PROGETTATO E SVILUPPATO CON CURA.', 'footer.back': 'TORNA SU',
      'dialog.role': 'RUOLO', 'dialog.status': 'STATO', 'dialog.highlights': 'PUNTI CHIAVE',
      'command.quick': 'NAVIGAZIONE RAPIDA', 'command.move': 'MUOVITI', 'command.enter': 'APRI', 'command.close': 'CHIUDI',
      'ui.project': 'Apri il progetto', 'ui.search': 'Cerca un progetto...', 'ui.command': 'Dove vuoi andare?', 'ui.name': 'Il tuo nome', 'ui.email': 'nome@esempio.it', 'ui.message': 'Ciao Xin, mi piacerebbe...',
      'ui.loading': 'Invio in corso...', 'ui.sent': 'Messaggio ricevuto! Grazie per avermi scritto.', 'ui.error': 'Non sono riuscito a inviare il messaggio. Riprova.',
      'ui.invalid': 'Completa correttamente tutti i campi obbligatori.', 'ui.short': 'Scrivi almeno 15 caratteri nel messaggio.', 'ui.limit': 'Troppi tentativi: riprova fra qualche minuto.',
      'ui.configureContact': 'Per ricevere messaggi, configura prima la tua email nel file js/config.js.', 'ui.loadError': 'Impossibile caricare i progetti. Controlla il file js/projects.js.', 'ui.retry': 'Riprova', 'ui.noResults': 'Nessuna corrispondenza'
    },
    en: {
      'nav.work': 'Work', 'nav.about': 'About', 'nav.expertise': 'Expertise', 'nav.contact': 'Contact', 'nav.talk': "Let's talk",
      'hero.eyebrow': 'SOFTWARE ENGINEERING × DIGITAL CREATIVITY', 'hero.line1': 'The future', 'hero.line2': 'is built', 'hero.line3': 'differently',
      'hero.description': 'I craft digital experiences where code meets imagination. Smart projects, thoughtful interfaces, and ideas beyond the ordinary.',
      'hero.see': 'Explore projects', 'hero.about': 'Get to know me', 'hero.availability': 'Open to new collaborations', 'hero.scroll': 'SCROLL TO EXPLORE',
      'section.work': 'SELECTED PROJECTS', 'section.about': 'BEHIND THE CODE', 'section.expertise': 'WHAT I DO', 'section.contact': "LET'S CONNECT",
      'work.title1': 'More than code.', 'work.title2': 'Ideas taking shape.', 'work.description': 'Every project is an experiment: a problem to understand, a solution to build, and that one detail making all the difference.',
      'work.note': 'Study, research and experimental projects. New ideas are always in progress.', 'work.empty': 'No projects found', 'work.emptydesc': 'Try a different search or filter.', 'work.reset': 'Reset filters',
      'filters.all': 'All', 'filters.searchlabel': 'Search projects',
      'about.intro': 'HI, I’M XIN', 'about.title1': 'Curious', 'about.title2': 'by nature.', 'about.title3': 'Precise by choice.',
      'about.lead': 'I study Computer Engineering at the University of Cagliari. I’m fascinated by what happens when logic, technology, and creativity start working together.',
      'about.body': 'I explore web development, artificial intelligence, and digital design. I like to understand how a system works and then find a more interesting way to build it.',
      'about.focuslabel': 'CURRENT FOCUS', 'about.loclabel': 'BASED IN', 'about.connect': "Let's connect",
      'expertise.title1': 'A technical mind.', 'expertise.title2': 'A creative eye.', 'expertise.description': 'I don’t limit myself to one discipline. I combine different tools to find the right solution without sacrificing great design.',
      'expertise.web': 'Responsive interfaces, Python backends, REST APIs, code architecture, and performance-minded development.',
      'expertise.ai': 'Experiments with LLMs, software agents, retrieval, and automation of complex workflows.',
      'expertise.design': 'Visual identities, vector artwork, microinteractions, and the details that make products memorable.',
      'approach.label': 'MY PROCESS', 'approach.step1': 'Understand the problem', 'approach.step2': 'Design with purpose', 'approach.step3': 'Build and refine',
      'contact.title1': 'Have an idea', 'contact.title2': 'worth bringing', 'contact.title3': 'to life?',
      'contact.description': 'A project, a collaboration, or simply an interesting idea? Tell me about it. Great things always start with a conversation.',
      'contact.available': 'OPEN TO NEW CONNECTIONS', 'contact.formtitle': 'Drop me a message.',
      'form.name': 'YOUR NAME *', 'form.email': 'YOUR EMAIL *', 'form.topic': 'WHAT IS IT ABOUT? *', 'form.message': 'TELL ME ABOUT YOUR IDEA * ',
      'form.choose': 'Choose a topic', 'form.collab': 'Collaboration', 'form.web': 'Web project', 'form.ai': 'AI / Automation', 'form.design': 'Design', 'form.other': 'Other',
      'form.consent': 'I agree to send my details via FormSubmit so I can receive a reply.',
      'form.submit': 'Send message', 'form.required': '* REQUIRED FIELDS', 'privacy.link': 'Privacy notice ↗',
      'footer.tagline': 'Bold ideas. Clean code. One detail at a time.', 'footer.explore': 'EXPLORE', 'footer.next': 'NEXT STEP', 'footer.write': 'Message me ↗',
      'footer.shortcuts': 'Quick navigation ↗', 'footer.crafted': 'DESIGNED AND BUILT WITH CARE.', 'footer.back': 'BACK TO TOP',
      'dialog.role': 'ROLE', 'dialog.status': 'STATUS', 'dialog.highlights': 'HIGHLIGHTS',
      'command.quick': 'QUICK NAVIGATION', 'command.move': 'MOVE', 'command.enter': 'OPEN', 'command.close': 'CLOSE',
      'ui.project': 'Open project', 'ui.search': 'Search projects...', 'ui.command': 'Where to?', 'ui.name': 'Your name', 'ui.email': 'name@example.com', 'ui.message': 'Hi Xin, I would love to...',
      'ui.loading': 'Sending...', 'ui.sent': 'Message received! Thanks for reaching out.', 'ui.error': 'Your message could not be sent. Please try again.',
      'ui.invalid': 'Please fill in all the required fields correctly.', 'ui.short': 'Please write at least 15 characters.', 'ui.limit': 'Too many attempts. Please try again in a few minutes.',
      'ui.configureContact': 'To receive messages, configure your email in js/config.js first.', 'ui.loadError': 'Could not load projects. Check js/projects.js.', 'ui.retry': 'Retry', 'ui.noResults': 'No matching results'
    }
  };
  const projectEnglish = {
    'spec-trace': {
      summary: 'AI agents explore REST APIs and infer their structure without access to the source code.',
      description: 'Research into black-box reconstruction of OpenAPI specifications: an agent queries a REST service, interprets responses, and progressively refines its understanding. Approaches with and without Retrieval-Augmented Generation (RAG) were compared in terms of reconstructed specification quality and interaction cost.',
      role: 'Research, experimentation and implementation',
      highlights: ['Automated endpoint exploration', 'RAG vs. no-RAG experimental comparison', 'Coverage and request-budget analysis'], status: 'Research'
    },
    'server-craft': {
      summary: 'Designing robust APIs, organized data, and interfaces that talk to each other.',
      description: 'A web-development application project with a Python backend exposing REST services and managing persistent data. The focus is on separation of concerns, validation, and frontend–backend integration.',
      role: 'Software design and development',
      highlights: ['REST APIs and data validation', 'Persistence and data modeling', 'Integrated frontend and backend'], status: 'Project'
    },
    'vector-playground': {
      summary: 'Vector illustrations crafted from shapes, geometry, and a distinct visual direction.',
      description: 'A collection of visual experiments designed to stay crisp at any scale: clean lines, editable shapes, original compositions, and deliberate details. A meeting point between technical precision and visual sensibility.',
      role: 'Concept, illustration and visual direction',
      highlights: ['Editable vector elements', 'Scalable responsive compositions', 'Shape- and detail-oriented approach'], status: 'Exploration'
    }
  };
  function t(key) { return i18n[state.lang][key] || key; }
  function persist(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function readStored(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  const escapeHTML = (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const displayProject = (p) => state.lang === 'en' ? { ...p, ...projectEnglish[p.id] } : p;

  /* Accent previews are vector / CSS-only to look good even offline. */
  function projectArt(p) {
    if (p.visual === 'ai') return `<div class="ai-network"><span class="network-ring one"></span><span class="network-ring two"></span><span class="network-ring three"></span><span class="network-route r1"></span><span class="network-route r2"></span><span class="network-route r3"></span><span class="network-node n1"></span><span class="network-node n2"></span><span class="network-node n3"></span><span class="network-node n4"></span><span class="network-core"></span></div><div class="ai-code-badge">&gt; discover_endpoints() <span class="ai-purple-dot">●</span></div>`;
    if (p.visual === 'web') return `<div class="mini-browser"><div class="browser-top"><i></i><i></i><i></i><span class="browser-address">REST API /docs</span></div><div class="browser-content"><div class="browser-status">● API STATUS: 200 OK</div><div class="browser-code"><span class="code-purple">GET</span> /api/projects<br>{<br><span class="code-indent"><span class="code-property">"status"</span>: <span class="code-string">"success"</span>,</span><br><span class="code-indent"><span class="code-property">"data"</span>: [ ... ]</span><br>}</div></div></div><div class="browser-sidebadge">FASTAPI ↗<small>PYTHON BACKEND</small></div>`;
    return `<div class="design-art"><span class="shape big-circle"></span><span class="shape donut"></span><span class="shape triangle"></span><span class="shape small-star">✳</span><span class="shape squiggle">~</span><span class="art-caption">CREATE SOMETHING DIFFERENT ↗</span></div>`;
  }
  function renderProjects() {
    const root = $('#projectsGrid');
    const filtered = state.projects.filter((source) => {
      const p = displayProject(source);
      const haystack = [p.title, p.summary, p.description, ...p.tech].join(' ').toLocaleLowerCase();
      return (state.filter === 'all' || p.category === state.filter) && haystack.includes(state.query);
    });
    root.innerHTML = filtered.map(source => {
      const p = displayProject(source);
      return `<button type="button" class="project-card is-${escapeHTML(p.size)}" data-project-id="${escapeHTML(p.id)}" aria-label="${escapeHTML(t('ui.project'))}: ${escapeHTML(p.title)}">
        <div class="project-visual visual-${escapeHTML(p.visual)}"><span class="visual-num">${escapeHTML(p.number)} / 03</span><span class="visual-label">${escapeHTML(p.eyebrow)}</span>${projectArt(p)}</div>
        <div class="project-content"><div class="project-meta"><span>${escapeHTML(p.year)} / ${escapeHTML(p.eyebrow.split(' / ')[0])}</span><span class="project-status">${escapeHTML(p.status)}</span></div><div class="project-title-row"><h3>${escapeHTML(p.title)}</h3><span class="project-arrow" aria-hidden="true">↗</span></div><p class="project-summary">${escapeHTML(p.summary)}</p><div class="project-tags">${p.tech.slice(0,4).map(x=>`<span>${escapeHTML(x)}</span>`).join('')}</div></div>
      </button>`;
    }).join('');
    $('#projectsEmpty').hidden = filtered.length > 0;
    $('#allCount').textContent = String(state.projects.length).padStart(2, '0');
  }
  // Projects ship with the static site: no Python server or API is needed.
  function loadProjects() {
    if (Array.isArray(window.XIN_PROJECTS)) {
      state.projects = window.XIN_PROJECTS;
      renderProjects();
    } else {
      $('#projectsGrid').innerHTML = `<div class="projects-loading"><p>${escapeHTML(t('ui.loadError'))}</p></div>`;
    }
  }
  function showProject(id) {
    const original = state.projects.find(p => p.id === id);
    if (!original) return;
    const p = displayProject(original);
    $('#dialogEyebrow').textContent = p.eyebrow;
    $('#dialogYear').textContent = p.year;
    $('#dialogTitle').textContent = p.title;
    $('#dialogDescription').textContent = p.description;
    $('#dialogRole').textContent = p.role;
    $('#dialogStatus').textContent = p.status;
    $('#dialogHighlights').replaceChildren(...p.highlights.map(h => { const li = document.createElement('li'); li.textContent = h; return li; }));
    $('#dialogTech').replaceChildren(...p.tech.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    $('#dialogVisual').innerHTML = `<div class="project-visual visual-${escapeHTML(p.visual)}">${projectArt(p)}</div>`;
    $('#projectDialog').showModal();
  }

  function setLanguage(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    persist('xin-language', lang);
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = t(key);
      if (key === 'hero.line3') {
        el.replaceChildren(document.createTextNode(value), Object.assign(document.createElement('span'), { className: 'accent-period', textContent: '.' }));
      } else if (key === 'form.message') {
        const count = $('#messageCount');
        el.replaceChildren(document.createTextNode(value), count);
      } else if (key === 'filters.all') {
        const count = $('#allCount');
        el.replaceChildren(document.createTextNode(value + ' '), count);
      } else {
        el.textContent = value;
      }
    });
    const toggle = $('#langToggle');
    toggle.textContent = lang === 'it' ? 'EN' : 'IT';
    toggle.setAttribute('aria-label', lang === 'it' ? 'Switch to English' : 'Passa all’italiano');
    $('#projectSearch').placeholder = t('ui.search');
    $('#commandInput').placeholder = t('ui.command');
    $('#contactName').placeholder = t('ui.name');
    $('#contactEmail').placeholder = t('ui.email');
    $('#contactMessage').placeholder = t('ui.message');
    renderProjects();
    if ($('#projectDialog').open) $('#projectDialog').close();
    if ($('#commandDialog').open) renderCommands($('#commandInput').value);
    $('#formStatus').textContent = '';
  }
  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    persist('xin-theme', theme);
    $('#themeToggle').setAttribute('aria-label', theme === 'dark' ? (state.lang === 'en' ? 'Enable light theme' : 'Attiva tema chiaro') : (state.lang === 'en' ? 'Enable dark theme' : 'Attiva tema scuro'));
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#0c0f0f' : '#f4f5ee';
  }

  const commands = [
    { label: {it:'Progetti',en:'Projects'}, desc:'01', target:'#work', icon:'✳' },
    { label: {it:'Chi sono',en:'About'}, desc:'02', target:'#about', icon:'↗' },
    { label: {it:'Competenze',en:'Expertise'}, desc:'03', target:'#expertise', icon:'⌘' },
    { label: {it:'Contatti',en:'Contact'}, desc:'04', target:'#contact', icon:'✉' },
    { label: {it:'Cambia tema',en:'Toggle theme'}, desc:'T', action:'theme', icon:'◐' },
    { label: {it:'Cambia lingua',en:'Switch language'}, desc:'L', action:'lang', icon:'↔' }
  ];
  let commandSelection = 0;
  let visibleCommands = commands;
  function renderCommands(query = '') {
    visibleCommands = commands.filter(item => item.label[state.lang].toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()));
    commandSelection = 0;
    $('#commandResults').innerHTML = visibleCommands.length ? visibleCommands.map((item,i) => `<button class="command-option ${i===0 ? 'is-selected':''}" data-command="${i}" type="button"><span>${item.icon} &nbsp; ${escapeHTML(item.label[state.lang])}</span><small>${escapeHTML(item.desc)}</small></button>`).join('') : `<p style="color:var(--muted);padding:15px">${escapeHTML(t('ui.noResults'))}</p>`;
  }
  function executeCommand(index) {
    const cmd = visibleCommands[index];
    if (!cmd) return;
    $('#commandDialog').close();
    if (cmd.target) {
      document.querySelector(cmd.target)?.scrollIntoView({behavior:prefersReducedMotion?'instant':'smooth'});
    } else if (cmd.action === 'theme') setTheme(state.theme === 'dark' ? 'light' : 'dark');
    else if (cmd.action === 'lang') setLanguage(state.lang === 'it' ? 'en' : 'it');
  }
  function openCommands() {
    if ($('#projectDialog').open) $('#projectDialog').close();
    $('#commandInput').value = '';
    renderCommands();
    $('#commandDialog').showModal();
    $('#commandInput').focus();
  }

  let toastTimeout;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('is-visible'), 4400);
  }

  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const textarea = $('#contactMessage');
    const status = $('#formStatus');
    const btn = $('#submitContact');
    status.className = 'form-status';
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = t('ui.invalid');
      status.classList.add('is-error');
      return;
    }
    if (textarea.value.trim().length < 15) {
      status.textContent = t('ui.short');
      status.classList.add('is-error');
      textarea.focus();
      return;
    }
    // The recipient address is intentionally public: never put passwords or API secrets in a static site.
    const recipient = String(window.XIN_CONFIG?.contactEmail || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      status.textContent = t('ui.configureContact');
      status.classList.add('is-error');
      return;
    }
    // Honeypot to stop basic scripted submissions.
    if ($('#contactWebsite').value.trim()) return;
    const payload = {
      name: $('#contactName').value.trim(),
      email: $('#contactEmail').value.trim(),
      topic: $('#contactTopic').value,
      message: textarea.value.trim(),
      _subject: 'Nuovo messaggio dal sito XIN',
      _template: 'table',
      _honey: ''
    };
    btn.disabled = true;
    btn.querySelector('span').textContent = t('ui.loading');
    try {
      const response = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(recipient), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || result?.success === false || result?.success === 'false') {
        throw new Error('FormSubmit rejected the request');
      }
      form.reset();
      $('#messageCount').textContent = '0 / 3000';
      status.textContent = t('ui.sent');
      status.classList.add('is-success');
      toast(t('ui.sent'));
    } catch (error) {
      console.error('Contact submission failed:', error);
      status.textContent = t('ui.error');
      status.classList.add('is-error');
    } finally {
      btn.disabled = false;
      btn.querySelector('span').textContent = t('form.submit');
    }
  }

  function createParticles() {
    const canvas = $('#particleCanvas');
    const stage = $('#orbStage');
    if (!canvas || !stage || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, rafId, tick = 0, visible = true;
    const particleCount = 76;
    const dots = Array.from({length:particleCount}, (_,i) => ({
      angle: (i/particleCount)*Math.PI*2 + Math.random()*.5,
      distance: .2 + Math.sqrt(Math.random())*.32,
      size: .6 + Math.random()*1.6,
      speed: (.0003 + Math.random()*.0014)*(i%2?1:-1),
      tilt: .62 + Math.random()*.42
    }));
    function resize() {
      const rect = stage.getBoundingClientRect();
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function draw() {
      if (!visible) return;
      ctx.clearRect(0,0,w,h);
      if (!prefersReducedMotion) tick++;
      const points = dots.map(dot => {
        const angle = dot.angle + tick*dot.speed;
        return {x:w/2+Math.cos(angle)*w*dot.distance, y:h/2+Math.sin(angle)*h*dot.distance*dot.tilt, r:dot.size};
      });
      const maxD = Math.min(85,w*.16);
      for (let i=0;i<points.length;i++) {
        const a=points[i];
        for (let j=i+1;j<points.length;j++) {
          const b=points[j], dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);
          if (dist<maxD) {
            ctx.strokeStyle=`rgba(203,229,194,${(1-dist/maxD)*.16})`;
            ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
          }
        }
        ctx.fillStyle = i%5===0 ? 'rgba(200,192,255,.82)' : 'rgba(225,249,194,.65)';
        ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();
      }
      if (!prefersReducedMotion) rafId=requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(entries => {
      visible=entries[0].isIntersecting && !document.hidden;
      if(visible) { cancelAnimationFrame(rafId);draw(); } else cancelAnimationFrame(rafId);
    });
    observer.observe(stage);
    document.addEventListener('visibilitychange',()=>{
      visible=!document.hidden && stage.getBoundingClientRect().bottom>0;
      cancelAnimationFrame(rafId);if(visible)draw();
    });
    new ResizeObserver(()=>{resize();if(prefersReducedMotion)draw();}).observe(stage);
    resize();draw();
  }

  function initAnimations() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px -45px 0px'});
    $$('.reveal').forEach(el=>observer.observe(el));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          $$('.main-nav a').forEach(a=>a.classList.toggle('is-active',a.dataset.nav===entry.target.id));
        }
      });
    },{rootMargin:'-30% 0px -52% 0px'});
    ['work','about','expertise','contact'].forEach(id => {const el=document.getElementById(id);if(el)sectionObserver.observe(el);});
    let raf = false;
    function updateScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      $('.scroll-progress').style.width = (total > 0 ? window.scrollY/total*100 : 0)+'%';
      raf=false;
    }
    window.addEventListener('scroll',()=>{if(!raf){requestAnimationFrame(updateScroll);raf=true;}},{passive:true});
    updateScroll();
    if(window.matchMedia('(pointer:fine)').matches && !prefersReducedMotion){
      const aura=$('.cursor-aura');
      document.addEventListener('pointermove',e=>{aura.style.left=e.clientX+'px';aura.style.top=e.clientY+'px';},{passive:true});
      const stage=$('#orbStage');
      stage.addEventListener('pointermove',e=>{
        const r=stage.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5)*14,y=((e.clientY-r.top)/r.height-.5)*14;
        $('.orb-core',stage).style.transform=`translate3d(${x}px,${y}px,22px)`;
      },{passive:true});
      stage.addEventListener('pointerleave',()=>{$('.orb-core',stage).style.transform='translateZ(22px)';});
    }
    createParticles();
  }

  function initEvents() {
    $('#langToggle').addEventListener('click',()=>{setLanguage(state.lang==='it'?'en':'it');setTheme(state.theme);});
    $('#themeToggle').addEventListener('click',()=>setTheme(state.theme==='dark'?'light':'dark'));
    $('#menuToggle').addEventListener('click',()=>{
      const open=$('#mainNav').classList.toggle('is-open');
      $('#menuToggle').setAttribute('aria-expanded',String(open));
      $('#menuToggle').setAttribute('aria-label',open?'Chiudi menu':'Apri menu');
    });
    $$('#mainNav a').forEach(a=>a.addEventListener('click',()=>{
      $('#mainNav').classList.remove('is-open');
      $('#menuToggle').setAttribute('aria-expanded','false');
    }));
    $$('.filter-button').forEach(btn=>btn.addEventListener('click',()=>{
      state.filter=btn.dataset.filter;
      $$('.filter-button').forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
      renderProjects();
    }));
    $('#projectSearch').addEventListener('input', e=>{state.query=e.target.value.trim().toLocaleLowerCase();renderProjects();});
    $('#resetFilters').addEventListener('click',()=>{
      state.query='';state.filter='all';$('#projectSearch').value='';
      $$('.filter-button').forEach(b=>{const yes=b.dataset.filter==='all';b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes));});
      renderProjects();
    });
    $('#projectsGrid').addEventListener('click',e=>{const card=e.target.closest('[data-project-id]');if(card)showProject(card.dataset.projectId);});
    $('#closeProject').addEventListener('click',()=>$('#projectDialog').close());
    $('#projectDialog').addEventListener('click',e=>{if(e.target===$('#projectDialog'))$('#projectDialog').close();});
    $('#commandDialog').addEventListener('click',e=>{if(e.target===$('#commandDialog'))$('#commandDialog').close();});
    $('#openShortcuts').addEventListener('click',openCommands);
    $('#commandInput').addEventListener('input',e=>renderCommands(e.target.value));
    $('#commandInput').addEventListener('keydown',e=>{
      if(e.key==='Escape'){ e.preventDefault(); $('#commandDialog').close(); return; }
      if(e.key==='ArrowDown' || e.key==='ArrowUp') {
        e.preventDefault();commandSelection=(commandSelection+(e.key==='ArrowDown'?1:-1)+visibleCommands.length)%Math.max(visibleCommands.length,1);
        $$('.command-option').forEach((el,i)=>el.classList.toggle('is-selected',i===commandSelection));
      }
      if(e.key==='Enter'){e.preventDefault();executeCommand(commandSelection);}
    });
    $('#commandResults').addEventListener('click',e=>{const btn=e.target.closest('[data-command]');if(btn)executeCommand(Number(btn.dataset.command));});
    window.addEventListener('keydown',e=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k') {e.preventDefault();$('#commandDialog').open?$('#commandDialog').close():openCommands();}
      if(e.key==='Escape' && $('#mainNav').classList.contains('is-open')){$('#mainNav').classList.remove('is-open');$('#menuToggle').setAttribute('aria-expanded','false');}
    });
    $('#contactMessage').addEventListener('input',e=>{$('#messageCount').textContent=e.target.value.length+' / 3000';});
    $('#contactForm').addEventListener('submit',submitForm);
  }

  $('#year').textContent=new Date().getFullYear();
  initEvents();
  setLanguage(readStored('xin-language')==='en'?'en':'it');
  setTheme(readStored('xin-theme')==='light'?'light':'dark');
  loadProjects();
  initAnimations();
})();
