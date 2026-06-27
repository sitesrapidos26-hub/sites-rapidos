/* demo-entry-animation.js — Premium Demo Entry v1.0 (defer) */
(function(){
'use strict';
var H='de-hidden',V='de-visible',R='de-reveal',PH='de-hero-el';
var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var doc=document,body=doc.body;

var hs=['.hero h1','.hero h2','.hero-title','.hero-content h1','.hero-content h2',
'.hero p','.hero-subtitle','.hero-content p','.hero .btn','.hero .btn-primary',
'.hero a.btn','.hero-content a','.hero img','.hero-badge','.hero-img',
'.hero-text','.hero-actions','.hero-cta'];

var rs=['section','article','.section','.features','.card-section',
'[class*="about"]','[class*="services"]','[class*="gallery"]',
'[class*="testimonial"]','[class*="contact"]','[class*="menu"]'];

function markHero(){
  hs.forEach(function(s){
    doc.querySelectorAll(s).forEach(function(e){
      if(!e.closest('header')&&!e.dataset.dm){
        e.dataset.dm='1';e.classList.add(PH);
        if(!rm)e.classList.add(H);
      }
    });
  });
}

function markReveal(){
  rs.forEach(function(s){
    doc.querySelectorAll(s).forEach(function(e){
      if(!e.closest('.hero')&&!e.closest('#home')&&!e.dataset.dr){
        e.dataset.dr='1';e.classList.add(R);
        if(!rm)e.classList.add(H);
      }
    });
  });
}

function animateHero(){
  var els=doc.querySelectorAll('.'+PH+'.'+H);
  Array.prototype.forEach.call(els,function(e,i){
    setTimeout(function(){e.classList.remove(H);e.classList.add(V);},Math.min(i,2)*60);
  });
}

function initIO(){
  if(!('IntersectionObserver'in window)){
    doc.querySelectorAll('.'+R+'.'+H).forEach(function(e){e.classList.remove(H);e.classList.add(V);});
    return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(en.isIntersecting&&!en.target.dataset.di){
        en.target.dataset.di='1';en.target.classList.remove(H);en.target.classList.add(V);io.unobserve(en.target);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -5% 0px'});
  doc.querySelectorAll('.'+R+'.'+H).forEach(function(e){io.observe(e);});
}

function run(){
  markHero();markReveal();
  if(rm){
    doc.querySelectorAll('.'+PH+',.'+R).forEach(function(e){e.classList.remove(H);e.classList.add(V);});
    return;
  }
  body.classList.add('de-page-ready');
  requestAnimationFrame(function(){requestAnimationFrame(function(){animateHero();initIO();});});
}

if(doc.readyState==='loading'){doc.addEventListener('DOMContentLoaded',run);}else{run();}

doc.addEventListener('click',function(ev){
  var a=ev.target.closest('a[href]');
  if(!a||rm)return;
  var h=a.getAttribute('href')||'';
  if(h.startsWith('#')||h===''||a.target==='_blank')return;
  ev.preventDefault();
  body.style.transition='opacity .2s ease';body.style.opacity='0';
  setTimeout(function(){window.location.href=h;},210);
},false);
})();
