/* XIN / Articulated mascot. Walk cycles animate individual legs, shins & arms. */
(() => {
  'use strict';
  const stage = document.getElementById('storyMascotStage');
  const scene = document.getElementById('xinMascotScene');
  const actor = document.getElementById('xinMascotActor');
  const replay = document.getElementById('mascotTrigger');
  const ink = stage?.querySelector('.xin-drawn-art');
  if (!stage || !scene || !actor || !ink) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let generation = 0, activeAnimation = null, hasPlayed = false;
  const phases = ['is-running','is-flipping','is-drawing','is-idle'];
  const pause = (ms, gen) => new Promise(resolve => {
    const id = window.setTimeout(() => resolve(gen === generation), ms);
  });
  const setPhase = name => {
    actor.classList.remove(...phases);
    if (name) actor.classList.add(name);
  };
  const reset = () => {
    activeAnimation?.cancel();
    activeAnimation = null;
    actor.classList.remove(...phases);
    stage.classList.remove('is-landing','is-drawing');
    ink.classList.remove('is-drawing');
    for (const path of ink.querySelectorAll('path')) {
      path.style.animation = 'none';
      path.getBoundingClientRect();
      path.style.animation = '';
    }
  };
  const move = async (frames, options, gen) => {
    if (gen !== generation) return false;
    const animation = actor.animate(frames, { ...options, fill:'forwards' });
    activeAnimation = animation;
    try { await animation.finished; }
    catch { return false; }
    return gen === generation;
  };
  async function runSequence() {
    const gen = ++generation;
    reset();
    if (reducedMotion.matches) {
      actor.style.transform = `translate3d(${Math.max(0, Math.min(Math.round(scene.clientWidth*.48), scene.clientWidth - actor.getBoundingClientRect().width - 16))}px,0,0)`;
      setPhase('is-idle');
      for (const path of ink.querySelectorAll('path')) path.style.strokeDashoffset = '0';
      return;
    }
    const vw = scene.clientWidth;
    const spriteW = actor.getBoundingClientRect().width || 190;
    const startX = -spriteW-18;
    // Leave enough room for the stroke and keep the mascot visible on narrow phones.
    const endX = Math.min(vw - spriteW - 15 - 45, vw*.44);
    actor.style.transform = `translate3d(${startX}px,0,0)`;
    setPhase('is-running');
    if (!await move([
      {transform:`translate3d(${startX}px,0,0)`,offset:0},
      {transform:`translate3d(${startX+(endX-startX)*.70}px,0,0)`,offset:.70},
      {transform:`translate3d(${endX}px,0,0)`,offset:1}
    ],{duration:1900,easing:'cubic-bezier(.35,.35,.27,1)'},gen)) return;
    actor.style.transform = `translate3d(${endX}px,0,0)`;
    setPhase('is-flipping');
    // The physical jump includes lift, rotation and a distinct landing trajectory.
    if (!await move([
      {transform:`translate3d(${endX}px,0,0) rotate(0deg) scale(1)`,offset:0},
      {transform:`translate3d(${endX+14}px,-34px,0) rotate(-85deg) scale(.95)`,offset:.25},
      {transform:`translate3d(${endX+30}px,-70px,0) rotate(-185deg) scale(.93)`,offset:.52},
      {transform:`translate3d(${endX+44}px,-28px,0) rotate(-290deg) scale(1.01)`,offset:.80},
      {transform:`translate3d(${endX+45}px,0,0) rotate(-360deg) scale(1)`,offset:1}
    ],{duration:920,easing:'cubic-bezier(.31,.65,.3,1)'},gen)) return;
    actor.style.transform = `translate3d(${endX+45}px,0,0)`;
    stage.classList.add('is-landing');
    setPhase('is-drawing');
    if (!await pause(260,gen)) return;
    stage.classList.add('is-drawing');
    ink.classList.add('is-drawing');
    // Forearm with pen scribbles as each ink stroke appears.
    if (!await pause(1830,gen)) return;
    setPhase('is-idle');
    replay?.removeAttribute('disabled');
  }
  replay?.addEventListener('click', () => runSequence());
  const startOnce = () => { if (!hasPlayed) {hasPlayed=true;runSequence();} };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(item=>item.isIntersecting)) {
        startOnce();observer.disconnect();
      }
    },{threshold:.2});
    observer.observe(stage);
  } else startOnce();
  reducedMotion.addEventListener?.('change', () => { if (hasPlayed) runSequence(); });
})();
