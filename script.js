// Animações de entrada (do original)
window.scrollTo(0, 0);

const sections = document.querySelectorAll("section:not(.hero)");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
});

sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "all 0.8s ease";
    observer.observe(section);
});

// Menu mobile
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    document.addEventListener('click', e => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
});

// Formulário com card de sucesso + envio via WhatsApp
const form = document.getElementById('contactForm');
const successCard = document.getElementById('successCard');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !mensagem) return;

    const texto = `*Nova mensagem do site Sites Rápidos*%0A%0A` +
                  `*Nome:* ${nome}%0A` +
                  `*Email:* ${email}%0A%0A` +
                  `*Mensagem:*%0A${mensagem}`;

    window.open(`https://wa.me/5519999322908?text=${texto}`, '_blank');

    form.style.display = 'none';
    successCard.style.display = 'block';

    setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        successCard.style.display = 'none';
    }, 7000);
});
