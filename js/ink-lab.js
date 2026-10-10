// XIN / Living Ink: static-site interactive artwork. No external dependencies.
(() => {
  'use strict';
  const root = document.getElementById('inkExperience');
  if (!root) return;
  const stage = document.getElementById('inkVisual');
  const tabs = [...root.querySelectorAll('[data-ink]')];
  const scenes = [...root.querySelectorAll('[data-ink-scene]')];
  const path = document.getElementById('inkMotionLine');
  const nib = root.querySelector('.ink-nib');
  const replay = document.getElementById('inkReplay');
  const caption = document.getElementById('inkCaption');
  const status = document.getElementById('inkStateLabel');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const modes = {
    design: { label: 'GEOMETRIA / FORMA / IDENTITÀ', index: '01 — DESIGN', path: 'M95 487 C177 373 227 459 309 382 S433 260 532 308 S603 342 622 207' },
    illustration: { label: 'LINEA / GESTO / IMMAGINAZIONE', index: '02 — ILLUSTRAZIONE', path: 'M96 456 C182 528 256 419 227 353 C185 265 240 209 319 223 S458 404 513 329 S566 154 617 166' },
    photography: { label: 'LUCE / OMBRA / PROSPETTIVA', index: '03 — FOTOGRAFIA', path: 'M110 456 C172 394 250 432 304 383 S399 274 452 265 S552 280 599 195' }
  };
  let mode = 'design';
  let raf = 0;
  let started = false;
  function paint() {
    cancelAnimationFrame(raf);
    path.setAttribute('d', modes[mode].path);
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(reduced ? 0 : length);
    if (reduced) { nib.classList.remove('is-visible'); return; }
    const start = performance.now();
    const duration = 1950;
    nib.classList.add('is-visible');
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const dist = length * eased;
      path.style.strokeDashoffset = String(length - dist);
      const point = path.getPointAtLength(dist);
      const prev = path.getPointAtLength(Math.max(0, dist - 2));
      const next = path.getPointAtLength(Math.min(length, dist + 2));
      const angle = Math.atan2(next.y - prev.y, next.x - prev.x) * 180 / Math.PI - 90;
      nib.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
      if (t < 1) raf = requestAnimationFrame(frame);
      else nib.classList.remove('is-visible');
    }
    raf = requestAnimationFrame(frame);
  }
  function select(value, focus) {
    if (!modes[value]) return;
    mode = value;
    scenes.forEach(scene => scene.classList.toggle('is-active', scene.dataset.inkScene === value));
    tabs.forEach(tab => {
      const active = tab.dataset.ink === value;
      tab.classList.toggle('is-current', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    const selectedTab = tabs.find(tab => tab.dataset.ink === value);
    stage.setAttribute('aria-labelledby', selectedTab.id);
    stage.dataset.active = value;
    caption.textContent = modes[value].label;
    status.textContent = modes[value].index;
    paint();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.ink, false));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[next].dataset.ink, true);
    });
  });
  replay?.addEventListener('click', paint);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting) && !started) {
        started = true;
        paint();
        io.disconnect();
      }
    }, { threshold: .15 });
    io.observe(root);
  } else { started = true; paint(); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); nib.classList.remove('is-visible'); } });
})();
