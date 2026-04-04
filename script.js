// 1. ANIMAÇÕES DE ENTRADA (Intersection Observer)
// Envolvemos em DOMContentLoaded para garantir que os elementos existam
document.addEventListener('DOMContentLoaded', () => {


    window.scrollTo(0, 0);

    const sections = document.querySelectorAll("section:not(.hero)");
    
    const observerOptions = {
        threshold: 0.1 // Começa a animar quando 10% da seção aparece
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                // Opcional: parar de observar após animar uma vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(40px)";
        section.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        observer.observe(section);
    });

    // 2. MENU MOBILE (O CORAÇÃO DO PROBLEMA)
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.nav'); // Use a classe .nav para bater com seu CSS

    if (hamburger && nav) {
        // Toggle Menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o clique propague para o document
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Trava o scroll do corpo quando o menu está aberto
            document.body.classList.toggle('menu-open');
        });

        // Fecha ao clicar nos links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Fecha ao clicar fora (no fundo escuro)
        document.addEventListener('click', e => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 3. FORMULÁRIO DE CONTATO
    const form = document.getElementById('contactForm');
    const successCard = document.getElementById('successCard');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            if (!nome || !mensagem) {
                alert("Por favor, preencha nome e mensagem.");
                return;
            }

            // Formatação para WhatsApp
            const texto = `*Nova mensagem do site Sites Rápidos*%0A%0A` +
                          `*Nome:* ${nome}%0A` +
                          `*Email:* ${email}%0A%0A` +
                          `*Mensagem:*%0A${mensagem}`;

            // Abre o WhatsApp
            window.open(`https://wa.me/5541996092712?text=${texto}`, '_blank');

            // Feedback Visual
            form.style.display = 'none';
            if (successCard) successCard.style.display = 'block';

            // Reseta após 7 segundos
            setTimeout(() => {
                form.reset();
                form.style.display = 'flex';
                if (successCard) successCard.style.display = 'none';
            }, 7000);
        });
    }
});
