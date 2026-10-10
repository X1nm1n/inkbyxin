/* XIN / Portrait Lab — ten exact source-image regions; alpha-aware pointer picking. */
(() => {
  'use strict';
  const stage = document.getElementById('portraitStage');
  if (!stage) return;
  const pieces = [...stage.querySelectorAll('.portrait-piece')];
  const mix = document.getElementById('portraitMix');
  const reset = document.getElementById('portraitReset');
  const indicator = document.getElementById('portraitPieceIndicator');
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const sourceMasks = new Map();
  const W=2818,H=3488;
  let active=null;

  function say(value){if(indicator) indicator.textContent=value;}
  function apply(piece,x=0,y=0,angle=0){
    piece.dataset.x=String(x);piece.dataset.y=String(y);piece.dataset.angle=String(angle);
    piece.style.setProperty('--tx',x+'px');piece.style.setProperty('--ty',y+'px');piece.style.setProperty('--rot',angle+'deg');
  }
  function resetAll(){pieces.forEach(p=>apply(p));say('10 ELEMENTI · TUTTO AL SUO POSTO');}
  function mixAll(){
    const r=stage.getBoundingClientRect();
    const small=['brow-left','brow-right','eye-left','eye-right','nose','mouth'];
    pieces.forEach(p=>{
      const s=small.includes(p.dataset.piece);
      const max=r.width*(s?.17:.10);
      apply(p,(Math.random()*2-1)*max,(Math.random()*2-1)*max*.8,(Math.random()*2-1)*(s?11:5));
    });
    say('SCOMPOSTO · ORA TOCCA A TE');
  }
  // A shape can have a wide, transparent bounding box (the hat, for example).
  // Load the *visible* alpha silhouette so it cannot steal touches from the eyes.
  pieces.forEach(p=>{
    const img=p.querySelector('img');
    function cacheMask(){
      if(!img.naturalWidth)return;
      const factor=Math.min(1,260/Math.max(img.naturalWidth,img.naturalHeight));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(img.naturalWidth*factor));
      canvas.height=Math.max(1,Math.round(img.naturalHeight*factor));
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      if(!ctx)return;
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      sourceMasks.set(p,{w:canvas.width,h:canvas.height,alpha:data});
    }
    if(img.complete)cacheMask(); else img.addEventListener('load',cacheMask,{once:true});
    p.addEventListener('keydown',e=>{
      const unit=e.shiftKey?22:8;
      const d={ArrowLeft:[-unit,0],ArrowRight:[unit,0],ArrowUp:[0,-unit],ArrowDown:[0,unit]}[e.key];
      if(!d)return;
      e.preventDefault();
      const limit=stage.clientWidth*.4;
      apply(p,clamp(Number(p.dataset.x||0)+d[0],-limit,limit),clamp(Number(p.dataset.y||0)+d[1],-limit,limit),0);
      say(p.dataset.pieceLabel.toUpperCase()+' · SPOSTATO');
    });
  });

  // Keep small facial features selectable before the larger face/cap regions.
  const ordered=[...pieces].sort((a,b)=>{
    const A=parseFloat(a.style.getPropertyValue('--width'))*parseFloat(a.style.getPropertyValue('--height'));
    const B=parseFloat(b.style.getPropertyValue('--width'))*parseFloat(b.style.getPropertyValue('--height'));
    return A-B;
  });
  function pick(clientX,clientY){
    const r=stage.getBoundingClientRect();
    const px=clientX-r.left, py=clientY-r.top;
    for(const p of ordered){
      const sx=parseFloat(p.style.getPropertyValue('--left'))*r.width/100;
      const sy=parseFloat(p.style.getPropertyValue('--top'))*r.height/100;
      const sw=parseFloat(p.style.getPropertyValue('--width'))*r.width/100;
      const sh=parseFloat(p.style.getPropertyValue('--height'))*r.height/100;
      const a=Number(p.dataset.angle||0)*Math.PI/180;
      const cx=sx+Number(p.dataset.x||0)+sw/2;
      const cy=sy+Number(p.dataset.y||0)+sh/2;
      const dx=px-cx,dy=py-cy;
      const lx=dx*Math.cos(a)+dy*Math.sin(a)+sw/2;
      const ly=-dx*Math.sin(a)+dy*Math.cos(a)+sh/2;
      if(lx<0||ly<0||lx>=sw||ly>=sh)continue;
      const mask=sourceMasks.get(p);
      if(!mask)return p;
      const mx=clamp(Math.floor(lx/sw*mask.w),0,mask.w-1);
      const my=clamp(Math.floor(ly/sh*mask.h),0,mask.h-1);
      if(mask.alpha[(my*mask.w+mx)*4+3]>70)return p;
    }
    return null;
  }
  stage.addEventListener('pointerdown',e=>{
    if(e.button!==0&&e.pointerType==='mouse')return;
    const p=pick(e.clientX,e.clientY);
    if(!p)return;
    active={id:e.pointerId,piece:p,clientX:e.clientX,clientY:e.clientY,x:Number(p.dataset.x||0),y:Number(p.dataset.y||0)};
    p.classList.add('is-dragging');
    stage.setPointerCapture(e.pointerId);
    say('STAI SPOSTANDO · '+p.dataset.pieceLabel.toUpperCase());
    e.preventDefault();
  },true);
  stage.addEventListener('pointermove',e=>{
    if(!active||active.id!==e.pointerId)return;
    const limit=stage.clientWidth*.42;
    const x=clamp(active.x+e.clientX-active.clientX,-limit,limit);
    const y=clamp(active.y+e.clientY-active.clientY,-limit,limit);
    apply(active.piece,x,y,Number(active.piece.dataset.angle||0));
  });
  function stopDrag(e){
    if(!active||active.id!==e.pointerId)return;
    active.piece.classList.remove('is-dragging');
    if(Math.hypot(Number(active.piece.dataset.x||0),Number(active.piece.dataset.y||0))<12)apply(active.piece);
    say(active.piece.dataset.pieceLabel.toUpperCase()+' · PREMI RICOMPONI PER RIPRISTINARE');
    active=null;
  }
  stage.addEventListener('pointerup',stopDrag);
  stage.addEventListener('pointercancel',stopDrag);
  mix?.addEventListener('click',mixAll);
  reset?.addEventListener('click',resetAll);
  resetAll();
})();
