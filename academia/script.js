// ====================== ANIMAÇÕES SUAVES NO SCROLL ======================
const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -60px 0px"
};

const revealOnScroll = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target); // uma única vez
    }
  });
};

const scrollObserver = new IntersectionObserver(revealOnScroll, observerOptions);

// Seleciona todos os elementos com animação
document.querySelectorAll('.reveal').forEach(el => {
  scrollObserver.observe(el);
});

// ====================== NAV SCROLL ======================
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 80);
  }
});

// ====================== CONTADORES ANIMADOS ======================
const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {
  const target = parseInt(counter.getAttribute("data-target"));
  let count = 0;
  const duration = 1400;
  const increment = target / (duration / 16);

  const updateCounter = () => {
    count += increment;
    if (count < target) {
      counter.textContent = Math.floor(count);
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target + (target === 100 ? "%" : "+");
    }
  };

  updateCounter();
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));

// ====================== INICIALIZAÇÃO ======================
window.addEventListener("load", () => {
  // Força animação da hero caso esteja no topo
  setTimeout(() => {
    document.querySelector('.hero .reveal').classList.add('active');
  }, 300);
});

const menu = document.querySelector('#mobile-menu');
  const menuLinks = document.querySelector('.nav-menu');

  // Abre/Fecha menu ao clicar no hamburguer
  menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
  });

  // Fecha o menu ao clicar em qualquer link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-active');
      menuLinks.classList.remove('active');
    });
  });