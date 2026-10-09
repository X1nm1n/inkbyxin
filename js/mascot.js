(() => {
  'use strict';
  const stage = document.getElementById('storyMascotStage');
  const mascot = document.getElementById('storyMascot');
  const trigger = document.getElementById('mascotTrigger');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!stage || !mascot) return;

  const restartDraw = () => {
    stage.querySelectorAll('.mascot-stroke-path').forEach(path => {
      path.style.animation = 'none';
      path.getBoundingClientRect();
      path.style.animation = '';
    });
  };

  const playTrick = () => {
    stage.classList.remove('is-trick');
    void stage.offsetWidth;
    stage.classList.add('is-trick');
    restartDraw();
    clearTimeout(playTrick._timer);
    playTrick._timer = setTimeout(() => stage.classList.remove('is-trick'), 1000);
  };

  const startSequence = () => {
    if (stage.dataset.started === '1') return;
    stage.dataset.started = '1';
    stage.classList.add('is-animate');
    if (!reduced) {
      setTimeout(playTrick, 1900);
      stage._interval = setInterval(playTrick, 9000);
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startSequence();
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(stage);
  } else {
    startSequence();
  }

  trigger?.addEventListener('click', playTrick);
  stage.addEventListener('click', event => {
    if (event.target.closest('.mascot-trigger')) return;
    if (reduced) return;
    playTrick();
  });
  stage.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!reduced) playTrick();
    }
  });

  if (finePointer && !reduced) {
    let frame = 0, nx = 0, ny = 0, lx = 70, ly = 25;
    const update = () => {
      frame = 0;
      stage.style.setProperty('--mascot-light-x', lx + '%');
      stage.style.setProperty('--mascot-light-y', ly + '%');
    };
    stage.addEventListener('pointermove', event => {
      const rect = stage.getBoundingClientRect();
      nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      lx = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      ly = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      nx = 0; ny = 0; lx = 70; ly = 25;
      if (!frame) frame = requestAnimationFrame(update);
    });
  }
})();
