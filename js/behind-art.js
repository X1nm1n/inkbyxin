(() => {
  'use strict';
  const stage = document.getElementById('behindStage');
  const range = document.getElementById('behindRange');
  if (!stage || !range) return;
  const buttons = [...document.querySelectorAll('.behind-step')];
  const meta = document.getElementById('behindMetaLabel');
  const caption = document.getElementById('behindStageCaption');
  const play = document.getElementById('behindPlay');
  const layers = {
    photo: stage.querySelector('.behind-layer-photo'),
    build: stage.querySelector('.behind-layer-build'),
    final: stage.querySelector('.behind-layer-final')
  };
  const states = [
    {label:'01 / FOTO ORIGINALE', caption:'FOTO ORIGINALE'},
    {label:'02 / COSTRUZIONE', caption:'COSTRUZIONE'},
    {label:'03 / VETTORIALE FINALE', caption:'VETTORIALE FINALE'}
  ];
  let raf = 0;
  let playing = false;

  function lerp(a,b,t){ return a + (b-a)*t; }

  function updateUI(value){
    const t = Math.max(0, Math.min(100, Number(value)));
    range.value = String(t);
    let stepIndex = 0;
    let pPhoto = 1, pBuild = 0, pFinal = 0;
    if (t <= 50) {
      const local = t / 50;
      pPhoto = 1 - local;
      pBuild = local;
      pFinal = 0;
      stepIndex = t < 25 ? 0 : 1;
    } else {
      const local = (t - 50) / 50;
      pPhoto = 0;
      pBuild = 1 - local;
      pFinal = local;
      stepIndex = t < 75 ? 1 : 2;
    }
    layers.photo.style.opacity = pPhoto.toFixed(3);
    layers.build.style.opacity = pBuild.toFixed(3);
    layers.final.style.opacity = pFinal.toFixed(3);
    stage.dataset.step = String(stepIndex);
    meta && (meta.textContent = states[stepIndex].label);
    caption && (caption.textContent = states[stepIndex].caption);
    buttons.forEach((btn, idx) => {
      const active = idx === stepIndex;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function animateTo(target){
    cancelAnimationFrame(raf);
    const start = Number(range.value);
    const delta = target - start;
    const duration = 520;
    const startTime = performance.now();
    function tick(now){
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      updateUI(lerp(start, target, eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  buttons.forEach(btn => btn.addEventListener('click', () => animateTo(Number(btn.dataset.progress || 0))));
  range.addEventListener('input', () => { cancelAnimationFrame(raf); updateUI(range.value); });

  play?.addEventListener('click', () => {
    if (playing) {
      playing = false;
      play.textContent = '▶ Riproduci';
      cancelAnimationFrame(raf);
      return;
    }
    playing = true;
    play.textContent = '❚❚ Ferma';
    const duration = 2600;
    const start = performance.now();
    function loop(now){
      if (!playing) return;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 2.2);
      updateUI(eased * 100);
      if (p < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        playing = false;
        play.textContent = '↻ Rivedi';
      }
    }
    raf = requestAnimationFrame(loop);
  });

  updateUI(0);
})();
