// --- 1. CONTROLE DO MENU MOBILE ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    const body = document.body;

    const isOpening = !menu.classList.contains('active');

    if (isOpening) {
        menu.classList.add('active');
        if (menuBtnIcon) menuBtnIcon.classList.replace('fa-bars', 'fa-xmark');
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
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// --- 3. ANIMAÇÕES DE REVELAÇÃO ---
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}

// --- 4. SISTEMA DE FEEDBACK (CARD NA TELA) ---
// Função que cria e mostra o card de sucesso sem usar alerts
function showFeedbackCard() {
    // 1. Criar o elemento do card
    const card = document.createElement('div');
    card.id = 'feedbackCard';
    
    // 2. Estilizar o card via JS (ou você pode mover isso para o seu CSS)
    Object.assign(card.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0.7)',
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        zIndex: '9999',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        opacity: '0',
        minWidth: '280px',
        borderTop: '5px solid #10b981'
    });

    // 3. Conteúdo do Card
    card.innerHTML = `
        <div style="font-size: 50px; color: #10b981; margin-bottom: 15px;">
            <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 style="margin-bottom: 10px; color: #1f2937;">Mensagem Enviada!</h3>
        <p style="color: #6b7280; margin-bottom: 20px;">Entraremos em contato via WhatsApp em breve.</p>
        <button id="closeCardBtn" style="background: #10b981; color: white; border: none; padding: 10px 25px; border-radius: 5px; cursor: pointer; font-weight: bold;">Ok, entendi</button>
    `;

    document.body.appendChild(card);

    // 4. Animação de entrada
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // 5. Função para fechar
    const closeBtn = card.querySelector('#closeCardBtn');
    closeBtn.onclick = () => {
        card.style.opacity = '0';
        card.style.transform = 'translate(-50%, -50%) scale(0.7)';
        setTimeout(() => card.remove(), 300);
    };
}

// --- 5. FORMULÁRIO DE CONTATO ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Feedback no botão
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...`;
            
            // Simulação de envio
            setTimeout(() => {
                // Chama o card customizado em vez do alert
                showFeedbackCard();
                
                form.reset();
                
                // Restaura o botão
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            }, 1500);
        });
    }
}

// --- 6. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    initMobileMenuLogic();
    initScrollAnimations();
    initContactForm();
});
