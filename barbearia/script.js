// ====================== ANIMAÇÕES E MENU ======================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
    });
}, { threshold: 0.2 });

document.querySelectorAll(".fade").forEach(el => observer.observe(el));

const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => menu.classList.toggle("show"));

document.addEventListener("click", e => {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove("show");
    }
});

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
        menu.classList.remove("show");
    });
});


// ====================== CAROUSEL ======================
const track = document.getElementById('track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let cards = document.querySelectorAll('.corte-card');

// CLONA
cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
});

cards = document.querySelectorAll('.corte-card');
const originalLength = cards.length / 2;

let currentIndex = 0;

function getCardWidth() {
    return document.querySelector('.corte-card').offsetWidth + 24;
}

function updateCarousel(smooth = true) {
    const width = getCardWidth();
    track.style.transition = smooth ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${currentIndex * width}px)`;
}

// NEXT
nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();

    if (currentIndex >= originalLength) {
        setTimeout(() => {
            currentIndex = 0;
            updateCarousel(false);
        }, 500);
    }
});

// PREV
prevBtn.addEventListener('click', () => {
    if (currentIndex <= 0) {
        currentIndex = originalLength;
        updateCarousel(false);
    }

    currentIndex--;
    updateCarousel();
});


// ====================== AGENDAMENTO ======================
let selectedService = '';
let selectedBarber = '';
let selectedTime = '';

const stepBarbeiro = document.getElementById('step-barbeiro');
const stepHorario = document.getElementById('step-horario');
const stepConfirmacao = document.getElementById('step-confirmacao');
const horariosGrid = document.getElementById('horarios-container');

const agenda = {
    "João": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    "Carlos": ["09:30", "10:30", "14:30", "15:30", "16:30", "17:00"]
};

// RESET
function resetAgendamento(nivel) {
    if (nivel <= 1) {
        selectedBarber = '';
        selectedTime = '';

        document.querySelectorAll('.barbeiro-card')
            .forEach(b => b.classList.remove('active'));

        stepBarbeiro.classList.remove('show');
        stepBarbeiro.classList.add('hidden-step');
    }

    if (nivel <= 2) {
        selectedTime = '';

        horariosGrid.innerHTML = '';

        stepHorario.classList.remove('show');
        stepHorario.classList.add('hidden-step');

        stepConfirmacao.classList.remove('show');
        stepConfirmacao.classList.add('hidden-step');
    }
}


// ====================== CLICK SERVIÇO ======================
track.addEventListener('click', (e) => {
    const card = e.target.closest('.corte-card');
    if (!card) return;

    resetAgendamento(1);

    document.querySelectorAll('.corte-card')
        .forEach(c => c.classList.remove('active'));

    card.classList.add('active');
    selectedService = card.dataset.servico;

    stepBarbeiro.classList.remove('hidden-step');
    stepBarbeiro.classList.add('show');

    stepBarbeiro.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
});


// ====================== CLICK BARBEIRO ======================
document.querySelectorAll('.barbeiro-card').forEach(card => {
    card.addEventListener('click', () => {
        resetAgendamento(2);

        document.querySelectorAll('.barbeiro-card')
            .forEach(b => b.classList.remove('active'));

        card.classList.add('active');
        selectedBarber = card.dataset.barbeiro;

        // gerar horários
        horariosGrid.innerHTML = '';

        agenda[selectedBarber].forEach(time => {
            const btn = document.createElement('div');
            btn.className = 'horario';
            btn.textContent = time;

            btn.addEventListener('click', () => {
                document.querySelectorAll('.horario')
                    .forEach(h => h.classList.remove('selected'));

                btn.classList.add('selected');
                selectedTime = time;

                stepConfirmacao.classList.remove('hidden-step');
                stepConfirmacao.classList.add('show');

                stepConfirmacao.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });

            horariosGrid.appendChild(btn);
        });

        stepHorario.classList.remove('hidden-step');
        stepHorario.classList.add('show');

        stepHorario.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
});


// ====================== CONFIRMAR ======================
document.getElementById('confirmar').addEventListener('click', () => {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();

    if (!selectedService || !selectedBarber || !selectedTime || !nome || !telefone) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const msg = `Olá! Gostaria de agendar:
• Serviço: ${selectedService}
• Barbeiro: ${selectedBarber}
• Horário: ${selectedTime}
• Nome: ${nome}
• Telefone: ${telefone}`;

    window.open(
        `https://wa.me/5519999322908?text=${encodeURIComponent(msg)}`,
        '_blank'
    );
});
