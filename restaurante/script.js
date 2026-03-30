// =============================================
// FOOD EXPRESS - SCRIPT.JS (Versão Corrigida)
// =============================================

const products = [
    { id: 1, category: 'burger', name: 'Classic Burger', price: 26.90, desc: 'Pão brioche, carne 160g, cheddar.', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80' },
    { id: 2, category: 'burger', name: 'Monster Bacon', price: 34.90, desc: 'Muito bacon e cebola caramelizada.', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80' },
    { id: 3, category: 'burger', name: 'Smash Duplo', price: 29.90, desc: 'Duas carnes smash.', img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80' },
    { id: 4, category: 'burger', name: 'Cheese Lover', price: 31.90, desc: 'Muito queijo derretido.', img: 'https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg' },
    { id: 5, category: 'burger', name: 'Chicken Burger', price: 27.90, desc: 'Frango crocante.', img: 'https://images.unsplash.com/photo-1608032077018-c9aad9565d29?w=500&q=80' },
    { id: 6, category: 'burger', name: 'Veggie Burger', price: 25.90, desc: 'Opção vegetariana.', img: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80' },

    { id: 7, category: 'side', name: 'Batata Rústica', price: 18.00, desc: 'Com páprica.', img: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&q=80' },
    { id: 8, category: 'side', name: 'Batata Frita', price: 15.00, desc: 'Clássica crocante.', img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80' },
    { id: 9, category: 'side', name: 'Onion Rings', price: 19.90, desc: 'Anéis crocantes.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShKHF17qVhL7_EeIBH0vtaaJRl5BNR1KEpZw&s' },
    { id: 10, category: 'side', name: 'Nuggets', price: 22.00, desc: '10 unidades.', img: 'https://wp-cdn.typhur.com/wp-content/uploads/2025/02/air-fryer-frozen-chicken-nuggets.jpg' },
    { id: 11, category: 'side', name: 'Batata com Cheddar', price: 20.00, desc: 'Com bacon.', img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&q=80' },
    { id: 12, category: 'side', name: 'Porção Mista', price: 28.00, desc: 'Batata + nuggets.', img: 'https://pontodaesfihasaosebastiao.konor.app/_core/_uploads/218/2025/11/20351711252agc5ffdkg.png' },

    { id: 13, category: 'drink', name: 'Coca-Cola', price: 7.00, desc: 'Lata gelada.', img: 'https://res.cloudinary.com/piramides/image/upload/c_fill,h_564,w_395/v1/products/3716-coca-cola-lata-350ml-normal-12un.20251024104230.png?_a=BAAAV6GX' },
    { id: 14, category: 'drink', name: 'Guaraná', price: 7.00, desc: 'Bem gelado.', img: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500&q=80' },
    { id: 15, category: 'drink', name: 'Suco Natural', price: 12.00, desc: 'Laranja.', img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&q=80' },
    { id: 16, category: 'drink', name: 'Milkshake', price: 18.00, desc: 'Chocolate.', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80' },
    { id: 17, category: 'drink', name: 'Água', price: 5.00, desc: 'Sem gás.', img: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=500&q=80' },
    { id: 18, category: 'drink', name: 'Cerveja', price: 10.00, desc: 'Long neck.', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80' },

    { id: 19, category: 'dessert', name: 'Brownie', price: 15.00, desc: 'Chocolate.', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80' },
    { id: 20, category: 'dessert', name: 'Cheesecake', price: 17.00, desc: 'Frutas vermelhas.', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80' },
    { id: 21, category: 'dessert', name: 'Sorvete', price: 12.00, desc: '3 bolas.', img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80' },
    { id: 22, category: 'dessert', name: 'Petit Gateau', price: 18.00, desc: 'Com sorvete.', img: 'https://www.receitasja.com.br/wp-content/uploads/2025/06/Petit-gateau-com-sorvete-500x375.jpg' },
    { id: 23, category: 'dessert', name: 'Donuts', price: 10.00, desc: 'Cobertura doce.', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80' },
    { id: 24, category: 'dessert', name: 'Torta', price: 14.00, desc: 'Caseira.', img: 'https://www.seara.com.br/wp-content/uploads/2025/09/219abf13ccee601625f0e378af7ef1c2_tortaalema.jpg' }
];

let cart = [];
let scrollObserver = null;
let isScrolling = false;

// ====================== RENDERIZAÇÃO ======================
function renderProducts() {
    const categories = [
        { id: 'burger', key: 'burger' },
        { id: 'side',   key: 'side' },
        { id: 'drink',  key: 'drink' },
        { id: 'dessert', key: 'dessert' }
    ];

    categories.forEach(cat => {
        const grid = document.getElementById(`grid-${cat.id}`);
        if (!grid) return;

        const items = products.filter(p => p.category === cat.key);
        grid.innerHTML = items.map(p => `
            <div class="card" onclick="openModal(${p.id})">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <div class="card-content">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <div class="card-footer">
                        <span class="price">R$ ${p.price.toFixed(2)}</span>
                        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// ====================== MODAL ======================
function openModal(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const modal = document.getElementById('productModal');
    const body = document.getElementById('modalBody');
    body.innerHTML = `
        <img src="${p.img}" class="modal-img" alt="${p.name}" loading="lazy">
        <div class="modal-info">
            <h2>${p.name}</h2>
            <p>${p.desc}</p>
            <div class="modal-footer">
                <span class="price" style="font-size: 1.8rem">R$ ${p.price.toFixed(2)}</span>
                <button class="btn primary" onclick="addToCart(${p.id}); closeModal()">Adicionar ao Pedido</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

// ====================== NAVEGAÇÃO ======================
function setActiveCategory(link) {
    document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
    if (link) link.classList.add('active');
}

function handleCatClick(e) {
    e.preventDefault();
    const link = e.currentTarget;
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    setActiveCategory(link);
    isScrolling = true;

    const offset = 205; // valor ideal para não sobrepor título

    const topPosition = targetSection.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: topPosition, behavior: 'smooth' });

    setTimeout(() => {
        isScrolling = false;
        updateActiveFromScrollPosition();
    }, 900);
}

function updateActiveFromScrollPosition() {
    if (isScrolling) return;

    const sections = Array.from(document.querySelectorAll('.menu-section'));
    let mostVisibleSection = null;
    let maxVisibility = -1;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const visibility = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleSection = section;
        }
    });

    if (mostVisibleSection) {
        const link = document.querySelector(`.cat-link[href="#${mostVisibleSection.id}"]`);
        if (link) setActiveCategory(link);
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.menu-section');
    scrollObserver = new IntersectionObserver((entries) => {
        if (isScrolling) return;
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                const link = document.querySelector(`.cat-link[href="#${entry.target.id}"]`);
                if (link) setActiveCategory(link);
            }
        });
    }, {
        rootMargin: '-160px 0px -40% 0px',
        threshold: [0.3, 0.5]
    });

    sections.forEach(section => scrollObserver.observe(section));
}

// ====================== CARRINHO ======================
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    if (item) {
        cart.push(item);
        updateCart();
    }
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCart();
    }
}

function updateCart() {
    const cartList = document.getElementById('cartItems');
    const totalEl = document.getElementById('total');
    const countEl = document.getElementById('cartCount');
    
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartList.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <span>R$ ${item.price.toFixed(2)}</span>
                </div>
                <button onclick="removeFromCart(${index})">Remover</button>
            </div>
        `;
    });

    totalEl.innerText = total.toFixed(2);
    countEl.innerText = cart.length;
}

function sendWhats() {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    let message = "🍟 *Novo Pedido - FoodExpress*%0A%0A";
    cart.forEach(item => message += `• ${item.name} - R$ ${item.price.toFixed(2)}%0A`);
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    message += `%0A💰 *Total: R$ ${total.toFixed(2)}*`;
    window.open(`https://wa.me/5541996092712?text=${message}`, '_blank');
}

// ====================== INICIALIZAÇÃO ======================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Clique nas categorias
    document.querySelectorAll('.cat-link').forEach(link => {
        link.addEventListener('click', handleCatClick);
    });

    initScrollSpy();

    // Modal
    const modal = document.getElementById('productModal');
    if (modal) modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    // Primeiro link ativo
    const firstLink = document.querySelector('.cat-link');
    if (firstLink) setActiveCategory(firstLink);

    // Scroll manual
    window.addEventListener('scroll', () => {
        if (!isScrolling && !window.scrollTimeout) {
            window.scrollTimeout = setTimeout(() => {
                updateActiveFromScrollPosition();
                window.scrollTimeout = null;
            }, 80);
        }
    }, { passive: true });

    // === BARRA SOME ANTES DE FEEDBACK E CONTATO ===
    const categoryNav = document.querySelector('.category-nav');
    const hideSections = document.querySelectorAll('#reviews, #contact');

    if (categoryNav && hideSections.length > 0) {
        const hideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    categoryNav.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    categoryNav.style.opacity = '0';
                    categoryNav.style.transform = 'translateY(-30px)';
                    categoryNav.style.pointerEvents = 'none';
                } else {
                    categoryNav.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    categoryNav.style.opacity = '1';
                    categoryNav.style.transform = 'translateY(0)';
                    categoryNav.style.pointerEvents = 'auto';
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: "0px 0px -110px 0px"   // some mais cedo
        });

        hideSections.forEach(section => hideObserver.observe(section));
    }
});