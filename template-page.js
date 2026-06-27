/* template-page.js — Refinamento Premium v2.0 (defer) */
(function(){
'use strict';
document.documentElement.classList.add('js-ready');
var reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

// Detect niche
var nm={academia:{l:'Academia'},advocacia:{l:'Advocacia'},barbearia:{l:'Barbearia'},
imobiliaria:{l:'Imobiliária'},odontologia:{l:'Odontologia'},restaurante:{l:'Restaurante'}};
var p=location.pathname,nk=null;
for(var k in nm){if(p.indexOf(k)!==-1){nk=k;break;}}
var wb=document.getElementById('btn-whatsapp');
if(!nk&&wb)nk=wb.dataset.niche||null;

// WhatsApp URL
if(wb){
  var lab=(nm[nk]||{l:'este modelo'}).l;
  var msg=encodeURIComponent('Olá! Acabei de conhecer o modelo '+lab+' no Sites Rápidos e gostaria de solicitar um orçamento para um site parecido.');
  wb.href='https://wa.me/5541996092712?text='+msg;
  wb.target='_blank';wb.rel='noopener noreferrer';
  wb.setAttribute('aria-label','Solicitar orçamento pelo WhatsApp para o modelo '+lab);
}

// Hero entrance
if(!reduced){
  var h=['.tp-hero-badge','.tp-hero-title','.tp-hero-subtitle','.tp-hero-buttons'];
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    h.forEach(function(s){var e=document.querySelector(s);if(e)e.classList.add('tp-in');});
  });});
}else{
  document.querySelectorAll('.tp-hero-badge,.tp-hero-title,.tp-hero-subtitle,.tp-hero-buttons')
    .forEach(function(e){e.classList.add('tp-in');});
}

// Section reveal via IO
if('IntersectionObserver'in window&&!reduced){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){
    if(en.isIntersecting&&!en.target.dataset.revealed){
      en.target.classList.add('tp-in');en.target.dataset.revealed='1';io.unobserve(en.target);
    }
  });},{threshold:0.15,rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('.tp-reveal').forEach(function(e){io.observe(e);});
}else{
  document.querySelectorAll('.tp-reveal').forEach(function(e){e.classList.add('tp-in');e.dataset.revealed='1';});
}
})();
