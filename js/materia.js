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
    /\.(pdf|zip)$/i.test(r.file);

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
    links.append(open, save);
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
    const matches = resources.filter(r => [r.titolo, r.gruppo, r.numero].join(' ').toLocaleLowerCase('it').includes(q));
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
    const chapters = matches.filter(r => r.gruppo !== 'Formulario');
    addGroup(container, 'Formulario', 'DA CONSULTARE', formula, true);
    addGroup(container, 'Dispense e appunti', 'ORDINATI PER ARGOMENTO', chapters);
  }

  search.addEventListener('input', render);
  render();
})();
