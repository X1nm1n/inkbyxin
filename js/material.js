/* XIN / Material Atelier: small scroll-led depth effects; all visual content works without JS. */
(() => {
  'use strict';
  const canvas=document.getElementById('artCanvas');
  if(!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let raf=0;
  const update=()=>{
    raf=0;
    const rect=canvas.getBoundingClientRect();
    if(rect.bottom<0 || rect.top>innerHeight)return;
    const progress=Math.max(-1,Math.min(1,(innerHeight*.48-(rect.top+rect.height*.5))/innerHeight));
    canvas.style.setProperty('--desk-scroll',progress.toFixed(3));
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(update);};
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request,{passive:true});
  request();
})();
