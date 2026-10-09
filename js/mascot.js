(() => {
  'use strict';
  const stage = document.getElementById('storyMascotStage');
  const trigger = document.getElementById('mascotTrigger');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!stage) return;

  const restartStroke = () => {
    stage.querySelectorAll('.mascot-stroke-path').forEach(path => {
      path.style.animation = 'none';
      path.getBoundingClientRect();
      path.style.animation = '';
    });
  };

  const restartFootprints = () => {
    stage.querySelectorAll('.mascot-footprints span').forEach(item => {
      item.style.animation = 'none';
      item.getBoundingClientRect();
      item.style.animation = '';
    });
  };

  const clearTimers = () => {
    clearTimeout(stage._drawTimer);
    clearTimeout(stage._cleanupTimer);
  };

  const playSequence = () => {
    clearTimers();
    stage.classList.remove('is-animate', 'is-draw');
    void stage.offsetWidth;
    restartStroke();
    restartFootprints();
    stage.classList.add('is-animate');
    if (!reduced) {
      stage._drawTimer = setTimeout(() => stage.classList.add('is-draw'), 1680);
    } else {
      stage.classList.add('is-draw');
    }
  };

  const startOnce = () => {
    if (stage.dataset.started === '1') return;
    stage.dataset.started = '1';
    playSequence();
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startOnce();
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(stage);
  } else {
    startOnce();
  }

  trigger?.addEventListener('click', playSequence);
  stage.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      playSequence();
    }
  });
})();
