/* XIN — Three-stage Behind the Art gallery */
(() => {
  'use strict';
  const dialog = document.getElementById('behindImageDialog');
  const image = document.getElementById('behindDialogImage');
  const title = document.getElementById('behindDialogTitle');
  const step = document.getElementById('behindDialogStep');
  const close = document.getElementById('behindDialogClose');
  const previous = document.getElementById('behindDialogPrevious');
  const next = document.getElementById('behindDialogNext');
  const triggers = [...document.querySelectorAll('[data-behind-index]')];
  if (!dialog || !image || !triggers.length) return;
  const stages = [
    { src: './assets/custom/behind-photo.jpg', name: 'Fotografia originale', step: '01 / ORIGINE', alt: 'La fotografia originale con il soggetto in abito tradizionale e lo sfondo reale' },
    { src: './assets/custom/behind-sketch-contours.png', name: 'Bozza dei contorni', step: '02 / STUDIO', alt: 'Studio a contorni del ritratto con tutti i dettagli e lo sfondo' },
    { src: './assets/custom/behind-final.png', name: 'Vettoriale finale', step: '03 / RISULTATO', alt: 'Ritratto vettoriale completo, ambientazione inclusa' }
  ];
  let current = 0;
  let lastTrigger = null;
  function show(index) {
    current = (index + stages.length) % stages.length;
    const value = stages[current];
    image.src = value.src;
    image.alt = value.alt;
    title.textContent = value.name;
    step.textContent = value.step;
  }
  triggers.forEach(button => button.addEventListener('click', () => {
    lastTrigger = button;
    show(Number(button.dataset.behindIndex));
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else window.open(stages[current].src, '_blank', 'noopener');
  }));
  close?.addEventListener('click', () => dialog.close());
  previous?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  });
  dialog.addEventListener('close', () => lastTrigger?.focus());
})();
