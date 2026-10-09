/* Opening sketch: shown once per browser tab, forced replay with ?intro=1. */
(() => {
  'use strict';
  const intro = document.getElementById('xinIntro');
  const html = document.documentElement;
  if (!intro || !html.classList.contains('xin-intro-enabled')) return;
  intro.setAttribute('aria-hidden', 'false');
  const priorFocus = document.activeElement;
  const skip = document.getElementById('skipIntro');
  let done = false;
  let timer = null;
  let removeTimer = null;
  try { sessionStorage.setItem('xin-intro-seen', '1'); } catch (e) {}
  const finish = () => {
    if (done) return;
    done = true;
    if (timer) window.clearTimeout(timer);
    intro.classList.add('is-leaving');
    removeTimer = window.setTimeout(() => {
      intro.remove();
      html.classList.remove('xin-intro-enabled');
      html.classList.add('xin-intro-finished');
      if (priorFocus && typeof priorFocus.focus === 'function' && priorFocus !== document.body) priorFocus.focus({ preventScroll: true });
    }, 560);
  };
  skip?.addEventListener('click', finish);
  intro.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); finish();
    }
  });
  // Even if the font doesn't load, the overlay always disappears.
  timer = window.setTimeout(finish, 2890);
  try { skip?.focus({ preventScroll: true }); } catch (e) {}
  window.addEventListener('pagehide', () => { if (timer) clearTimeout(timer); if (removeTimer) clearTimeout(removeTimer); }, { once: true });
})();
