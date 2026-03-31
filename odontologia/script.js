// --- 1. CONTROLE DO MENU MOBILE ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    const body = document.body;

    // Alterna a classe 'active' que controla a animação no CSS
    const isOpening = !menu.classList.contains('active');

    if (isOpening) {
        menu.classList.add('active');
        // Troca ícone para fechar (X) - Requer FontAwesome ou similar
        if (menuBtnIcon) menuBtnIcon.classList.replace('fa-bars', 'fa-xmark');
        // Trava o scroll do site ao fundo para melhor UX
        body.style.overflow = 'hidden';
    } else {
        closeMenu(menu, menuBtnIcon, body);
    }
}

function closeMenu(menu, icon, body) {
    menu.classList.remove('active');
    if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
    body.style.overflow = 'auto';
}

// Fechar menu automaticamente ao clicar em qualquer link (Âncoras)
function initMobileMenuLogic() {
    const menu = document.getElementById('mobileMenu');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('active')) {
                closeMenu(menu, menuBtnIcon, document.body);
            }
        });
    });
}


// --- 2. EFEITOS DE SCROLL (NAVBAR) ---
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    // Adiciona sombra e cor sólida após 50px de scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}


// --- 3. ANIMAÇÕES DE REVELAÇÃO (INTERSECTION OBSERVER) ---
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Para de observar após animar uma vez para performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}


// --- 4. FORMULÁRIO DE CONTATO ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Feedback visual imediato
            btn.disabled = true;
            btn.style.opacity = '0.8';
            btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...`;
            
            // Simulação de processamento premium
            setTimeout(() => {
                btn.innerHTML = `<i class="fa-solid fa-check"></i> Enviado com sucesso!`;
                btn.style.background = '#10b981';
                btn.style.opacity = '1';
                
                alert('✅ Mensagem recebida!\n\nNossa equipe OdontoAura entrará em contato via WhatsApp em instantes.');
                
                form.reset();
                
                // Restaura o botão após 3 segundos
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
}


// --- 5. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Configurações Iniciais
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    initMobileMenuLogic();
    initScrollAnimations();
    initContactForm();

    // Log de Performance/Debug
    console.log('%c🚀 OdontoAura: Sistema de responsividade e animações ativo.', 'color:#14b8a6; font-weight:bold;');
});
