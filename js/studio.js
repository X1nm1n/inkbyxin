/* Catalogo statico. Nessuna richiesta API: compatibile con GitHub Pages. */
(() => {
  'use strict';
  let data = Array.isArray(window.XIN_MATERIE) ? window.XIN_MATERIE : [];
  const target = document.getElementById('studyGroups');
  const total = document.getElementById('totalSubjects');
  const search = document.getElementById('subjectSearch');
  const buttons = Array.from(document.querySelectorAll('[data-year]'));
  let selected = 'all';
  total.textContent = String(data.length).padStart(2,'0');
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = String(text);
    return el;
  };
  function render() {
    target.replaceChildren();
    const q = search.value.trim().toLocaleLowerCase('it');
    let results = 0;
    for (const yr of [1,2,3]) {
      if (selected !== 'all' && selected !== String(yr)) continue;
      const items = data.filter(item => Number(item.anno) === yr &&
        [item.titolo,item.descrizione,...(item.argomenti || [])].join(' ').toLocaleLowerCase('it').includes(q));
      if (!items.length) continue;
      results += items.length;
      const section=make('section','study-year');
      const header=make('div','study-year-title');
      header.append(make('h3','',yr + '° anno'),make('span','',items.length+' '+(items.length===1?'materia':'materie')));
      const grid=make('div','study-grid');
      for (const item of items) {
        const card=make('article','study-card');
        const top=make('div','study-card-top');
        const resources=Array.isArray(item.risorse) ? item.risorse.filter(x => typeof x.file==='string' && x.file.trim()) : [];
        top.append(make('span','study-card-code','MATERIA / '+String(yr).padStart(2,'0')),make('span','study-card-state',resources.length?'Documenti disponibili':'In preparazione'));
        card.append(top,make('h4','',item.titolo),make('p','',item.descrizione || 'Appunti personali.'));
        const tags=make('div','study-tags');
        for (const topic of item.argomenti || []) tags.append(make('span','',topic));
        card.append(tags);
        const links=make('div','study-resources');
        if (!resources.length) links.append(make('p','','Nessun PDF pubblicato per ora.'));
        for (const resource of resources) {
          // Use only relative files under the approved public course folder, not javascript: or arbitrary URLs.
          const relative = './assets/media/studio/';
          if (!resource.file.startsWith(relative) || resource.file.includes('..') || !/\.(pdf|zip)$/i.test(resource.file)) continue;
          const a=make('a','',resource.titolo || 'Apri documento');
          a.href=resource.file;
          a.target='_blank';a.rel='noopener noreferrer';
          a.append(make('span','','↗'));
          links.append(a);
        }
        card.append(links);grid.append(card);
      }
      section.append(header,grid);target.append(section);
    }
    if (!results) target.append(make('p','studio-empty','Nessuna materia trovata con questi filtri.'));
  }
  buttons.forEach(button => button.addEventListener('click',() => {
    selected=button.dataset.year;
    buttons.forEach(b => {const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    render();
  }));
  search.addEventListener('input',render);
  render();
  // Le materie sono definite in js/materie.js e aggiornate manualmente da PyCharm.
})();
