// script.js - 100% completo

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Reveal animation com Intersection Observer
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    reveals.forEach(el => observer.observe(el));
}

// Formulário de contato (simulação com feedback premium)
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Feedback visual premium
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.style.transition = 'all 0.4s ease';
            btn.innerHTML = `<i class="fa-solid fa-check"></i> Enviado com sucesso!`;
            btn.style.background = '#10b981';
            
            // Simula envio
            setTimeout(() => {
                alert('✅ Mensagem enviada com sucesso!\n\nNossa equipe entrará em contato em até 5 minutos via WhatsApp. Obrigado por escolher OdontoAura ❤️');
                form.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1800);
        });
    }
}

// Fechar menu mobile ao clicar em link (melhoria UX)
function closeMobileOnLinkClick() {
    const links = document.querySelectorAll('#mobileMenu a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu');
            if (menu.style.display === 'flex') {
                menu.style.display = 'none';
            }
        });
    });
}

// Inicialização completa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 OdontoAura carregado com design premium!', 'color:#14b8a6; font-size:13px; font-weight:600');
    
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);
    
    initScrollAnimations();
    initContactForm();
    closeMobileOnLinkClick();
    
    // Console easter-egg
    console.log('%cSite premium com animações suaves, hovers refinados e visual luxury desenvolvido especialmente para você!', 'color:#0f766e; font-family:monospace');
});