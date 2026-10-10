(() => {
  'use strict';
  const stage = document.getElementById('behindStage');
  const video = document.getElementById('behindVideo');
  const range = document.getElementById('behindRange');
  const play = document.getElementById('behindPlay');
  const restart = document.getElementById('behindRestart');
  const caption = document.getElementById('behindStageCaption');
  const meta = document.getElementById('behindMetaLabel');
  const buttons = [...document.querySelectorAll('.behind-step')];
  if (!stage || !video || !range) return;

  const cues = [
    { time: 0, label: '01 / FOTO ORIGINALE', caption: 'FOTO ORIGINALE' },
    { time: 3.1, label: '02 / DISEGNO', caption: 'DISEGNO E STRUTTURA' },
    { time: 6.1, label: '03 / COLORI', caption: 'COLORI E VOLUMI' },
    { time: 9.2, label: '04 / FINALE', caption: 'LAVORO FINALE' }
  ];

  function nearestCueIndex(time) {
    let active = 0;
    for (let i = 0; i < cues.length; i += 1) {
      if (time >= cues[i].time) active = i;
    }
    return active;
  }

  function updateStep(index) {
    const cue = cues[index] || cues[0];
    stage.dataset.step = String(index);
    if (caption) caption.textContent = cue.caption;
    if (meta) meta.textContent = cue.label;
    buttons.forEach((btn, idx) => {
      const on = idx === index;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function updateProgress() {
    const dur = video.duration || 1;
    const pct = (video.currentTime / dur) * 100;
    range.value = String(pct);
    updateStep(nearestCueIndex(video.currentTime));
    play.textContent = video.paused ? '▶ Riproduci' : '❚❚ Pausa';
  }

  function seekTo(seconds, autoplay = true) {
    video.currentTime = seconds;
    updateProgress();
    if (autoplay) {
      video.play().catch(() => {});
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      seekTo(Number(btn.dataset.time || 0), true);
    });
  });

  play?.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  restart?.addEventListener('click', () => {
    seekTo(0, true);
  });

  range.addEventListener('input', () => {
    const dur = video.duration || 1;
    const t = (Number(range.value) / 100) * dur;
    video.currentTime = t;
    updateProgress();
  });

  video.addEventListener('loadedmetadata', updateProgress);
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('play', updateProgress);
  video.addEventListener('pause', updateProgress);
  video.addEventListener('ended', () => {
    updateProgress();
    play.textContent = '↻ Rivedi';
  });

  updateStep(0);
})();
