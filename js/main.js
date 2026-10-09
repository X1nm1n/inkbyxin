/* XIN Portfolio — Vanilla JavaScript, senza framework né backend.
   Compatibile con GitHub Pages, funzionalità responsive e progressive enhancement. */
(() => {
  'use strict';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const projects = Array.isArray(window.XIN_PROJECTS) ? window.XIN_PROJECTS : [];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const safeText = value => typeof value === 'string' ? value : String(value ?? '');
  const el = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = safeText(content);
    return node;
  };

  // Appearance and navigation
  const themeBtn = $('#themeToggle');
  function syncTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (themeBtn) themeBtn.setAttribute('aria-label', dark ? 'Passa al tema chiaro' : 'Passa al tema scuro');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#121c32' : '#f6f4ef');
  }
  syncTheme();
  themeBtn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('xin-theme', next); } catch(e) { /* blocked storage */ }
    syncTheme();
  });
  const menu = $('#menuToggle'), nav = $('#mainNav');
  const closeMenu = () => {
    nav?.classList.remove('is-open'); menu?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded','false'); menu?.setAttribute('aria-label','Apri il menu');
  };
  menu?.addEventListener('click', () => {
    const on = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', on); menu.classList.toggle('is-open', on);
    menu.setAttribute('aria-expanded', String(on)); menu.setAttribute('aria-label', on ? 'Chiudi il menu' : 'Apri il menu');
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (nav?.classList.contains('is-open') && !e.target.closest('.site-header')) closeMenu();
  });
  const year = $('#year'); if (year) year.textContent = String(new Date().getFullYear());
  const progress = $('#scrollProgress');
  let scrollQueued = false;
  const setScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, max>0 ? scrollY/max : 0))})`;
    scrollQueued = false;
  };
  addEventListener('scroll', () => { if(!scrollQueued){scrollQueued=true;requestAnimationFrame(setScroll);} },{passive:true});
  setScroll();

  // Subtle magnetic response in the hero, disabled for touch / reduced motion.
  if (!reducedMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const art = $('#heroArt'), symbol = $('#heroEmblem');
    art?.addEventListener('pointermove', e => {
      const rect = art.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      symbol.style.transform = `translate(calc(-50% + ${x*21}px),calc(-50% + ${y*16}px)) rotate(${(-8+x*5).toFixed(1)}deg)`;
    });
    art?.addEventListener('pointerleave', () => { symbol.style.transform = ''; });
  }
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {entry.target.classList.add('is-visible');io.unobserve(entry.target);}
    }, {threshold:.08,rootMargin:'0px 0px -25px 0px'});
    $$('[data-reveal]').forEach(item => io.observe(item));
  } else $$('[data-reveal]').forEach(item=>item.classList.add('is-visible'));

  // Images are only accepted from the local public media folder.
  function validImage(src) {
    return typeof src === 'string' && /^\.\/assets\/media\/(progetti|fotografie|illustrazioni|studio)\/[\w\-./%]+\.(png|jpe?g|webp|avif|svg)$/i.test(src) && !src.includes('..');
  }
  function visualMarkup(project) {
    // This editorial artwork is a placeholder only. Real images override it.
    const type = project.visual || project.category;
    if (type === 'ai') return `<div class="scene-inner" aria-hidden="true"><div class="scene-top"><span>API // SPEC</span><span class="scene-dots"><i></i><i></i><i></i></span></div><div class="scene-code"><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="scene-bottom"><span>↗ EXPLORING</span><span>STATUS: READY</span></div></div>`;
    if (type === 'web') return `<div class="scene-inner" aria-hidden="true"><div class="mock-top"><i></i><i></i><i></i><span>WEB APPLICATION ↗</span></div><div class="mock-body"><span class="mock-eyebrow">DESIGN / DEVELOP</span><div class="mock-heading"></div><div class="mock-heading short"></div><div class="mock-lines"><b></b><b></b></div><div class="mock-tiles"><i></i><i></i><i></i></div></div></div>`;
    if (type === 'branding') return `<div class="scene-inner" aria-hidden="true"><img src="./assets/logo-xin.svg" alt=""><span>DESIGN IS IDENTITY</span></div>`;
    if (type === 'editorial') return `<div class="scene-inner" aria-hidden="true"><span class="editorial-top">XIN / VISUAL NOTES</span><strong>Aa.</strong><span class="editorial-lines"></span><span class="editorial-bottom">COMPOSITION IS EVERYTHING ↗</span></div>`;
    if (type === 'design') return `<div class="scene-inner" aria-hidden="true"><div class="vector-circle"></div><div class="vector-diag"></div><div class="vector-sticker">✳</div></div>`;
    if (type === 'study') return `<div class="scene-inner" aria-hidden="true"><span class="notebook-mini">UNICA / 2026</span><div class="notebook-head">STUDY<br>NOTES.</div><div class="notebook-line"></div><div class="notebook-line"></div><div class="notebook-line"></div><div class="notebook-line"></div><span class="notebook-tag">PDF ↗</span></div>`;
    return `<div class="scene-inner" aria-hidden="true">✳</div>`;
  }
  function makeVisual(project, withLabel=true) {
    const kind = safeText(project.visual || project.category || 'design').replace(/[^\w-]/g,'');
    const visual = el('div', `project-visual visual-${kind}`);
    if (validImage(project.image)) {
      const img=el('img','project-image'); img.src=project.image;img.alt=safeText(project.alt || project.title);img.loading='lazy';
      visual.append(img);
    } else visual.insertAdjacentHTML('beforeend',visualMarkup(project));
    if(withLabel) {
      const top=el('div','project-overline');
      top.append(el('span','featured-pill',safeText(project.eyebrow || 'XIN / WORK')),
                 el('span','',safeText(project.year || '2026')));
      visual.append(top,el('span','project-corner-arrow','↗'));
    }
    return visual;
  }
  const grid = $('#projectsGrid'), empty = $('#projectsEmpty');
  const query = $('#projectSearch'); let category = 'all';
  const filterButtons = $$('[data-filter]');
  function setCategory(value) {
    category=value;
    filterButtons.forEach(btn=>{const active=btn.dataset.filter===category;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));});
    renderProjects();
  }
  function renderProjects() {
    if(!grid) return;
    const q=(query?.value || '').toLocaleLowerCase('it').trim();
    const selected=projects.filter(item=> (category==='all'||item.category===category) &&
      [item.title,item.eyebrow,item.summary,item.description,...(item.tech||[])].map(safeText).join(' ').toLocaleLowerCase('it').includes(q));
    grid.replaceChildren();
    for (const project of selected) {
      const card=el('button','project-card');card.type='button';card.setAttribute('aria-label','Apri progetto: '+safeText(project.title));
      card.append(makeVisual(project));
      const info=el('div','project-information'), left=el('div');
      left.append(el('h3','',project.title),el('p','',project.summary));
      info.append(left,el('span','',String(project.category).toUpperCase()+' / '+safeText(project.number || '')));
      card.append(info);card.addEventListener('click',()=>openProject(project));grid.append(card);
    }
    if(empty) empty.hidden=selected.length!==0;
    const count=$('#workCount');if(count) count.textContent=String(projects.length).padStart(2,'0');
  }
  filterButtons.forEach(button=>button.addEventListener('click',()=>setCategory(button.dataset.filter)));
  query?.addEventListener('input',renderProjects);
  $('#resetFilters')?.addEventListener('click',()=>{query.value='';setCategory('all');});
  $$('[data-filter-link]').forEach(link=>link.addEventListener('click',()=>{ if(query) query.value='';setCategory(link.dataset.filterLink); }));
  renderProjects();

  const dialog=$('#projectDialog'), closeButton=$('#closeProject');let returnFocus=null;
  function openProject(project) {
    if(!dialog) return;
    returnFocus=document.activeElement;
    const visual=$('#dialogVisual');visual.replaceChildren(makeVisual(project,false));
    $('#dialogEyebrow').textContent=safeText(project.eyebrow||'XIN / PORTFOLIO');
    $('#dialogTitle').textContent=safeText(project.title);
    $('#dialogDescription').textContent=safeText(project.description || project.summary);
    $('#dialogRole').textContent=safeText(project.role||'Progetto personale');
    $('#dialogStatus').textContent=safeText(project.status||'In corso');
    const list=$('#dialogHighlights');list.replaceChildren();
    (project.highlights||[]).forEach(h=>list.append(el('li','',h)));
    const tags=$('#dialogTech');tags.replaceChildren();
    (project.tech||[]).forEach(tag=>tags.append(el('span','',tag)));
    const rights=$('#dialogRights');
    rights.hidden=!(project.credit||project.license);
    rights.textContent=[project.credit,project.license].filter(Boolean).join(' · ');
    const resource=$('#dialogResource');
    const safeFile=typeof project.file==='string' && /^\.\/(studio\.html|assets\/media\/[\w\-./%]+\.(pdf|zip))$/i.test(project.file) && !project.file.includes('..');
    resource.hidden=!safeFile;
    if(safeFile){resource.href=project.file;resource.textContent=project.file.endsWith('studio.html')?'Vai all’archivio studio ↗':'Apri la risorsa ↗';}
    dialog.showModal();closeButton?.focus();
  }
  function closeProject(){if(dialog?.open)dialog.close();}
  closeButton?.addEventListener('click',closeProject);
  dialog?.addEventListener('click',e=>{if(e.target===dialog) closeProject();});
  dialog?.addEventListener('close',()=>returnFocus?.focus());

  // Command menu: Ctrl/Command+K, accessible links, local-only navigation.
  const command=$('#commandDialog'),commandSearch=$('#commandSearch'),commandResults=$('#commandResults');
  const destinations=[{name:'Homepage',url:'#top',detail:'Torna all’inizio'},
    {name:'Portfolio grafico',url:'#work',detail:'Identità, illustrazione, fotografia, editoriale'},
    {name:'Discipline grafiche',url:'#disciplines',detail:'Branding, illustrazione, fotografia, editoriale'},
    {name:'Università — sezione separata',url:'./studio.html',detail:'Appunti personali, PDF e materie'},
    {name:'Chi sono',url:'#about',detail:'Conosci Xinmin'},
    {name:'Contatti',url:'#contact',detail:'Scrivi un messaggio'},
    {name:'Privacy',url:'./privacy.html',detail:'Trattamento dei dati'},
    {name:'Diritti e liberatorie',url:'./diritti.html',detail:'Fotografia e copyright'}];
  function renderCommands(){
    if(!commandResults) return;
    commandResults.replaceChildren();commandResults.className='command-results';
    const q=(commandSearch.value||'').toLocaleLowerCase('it');
    for (const item of destinations.filter(d=>(d.name+' '+d.detail).toLocaleLowerCase('it').includes(q))){
      const anchor=el('a','command-result');anchor.href=item.url;
      anchor.append(el('span','',item.name),el('small','',item.detail+' ↗'));
      anchor.addEventListener('click',()=>command.close());commandResults.append(anchor);
    }
  }
  function openCommand(){if(!command||dialog?.open)return;command.showModal();commandSearch.value='';renderCommands();commandSearch.focus();}
  function closeCommand(){command?.close();}
  commandSearch?.addEventListener('input',renderCommands);
  $('#closeCommand')?.addEventListener('click',closeCommand);
  command?.addEventListener('click',e=>{if(e.target===command)closeCommand();});
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(command?.open)closeCommand();else openCommand();}
    if(e.key==='Escape'){closeMenu();if(command?.open)closeCommand();}
  });

  // Contact: actual remote delivery via FormSubmit. First-ever send requires mailbox confirmation.
  const form=$('#contactForm'),status=$('#formStatus'),submit=$('#submitContact');
  const email=window.XIN_CONFIG?.contactEmail;
  const validRecipient=typeof email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(form&&validRecipient) form.action='https://formsubmit.co/'+encodeURIComponent(email);
  const msg=(message,kind='')=>{if(!status)return;status.textContent=message;status.className='form-status '+(kind?'is-'+kind:'');};
  form?.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.checkValidity()){form.reportValidity();msg('Controlla i campi obbligatori e riprova.','error');return;}
    const name=$('#contactName').value.trim(), sender=$('#contactEmail').value.trim(), topic=$('#contactTopic').value;
    const message=$('#contactMessage').value.trim();
    if(name.length<2||message.length<15){msg('Inserisci un nome valido e almeno 15 caratteri nel messaggio.','error');return;}
    if(!validRecipient){msg('Modulo momentaneamente non configurato. Scrivimi a X1ngraphic1@gmail.com.','error');return;}
    if(form.elements._honey?.value) return;
    submit.disabled=true;msg('Invio del messaggio in corso…');
    const timer=new AbortController();const timeout=setTimeout(()=>timer.abort(),15000);
    try {
      const response=await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(email),{
        method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:timer.signal,
        body:JSON.stringify({name,email:sender,topic,message,_subject:'Nuovo messaggio XIN Portfolio · '+topic,_template:'table',_honey:''})
      });
      const result=await response.json();
      if(!response.ok||result.success===false||result.success==='false')throw Error('server rejected');
      msg('Messaggio inviato! Se è il primo invio, devo prima confermare l’attivazione tramite Gmail. Grazie!','success');
      form.reset();
    } catch(e) {
      msg('Non è stato possibile confermare l’invio. Riprova oppure scrivi direttamente a X1ngraphic1@gmail.com.','error');
    } finally {clearTimeout(timeout);submit.disabled=false;}
  });
})();
