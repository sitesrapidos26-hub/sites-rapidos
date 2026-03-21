// Scroll suave
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Menu mobile
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  nav.classList.toggle('active');
  toggle.classList.toggle('active'); // pode estilizar o X se quiser
});

// Header ao scroll
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60);
});

// Fade-up observer
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      // observer.unobserve(entry.target); // opcional: observar só uma vez
    }
  });
}, { threshold: 0.12 });

fadeElements.forEach(el => observer.observe(el));