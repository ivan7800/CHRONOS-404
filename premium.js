/* Visual enhancements only: core Chronos controls remain owned by existing modules. */
(()=>{'use strict';
 const allowed=new Set(['obsidian','papyrus','midnight']);
 const select=document.getElementById('themeSelect');
 if(!select)return;
 let initial='obsidian';try{const saved=localStorage.getItem('chronos404-theme');if(allowed.has(saved))initial=saved;}catch(_e){}
 function apply(theme){if(!allowed.has(theme))return;document.body.dataset.theme=theme;select.value=theme;}
 apply(initial);
 select.addEventListener('change',()=>{apply(select.value);try{localStorage.setItem('chronos404-theme',select.value);}catch(_e){}});
 const links=[...document.querySelectorAll('.section-nav a')];
 function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;const progress=document.getElementById('scrollProgress');if(progress)progress.style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+'%';}
 let scheduled=false;window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;updateProgress();});},{passive:true});window.addEventListener('resize',updateProgress,{passive:true});updateProgress();
 if('IntersectionObserver'in window){const targets=links.map(link=>document.getElementById(link.hash.slice(1))).filter(Boolean);const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){links.forEach(link=>{const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}},{rootMargin:'-18% 0px -68% 0px'});targets.forEach(target=>observer.observe(target));}
})();
