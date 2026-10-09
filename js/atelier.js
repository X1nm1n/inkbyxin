/* XIN / immersive creative journey — vanilla JS, pointer-safe and keyboard accessible. */
(() => {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointerFine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const canvas = document.getElementById('artCanvas');
  const shuffle = document.getElementById('shuffleArt');
  if (canvas) {
    // CSS-only art remains fully visible if JS is disabled.
    if (!prefersReduced && pointerFine) {
      let pending = false, nextX = 0, nextY = 0, nextPX = 50, nextPY = 50;
      canvas.addEventListener('pointermove', (event) => {
        const r = canvas.getBoundingClientRect();
        nextX = ((event.clientX - r.left) / r.width - .5) * 2;
        nextY = ((event.clientY - r.top) / r.height - .5) * 2;
        nextPX = (event.clientX - r.left) / r.width * 100;
        nextPY = (event.clientY - r.top) / r.height * 100;
        if (!pending) {
          pending = true;
          requestAnimationFrame(() => {
            canvas.style.setProperty('--mx', nextX.toFixed(3));
            canvas.style.setProperty('--my', nextY.toFixed(3));
            canvas.style.setProperty('--spotx', nextPX.toFixed(1) + '%');
            canvas.style.setProperty('--spoty', nextPY.toFixed(1) + '%');
            pending = false;
          });
        }
      }, {passive:true});
      canvas.addEventListener('pointerleave', () => {
        canvas.style.setProperty('--mx', 0);
        canvas.style.setProperty('--my', 0);
        canvas.style.setProperty('--spotx', '50%');
        canvas.style.setProperty('--spoty', '45%');
      });
    }
    function remix() {canvas.classList.toggle('is-remixed');}
    shuffle?.addEventListener('click', remix);
    canvas.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === canvas) {
        e.preventDefault(); remix();
      }
    });
  }
  const chapterEls = [...document.querySelectorAll('.story-chapter')];
  const sceneEls = [...document.querySelectorAll('.story-scene')];
  const dots = [...document.querySelectorAll('.story-dot')];
  const number = document.getElementById('storyNumber');
  const fill = document.getElementById('storyProgressFill');
  const story = document.getElementById('storyLayout');
  let active = -1;
  function activate(n) {
    if (n === active || n < 0 || n >= chapterEls.length) return;
    active = n;
    chapterEls.forEach((el, i) => el.classList.toggle('is-active', i === n));
    sceneEls.forEach((el, i) => el.classList.toggle('is-active', i === n));
    dots.forEach((dot, i) => { dot.classList.toggle('is-active', i === n); dot.setAttribute('aria-pressed', String(i === n)); });
    if (number) number.textContent = String(n+1).padStart(2, '0') + ' / 03';
    if (fill) fill.style.width = (n+1) * 100 / 3 + '%';
  }
  function visibleChapter() {
    if (!chapterEls.length) return;
    // Find chapter closest to the visual stage center; works on mobile as well.
    const targetY = window.innerHeight * (window.innerWidth <= 930 ? .81 : .52);
    let best = 0, delta = Infinity;
    chapterEls.forEach((ch, i) => {
      const r=ch.getBoundingClientRect();
      const d=Math.abs((r.top + r.bottom) / 2 - targetY);
      if(d < delta) {delta=d;best=i;}
    });
    activate(best);
  }
  let raf = 0;
  function onScroll(){if(raf) return;raf=requestAnimationFrame(()=>{visibleChapter();raf=0;});}
  if(story && chapterEls.length) {
    activate(0);
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
    dots.forEach(dot => dot.addEventListener('click', () => {
      const chapter=chapterEls[Number(dot.dataset.storyGoto)];
      if(chapter) chapter.scrollIntoView({behavior:prefersReduced?'instant':'smooth',block:'center'});
    }));
    onScroll();
  }
  // Dynamic portfolio filters included in editorial journey, same behavior as portfolio toolbar.
  document.querySelectorAll('.story-chapter [data-filter-link]').forEach(a => {
    a.addEventListener('click', () => {
      const filter=a.dataset.filterLink;
      const button=document.querySelector(`.filter[data-filter="${filter}"]`);
      const search=document.getElementById('projectSearch');if(search){search.value='';search.dispatchEvent(new Event('input'));}
      button?.click();
    });
  });
})();
