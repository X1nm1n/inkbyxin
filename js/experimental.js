/* XIN / Experimental Type Lab. Works entirely on GitHub Pages. */
(() => {
  'use strict';
  const stage = document.getElementById('expStage');
  const remix = document.getElementById('expRemix');
  const divider = document.getElementById('creativeBreak');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!stage) return;
  const pieces = [...stage.querySelectorAll('.exp-piece')];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  let remixed = false;
  function changeComposition() {
    remixed = !remixed;
    stage.classList.toggle('is-remixed', remixed);
    pieces.forEach(piece => {
      piece.style.setProperty('--drag-x','0px');
      piece.style.setProperty('--drag-y','0px');
      piece.dataset.dx = '0';piece.dataset.dy = '0';
    });
    if (!reduced) flash(0.85);
  }
  remix?.addEventListener('click', changeComposition);
  // Draggable art shapes: pointer events support mouse, pen and touch.
  pieces.forEach(piece => {
    let state = null;
    piece.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      state = {pointer: event.pointerId, startX:event.clientX, startY:event.clientY,
        x:Number(piece.dataset.dx || 0), y:Number(piece.dataset.dy || 0), moved:false};
      piece.classList.add('is-dragging');
      piece.setPointerCapture(event.pointerId);
    });
    piece.addEventListener('pointermove', event => {
      if (!state || state.pointer !== event.pointerId) return;
      const dx=event.clientX-state.startX,dy=event.clientY-state.startY;
      if (Math.abs(dx)+Math.abs(dy)>3) state.moved = true;
      const bound=stage.getBoundingClientRect(), b=piece.getBoundingClientRect();
      const x=clamp(state.x+dx,-bound.width*.55,bound.width*.55);
      const y=clamp(state.y+dy,-bound.height*.55,bound.height*.55);
      piece.style.setProperty('--drag-x',x+'px');piece.style.setProperty('--drag-y',y+'px');
      piece.dataset.dx=String(x);piece.dataset.dy=String(y);
    });
    function end(event){ if (!state || event.pointerId !== state.pointer) return; piece.classList.remove('is-dragging');state=null; }
    piece.addEventListener('pointerup',end); piece.addEventListener('pointercancel',end);
    // Keyboard also repositions each graphic by 26px.
    piece.addEventListener('keydown',event=>{
      const steps = {ArrowLeft:[-26,0],ArrowRight:[26,0],ArrowUp:[0,-26],ArrowDown:[0,26]};
      if(!steps[event.key]) return;
      event.preventDefault();
      const [dx,dy]=steps[event.key];
      const x=clamp(Number(piece.dataset.dx||0)+dx,-stage.clientWidth*.55,stage.clientWidth*.55);
      const y=clamp(Number(piece.dataset.dy||0)+dy,-stage.clientHeight*.55,stage.clientHeight*.55);
      piece.dataset.dx=String(x);piece.dataset.dy=String(y);
      piece.style.setProperty('--drag-x',x+'px');piece.style.setProperty('--drag-y',y+'px');
    });
  });
  if (!reduced && pointerFine) {
    let pending=false, nx=0,ny=0,lx=50,ly=50;
    stage.addEventListener('pointermove',event=>{
      const r=stage.getBoundingClientRect();
      nx=clamp((event.clientX-r.left)/r.width*2-1,-1,1);
      ny=clamp((event.clientY-r.top)/r.height*2-1,-1,1);
      lx=clamp((event.clientX-r.left)/r.width*100,0,100);
      ly=clamp((event.clientY-r.top)/r.height*100,0,100);
      if(pending)return;pending=true;
      requestAnimationFrame(()=>{stage.style.setProperty('--move-x',nx.toFixed(3));stage.style.setProperty('--move-y',ny.toFixed(3));stage.style.setProperty('--light-x',lx+'%');stage.style.setProperty('--light-y',ly+'%');pending=false;});
    },{passive:true});
    stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--move-x','0');stage.style.setProperty('--move-y','0');});
  }
  // Ink is ornamental, drawn on a low-DPI bounded canvas with no tracking or network.
  const canvas=document.getElementById('expInk');
  const ctx=canvas?.getContext('2d',{alpha:true});
  let trails=[], last=null, frame=0, painted=0;
  function sizeCanvas(){
    if(!canvas||!ctx)return;
    const r=stage.getBoundingClientRect();
    const ratio=Math.min(1.5,window.devicePixelRatio||1);
    canvas.width=Math.floor(r.width*ratio);canvas.height=Math.floor(r.height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);trails=[];
  }
  function flash(multiplier=1){
    if(!ctx||reduced)return;
    const r=stage.getBoundingClientRect();
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      trails.push({x:r.width/2,y:r.height/2,dx:Math.cos(a)*4*multiplier,dy:Math.sin(a)*4*multiplier,life:1,r:2.8});
    }
    if(!frame)frame=requestAnimationFrame(draw);
  }
  function draw(){
    frame=0;if(!ctx||!canvas)return;
    const r=stage.getBoundingClientRect();
    ctx.clearRect(0,0,r.width,r.height);
    trails=trails.filter(p=>p.life>.03);
    trails.forEach(p=>{
      p.life*=.953;p.x+=p.dx||0;p.y+=p.dy||0;
      ctx.fillStyle=`rgba(23,38,75,${Math.min(.6,p.life*.42)})`;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,2*Math.PI);ctx.fill();
    });
    if(trails.length)frame=requestAnimationFrame(draw);
  }
  if(ctx&&!reduced){
    sizeCanvas();
    const observer=('ResizeObserver' in window)?new ResizeObserver(sizeCanvas):null;
    observer?.observe(stage);
    if(!observer)window.addEventListener('resize',sizeCanvas,{passive:true});
    stage.addEventListener('pointermove',e=>{
      if(e.target.closest('.exp-remix'))return;
      const rect=stage.getBoundingClientRect();
      const x=e.clientX-rect.left,y=e.clientY-rect.top;
      if(!last || Math.hypot(x-last.x,y-last.y)>9){
        trails.push({x,y,life:1,r:e.pointerType==='touch'?2:3.5});
        if(trails.length>75)trails.shift();
        last={x,y};if(!frame)frame=requestAnimationFrame(draw);
      }
    },{passive:true});
    stage.addEventListener('pointerleave',()=>last=null);
  }
  // Vertical narrative motion: scroll moves oversized editorial type, without intercepting navigation.
  if(divider&&!reduced){
    let queued=false;
    const update=()=>{
      queued=false;
      const r=divider.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      const t=clamp((innerHeight-r.top)/(innerHeight+r.height),0,1);
      divider.style.setProperty('--kinetic-shift',(-70+140*t)+'px');
    };
    const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});update();
  }
})();
