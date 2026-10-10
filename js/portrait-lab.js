(() => {
  'use strict';
  const stage = document.getElementById('portraitStage');
  if (!stage) return;
  const pieces = [...stage.querySelectorAll('.portrait-piece')];
  const mix = document.getElementById('portraitMix');
  const reset = document.getElementById('portraitReset');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  function setPieceState(piece, x = 0, y = 0, rot = 0) {
    piece.dataset.tx = String(x);
    piece.dataset.ty = String(y);
    piece.dataset.rot = String(rot);
    piece.style.setProperty('--tx', x + 'px');
    piece.style.setProperty('--ty', y + 'px');
    piece.style.setProperty('--rot', rot + 'deg');
  }

  function resetPieces(animated = false) {
    pieces.forEach(piece => {
      piece.style.transition = animated && !reducedMotion ? 'transform .45s cubic-bezier(.2,.8,.2,1), filter .25s ease' : '';
      setPieceState(piece, 0, 0, 0);
      if (animated && !reducedMotion) {
        setTimeout(() => { piece.style.transition = ''; }, 460);
      }
    });
  }

  function randomizePieces() {
    const rect = stage.getBoundingClientRect();
    pieces.forEach((piece, index) => {
      const maxX = rect.width * (index === pieces.length - 1 ? .12 : .2);
      const maxY = rect.height * (index === pieces.length - 1 ? .08 : .16);
      const x = (Math.random() * 2 - 1) * maxX;
      const y = (Math.random() * 2 - 1) * maxY;
      const rot = (Math.random() * 2 - 1) * 10;
      piece.style.transition = !reducedMotion ? 'transform .45s cubic-bezier(.2,.8,.2,1), filter .25s ease' : '';
      setPieceState(piece, x, y, rot);
      if (!reducedMotion) setTimeout(() => { piece.style.transition = ''; }, 460);
    });
  }

  pieces.forEach(piece => {
    let drag = null;
    piece.addEventListener('pointerdown', event => {
      if (event.button !== 0 && event.pointerType !== 'touch') return;
      const startX = Number(piece.dataset.tx || 0);
      const startY = Number(piece.dataset.ty || 0);
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX, startY };
      piece.setPointerCapture(event.pointerId);
      piece.classList.add('is-dragging');
    });
    piece.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      const maxX = stage.clientWidth * .42;
      const maxY = stage.clientHeight * .42;
      const nx = clamp(drag.startX + dx, -maxX, maxX);
      const ny = clamp(drag.startY + dy, -maxY, maxY);
      piece.style.setProperty('--tx', nx + 'px');
      piece.style.setProperty('--ty', ny + 'px');
      piece.dataset.tx = String(nx);
      piece.dataset.ty = String(ny);
    });
    function endDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      piece.classList.remove('is-dragging');
      const tx = Number(piece.dataset.tx || 0);
      const ty = Number(piece.dataset.ty || 0);
      if (Math.hypot(tx, ty) < 18) {
        setPieceState(piece, 0, 0, Number(piece.dataset.rot || 0));
      }
      drag = null;
    }
    piece.addEventListener('pointerup', endDrag);
    piece.addEventListener('pointercancel', endDrag);
  });

  mix?.addEventListener('click', randomizePieces);
  reset?.addEventListener('click', () => resetPieces(true));

  resetPieces(false);
})();
