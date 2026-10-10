/* Catalogo universitario XIN: statico e compatibile con GitHub Pages. */
(() => {
  'use strict';
  const data = Array.isArray(window.XIN_MATERIE) ? window.XIN_MATERIE : [];
  const target = document.getElementById('studyGroups');
  const total = document.getElementById('totalSubjects');
  const search = document.getElementById('subjectSearch');
  const buttons = Array.from(document.querySelectorAll('[data-year]'));
  if (!target || !total || !search) return;

  let selected = 'all';
  total.textContent = String(data.length).padStart(2, '0');

  const make = (tag, className, content) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = String(content);
    return el;
  };

  function validResource(resource) {
    if (!resource || typeof resource.file !== 'string') return false;
    const path = resource.file;
    // Consenti esclusivamente percorsi relativi interni all'archivio pubblico.
    return path.startsWith('./assets/media/studio/') &&
      !path.includes('..') &&
      !path.includes('\\') &&
      /\.(pdf|zip)$/i.test(path);
  }

  function addResource(resourcesContainer, resource, index, special = false) {
    const row = make('div', 'study-resource' + (special ? ' study-resource--featured' : ''));
    const open = make('a', 'study-resource-open');
    open.href = resource.file;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.setAttribute('aria-label', `Apri ${resource.titolo || 'documento'} in una nuova scheda`);

    const badge = make('span', 'study-resource-number', special ? '✳' : (resource.numero || String(index + 1).padStart(2, '0')));
    const content = make('span', 'study-resource-content');
    content.append(make('strong', '', resource.titolo || 'Documento'));
    const count = Number(resource.pagine);
    const detail = [resource.tipo || 'PDF'];
    if (count > 0) detail.push(count + (count === 1 ? ' pagina' : ' pagine'));
    content.append(make('small', '', detail.join(' · ')));
    const arrow = make('span', 'study-resource-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    open.append(badge, content, arrow);

    const download = make('a', 'study-resource-download', '↓');
    download.href = resource.file;
    download.setAttribute('download', '');
    download.title = `Scarica ${resource.titolo || 'documento'}`;
    download.setAttribute('aria-label', download.title);
    row.append(open, download);
    resourcesContainer.append(row);
  }

  function render() {
    target.replaceChildren();
    const q = search.value.trim().toLocaleLowerCase('it');
    let count = 0;

    for (const yr of [1, 2, 3]) {
      if (selected !== 'all' && selected !== String(yr)) continue;
      const items = data.filter(item => Number(item.anno) === yr &&
        [item.titolo, item.descrizione, ...(item.argomenti || []),
          ...(Array.isArray(item.risorse) ? item.risorse.map(r => r.titolo || '') : [])]
          .join(' ').toLocaleLowerCase('it').includes(q));
      if (!items.length) continue;
      count += items.length;

      const section = make('section', 'study-year');
      const header = make('div', 'study-year-title');
      header.append(make('h3', '', yr + '° anno'),
                    make('span', '', items.length + ' ' + (items.length === 1 ? 'materia' : 'materie')));
      const grid = make('div', 'study-grid');

      for (const item of items) {
        const resources = Array.isArray(item.risorse) ? item.risorse.filter(validResource) : [];
        const extensive = resources.length > 5;
        const card = make('article', 'study-card' + (extensive ? ' study-card--library' : ''));
        card.id = 'materia-' + item.id;
        const top = make('div', 'study-card-top');
        top.append(make('span', 'study-card-code', 'MATERIA / ' + String(yr).padStart(2, '0')),
          make('span', 'study-card-state', resources.length ? resources.length + ' PDF disponibili' : 'In preparazione'));
        card.append(top, make('h4', '', item.titolo), make('p', '', item.descrizione || 'Appunti personali.'));
        const tags = make('div', 'study-tags');
        for (const topic of item.argomenti || []) tags.append(make('span', '', topic));
        card.append(tags);

        if (resources.length > 0) {
          const holder = make('div', extensive ? 'study-resources study-resources--library' : 'study-resources');
          const sections = extensive
            ? [resources.filter(r => r.gruppo === 'Formulario'), resources.filter(r => r.gruppo !== 'Formulario')]
            : [resources];
          for (let groupIndex = 0; groupIndex < sections.length; groupIndex++) {
            const group = sections[groupIndex];
            if (!group.length) continue;
            const special = extensive && groupIndex === 0;
            const sub = make('div', 'study-resource-section');
            if (extensive) {
              const title = make('div', 'study-resource-heading');
              title.append(make('strong', '', special ? 'FORMULARIO / CONSULTAZIONE RAPIDA' : 'DISPENSE / TEORIA'),
                make('span', '', group.length + (group.length === 1 ? ' documento' : ' documenti')));
              sub.append(title);
            }
            const list = make('div', 'study-resource-list' + (special ? ' study-resource-list--featured' : ''));
            group.forEach((resource, index) => addResource(list, resource, index, special));
            sub.append(list);
            holder.append(sub);
          }
          card.append(holder);
        } else {
          const holder = make('div', 'study-resources');
          holder.append(make('p', '', 'Nessun PDF pubblicato per ora.'));
          card.append(holder);
        }
        grid.append(card);
      }
      section.append(header, grid);
      target.append(section);
    }

    if (!count) target.append(make('p', 'studio-empty', 'Nessuna materia trovata con questi filtri.'));
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.year;
    buttons.forEach(b => {
      const active = b === button;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    render();
  }));
  search.addEventListener('input', render);
  render();
})();
