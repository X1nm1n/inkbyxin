/* XIN / shared interactions for the study archive */
(() => { 'use strict';
 const $=s=>document.querySelector(s);
 const toggle=$('#themeToggle');
 toggle?.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('xin-theme',theme)}catch(e){} });
 const nav=$('#mainNav'),menu=$('#menuToggle');
 menu?.addEventListener('click',()=>{const opened=nav.classList.toggle('is-open');menu.classList.toggle('is-open',opened);menu.setAttribute('aria-expanded',String(opened))});
 document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}));
 const year=$('#year');if(year)year.textContent=String(new Date().getFullYear());
})();
