/* XIN — Archivio universitario: qui compaiono solo le materie. */
(() => {
  'use strict';
  const catalog = Array.isArray(window.XIN_MATERIE) ? window.XIN_MATERIE : [];
  const target = document.getElementById('studyGroups');
  const total = document.getElementById('totalSubjects');
  const search = document.getElementById('subjectSearch');
  const filters = [...document.querySelectorAll('[data-year]')];
  if (!target || !total || !search) return;

  const el = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = String(value);
    return node;
  };
  const queryYear = new URLSearchParams(window.location.search).get('anno');
  let selectedYear = ['1','2','3'].includes(queryYear) ? queryYear : 'all';
  total.textContent = String(catalog.length).padStart(2, '0');

  function resourceCount(item) {
    return Array.isArray(item.risorse)
      ? item.risorse.filter(r => r && typeof r.file === 'string' &&
        r.file.startsWith('./assets/media/studio/') && !r.file.includes('..') &&
        !r.file.includes('\\') && /\.(pdf|zip)$/i.test(r.file)).length
      : 0;
  }

  function makeSubject(item, year) {
    const num = resourceCount(item);
    const card = el('article', 'study-card study-card--subject');
    card.id = 'materia-' + item.id;

    const top = el('div', 'study-card-top');
    top.append(el('span', 'study-card-code', 'MATERIA / ' + String(year).padStart(2,'0')),
      el('span', 'study-card-state', num ? `${num} ${num === 1 ? 'documento' : 'documenti'}` : 'In preparazione'));
    card.append(top);

    const title = el('h4', '', item.titolo);
    const description = el('p', '', item.descrizione || 'Materiali e appunti del corso.');
    card.append(title, description);

    const tags = el('div', 'study-tags');
    for (const topic of (item.argomenti || []).slice(0, 5)) {
      tags.append(el('span', '', topic));
    }
    card.append(tags);

    const href = './materia.html?id=' + encodeURIComponent(item.id);
    const link = el('a', 'study-card-visit');
    link.href = href;
    link.setAttribute('aria-label', 'Apri la materia ' + item.titolo);
    link.append(el('span', '', num ? 'Apri la materia e consulta i PDF' : 'Apri la materia'),
      el('span', 'study-card-visit-arrow', '↗'));
    card.append(link);
    return card;
  }

  function render() {
    target.replaceChildren();
    const term = search.value.trim().toLocaleLowerCase('it');
    let found = 0;

    for (const year of [1, 2, 3]) {
      if (selectedYear !== 'all' && selectedYear !== String(year)) continue;
      const items = catalog.filter(item => {
        if (Number(item.anno) !== year) return false;
        const searchText = [item.titolo, item.descrizione, ...(item.argomenti || []),
          ...(Array.isArray(item.risorse) ? item.risorse.map(r => r.titolo || '') : [])]
          .join(' ').toLocaleLowerCase('it');
        return searchText.includes(term);
      });
      if (!items.length) continue;
      found += items.length;

      const section = el('section', 'study-year');
      const heading = el('div', 'study-year-title');
      heading.append(el('h3', '', `${year}° anno`),
        el('span', '', `${items.length} ${items.length === 1 ? 'materia' : 'materie'}`));
      const grid = el('div', 'study-grid');
      items.forEach(item => grid.append(makeSubject(item, year)));
      section.append(heading, grid);
      target.append(section);
    }
    if (!found) target.append(el('p', 'studio-empty', 'Nessuna materia trovata con questi filtri.'));
  }

  for (const button of filters) {
    button.addEventListener('click', () => {
      selectedYear = button.dataset.year;
      filters.forEach(b => {
        const active = button === b;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  }
  search.addEventListener('input', render);
  filters.forEach(b => {
    const active = b.dataset.year === selectedYear;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  render();
})();
