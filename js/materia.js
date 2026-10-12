/* XIN — Pagina interna di ogni materia: PDF visibili solo dopo l'apertura. */
(() => {
  'use strict';
  const catalog = Array.isArray(window.XIN_MATERIE) ? window.XIN_MATERIE : [];
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '';
  const item = catalog.find(entry => entry.id === id);
  const $ = id => document.getElementById(id);
  const container = $('documentGroups');
  if (!container) return;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = String(text);
    return element;
  };
  const isLocalDocument = r => r && typeof r.file === 'string' &&
    r.file.startsWith('./assets/media/studio/') &&
    !r.file.includes('..') && !r.file.includes('\\') &&
    /\.(pdf|docx|pptx|mp4|zip)$/i.test(r.file);

  if (!item) {
    $('subjectTitle').textContent = 'Materia non trovata.';
    $('subjectDescription').textContent = 'Il collegamento non è valido oppure questa materia non è ancora presente nell’archivio.';
    $('documentsIntro').textContent = 'Torna all’elenco per scegliere una materia.';
    $('subjectDocsCount').textContent = '00';
    $('subjectPagesCount').textContent = '0 pagine';
    $('documentSearch').disabled = true;
    container.append(node('p', 'studio-empty', 'Nessun documento da mostrare.'));
    return;
  }

  const year = Number(item.anno);
  const resources = Array.isArray(item.risorse) ? item.risorse.filter(isLocalDocument) : [];
  const pages = resources.reduce((n, r) => n + (Number(r.pagine) || 0), 0);
  const backHref = './studio.html?anno=' + year + '#subjects';
  $('returnToSubjects').href = backHref;
  $('bottomBack').href = backHref;
  $('crumbYear').textContent = year + '° anno';
  $('crumbTitle').textContent = item.titolo;
  $('subjectTitle').textContent = item.titolo;
  $('subjectKicker').textContent = 'UNIVERSITÀ / ' + year + '° ANNO';
  $('subjectDescription').textContent = item.descrizione || 'Appunti e materiali del corso.';
  $('subjectDocsCount').textContent = String(resources.length).padStart(2, '0');
  $('subjectPagesCount').textContent = pages + (pages === 1 ? ' pagina' : ' pagine');
  $('subjectYear').textContent = 'ANNO ' + String(year).padStart(2, '0');
  $('documentsIntro').textContent = resources.length
    ? 'Sfoglia i documenti della materia, apri la dispensa che ti interessa oppure scaricala sul dispositivo.'
    : 'I documenti per questa materia arriveranno qui.';
  document.title = item.titolo + ' — Università | XIN';
  const topics = $('subjectTopics');
  for (const topic of item.argomenti || []) topics.append(node('span', '', topic));

  const search = $('documentSearch');
  function makeDocument(r, index, featured = false) {
    const card = node('article', 'subject-doc-card' + (featured ? ' subject-doc-card--featured' : ''));
    const badge = node('span', 'subject-doc-badge', featured ? '✳' : String(r.numero || index + 1).padStart(2, '0'));
    badge.setAttribute('aria-hidden', 'true');
    const middle = node('div', 'subject-doc-content');
    middle.append(node('h4', '', r.titolo || 'Documento'));
    const numPages = Number(r.pagine) || 0;
    middle.append(node('p', '', (r.tipo || 'PDF') + (numPages ? ' · ' + numPages + (numPages === 1 ? ' pagina' : ' pagine') : '')));
    const links = node('div', 'subject-doc-actions');
    const open = node('a', 'subject-doc-open', 'Apri ↗');
    open.href = r.file;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.setAttribute('aria-label', 'Apri ' + (r.titolo || 'documento') + ' in una nuova scheda');
    const save = node('a', 'subject-doc-download', 'Scarica ↓');
    save.href = r.file;
    save.setAttribute('download', '');
    save.setAttribute('aria-label', 'Scarica ' + (r.titolo || 'documento'));
    const report = node('button', 'subject-doc-report', '⚑ Segnala');
    report.type = 'button';
    report.dataset.reportFile = r.file;
    report.setAttribute('aria-label', 'Segnala un problema per ' + (r.titolo || 'documento'));
    links.append(open, save, report);
    card.append(badge, middle, links);
    return card;
  }

  function addGroup(parent, title, label, entries, featured = false) {
    if (!entries.length) return;
    const section = node('section', 'subject-document-section' + (featured ? ' subject-document-section--featured' : ''));
    const heading = node('div', 'subject-document-section-head');
    heading.append(node('div', '', title), node('span', '', label));
    const grid = node('div', 'subject-document-grid' + (featured ? ' subject-document-grid--featured' : ''));
    entries.forEach((r, i) => grid.append(makeDocument(r, i, featured)));
    section.append(heading, grid);
    parent.append(section);
  }

  function render() {
    const q = search.value.trim().toLocaleLowerCase('it');
    const matches = resources.filter(r => [r.titolo, r.gruppo, r.numero, r.argomento || ''].join(' ').toLocaleLowerCase('it').includes(q));
    $('documentMatchCount').textContent = matches.length + (matches.length === 1 ? ' documento' : ' documenti');
    container.replaceChildren();
    if (!resources.length) {
      container.append(node('p', 'studio-empty', 'Non ci sono ancora PDF disponibili per questa materia.'));
      return;
    }
    if (!matches.length) {
      container.append(node('p', 'studio-empty', 'Nessuna dispensa trovata. Prova un’altra ricerca.'));
      return;
    }
    const formula = matches.filter(r => r.gruppo === 'Formulario');
    const theory = matches.filter(r => r.gruppo === 'Teoria');
    const exercises = matches.filter(r => r.gruppo === 'Esercitazioni');
    const exams = matches.filter(r => r.gruppo === 'Prove d’esame');
    const tutors = matches.filter(r => r.gruppo === 'Tutorati');
    const references = matches.filter(r => r.gruppo === 'Riferimenti');
    const chapters = matches.filter(r => !['Formulario', 'Teoria', 'Esercitazioni', 'Prove d’esame', 'Tutorati', 'Riferimenti'].includes(r.gruppo));
    addGroup(container, 'Formulario', 'DA CONSULTARE', formula, true);
    addGroup(container, 'Teoria', 'CAPITOLI E APPUNTI', theory);
    addGroup(container, 'Esercitazioni', 'ESERCIZI E SVOLGIMENTI', exercises);
    addGroup(container, 'Tutorati', 'ESERCIZI E RIPASSO', tutors);
    addGroup(container, 'Materiale di riferimento', 'TAVOLE E CONSULTAZIONE', references, true);
    addGroup(container, 'Prove d’esame', 'SIMULAZIONI E PARZIALI', exams);
    addGroup(container, 'Dispense e appunti', 'ORDINATI PER ARGOMENTO', chapters);
  }


  /* Azioni sulla materia: preferiti, condivisione, archivio ZIP e segnalazioni. */
  const features = window.XIN_STUDY;
  const favorite = $('subjectFavorite');
  const feedback = $('subjectActionFeedback');
  const say = message => { if (feedback) feedback.textContent = message || ''; };
  function updateFavorite() {
    if (!features || !favorite) return;
    const active = features.isFavorite(item.id);
    favorite.textContent = active ? '♥ Salvata nei preferiti' : '♡ Salva nei preferiti';
    favorite.setAttribute('aria-pressed', String(active));
  }
  favorite?.addEventListener('click', () => {
    if (!features?.toggleFavorite(item.id)) { say('Impossibile salvare: storage del browser disabilitato.'); return; }
    updateFavorite();
    say(features.isFavorite(item.id) ? 'Materia aggiunta ai preferiti.' : 'Materia rimossa dai preferiti.');
  });
  updateFavorite();
  window.addEventListener('storage', event => { if (event.key === 'xin-study-favorites') updateFavorite(); });

  const shareButton = $('subjectShare');
  const shareLinks = $('subjectShareLinks');
  if (features && shareLinks) {
    const links = features.shareLinks(item);
    const label = node('span', '', 'Oppure scegli:');
    const wa = node('a', '', 'WhatsApp ↗'); wa.href = links.whatsapp; wa.target = '_blank'; wa.rel = 'noopener noreferrer';
    const tg = node('a', '', 'Telegram ↗'); tg.href = links.telegram; tg.target = '_blank'; tg.rel = 'noopener noreferrer';
    shareLinks.append(label, wa, tg);
  }
  shareButton?.addEventListener('click', async () => {
    if (!features) return;
    shareLinks.hidden = false;
    const message = await features.share(item);
    if (message) say(message);
  });

  const zipBlock = $('subjectZipBlock');
  const parts = window.XIN_ZIP_MANIFEST?.[item.id];
  if (zipBlock) {
    zipBlock.append(node('strong', '', 'Archivio completo della materia'));
    if (!resources.length) {
      zipBlock.append(node('p', '', 'Nessun documento disponibile per questa materia.'));
    } else if (!Array.isArray(parts) || !parts.length) {
      zipBlock.append(node('p', '', 'ZIP in preparazione. Intanto puoi scaricare i singoli documenti qui sotto.'));
    } else {
      zipBlock.append(node('p', '', parts.length === 1 ? 'Scarica tutti i materiali con un clic.' : 'Archivio diviso in ' + parts.length + ' parti, ciascuna sotto 99 MB. Scaricale tutte per avere i materiali completi.'));
      const list = node('div', 'xin-zip-downloads');
      for (const [idx, part] of parts.entries()) {
        if (!part || typeof part.file !== 'string' || !part.file.startsWith('./assets/media/studio/zip/') || part.file.includes('..') || !/\.zip$/i.test(part.file)) continue;
        const link = node('a', 'xin-zip-link', parts.length === 1 ? '↓ Scarica ZIP' : '↓ Scarica parte ' + (idx + 1));
        link.href = part.file;
        link.download = '';
        if (Number.isFinite(part.bytes)) link.textContent += ' · ' + (part.bytes / 1000000).toFixed(1) + ' MB';
        list.append(link);
      }
      zipBlock.append(list);
    }
  }

  const dialog = $('reportDialog'), form = $('reportForm'), reportStatus = $('reportStatus');
  const reportDocument = $('reportDocument'), reportContext = $('reportContext');
  const fallback = $('reportEmailFallback');
  const recipient = window.XIN_CONFIG?.contactEmail;
  const configured = typeof recipient === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient);
  const docLinks = new Map(resources.map(r => [r.file, r]));
  if (reportDocument) {
    const all = node('option', '', 'Intera materia / Non specificato'); all.value = '';
    reportDocument.append(all);
    for (const r of resources) {
      const option = node('option', '', r.titolo || r.file.split('/').pop());
      option.value = r.file;
      reportDocument.append(option);
    }
  }
  function openReport(path = '') {
    if (!dialog || !form) return;
    form.reset(); reportStatus.textContent = '';
    fallback.hidden = true;
    reportDocument.value = docLinks.has(path) ? path : '';
    reportContext.textContent = 'Materia: ' + item.titolo + (docLinks.has(path) ? ' · Documento: ' + docLinks.get(path).titolo : '') + '. Segnala un problema e verificherò il materiale.';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeReport() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
  }
  $('subjectReport')?.addEventListener('click', () => openReport());
  $('reportClose')?.addEventListener('click', closeReport);
  $('reportCancel')?.addEventListener('click', closeReport);
  dialog?.addEventListener('click', e => { if (e.target === dialog) closeReport(); });
  container.addEventListener('click', e => {
    const button = e.target.closest('[data-report-file]');
    if (button) openReport(button.dataset.reportFile);
  });
  const manualMail = payload => 'mailto:' + (recipient || 'X1ngraphic1@gmail.com') + '?subject=' + encodeURIComponent(payload._subject) + '&body=' + encodeURIComponent(payload.message + '\n\n' + payload.url + '\n' + payload.document + '\n\nEmail per risposta: ' + (payload.email || 'Non indicata'));
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.elements._honey.value) return;
    const chosen = docLinks.get(reportDocument.value);
    const payload = {
      _subject: 'Segnalazione XIN · ' + item.titolo,
      _template: 'table', _honey: '',
      subject: item.titolo,
      issue: $('reportType').value,
      document: chosen ? chosen.titolo + ' — ' + chosen.file : 'Intera materia',
      url: chosen ? new URL(chosen.file, location.href).href : location.href,
      email: $('reportEmail').value.trim(),
      message: $('reportMessage').value.trim()
    };
    fallback.href = manualMail(payload);
    const send = $('reportSubmit'); send.disabled = true;
    fallback.hidden = true;
    reportStatus.textContent = 'Invio in corso…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      if (!configured) throw Error('Email non configurata');
      const response = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(recipient), {
        method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        signal: controller.signal, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || result.success === false || result.success === 'false') throw Error('Invio non confermato');
      reportStatus.textContent = 'Segnalazione inviata. Grazie!';
      form.reset();
    } catch (_) {
      reportStatus.textContent = 'Invio automatico non riuscito. Puoi inviare la segnalazione tramite email.';
      fallback.hidden = false;
    } finally { clearTimeout(timeout); send.disabled = false; }
  });

  search.addEventListener('input', render);
  render();
})();
