window.scrollTo(0,0)

const sections = document.querySelectorAll("section:not(.hero)")

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.style.opacity = "1"
entry.target.style.transform = "translateY(0)"

}

})

})

sections.forEach(section => {

section.style.opacity = "0"
section.style.transform = "translateY(40px)"
section.style.transition = "all 0.7s ease"

observer.observe(section)

})


/* MENU MOBILE */

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (!hamburger || !nav) {
      console.error('Hamburger ou nav não encontrado no HTML');
      return;
    }

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Fecha ao clicar em link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    // Fecha ao clicar fora (muito útil)
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  });
