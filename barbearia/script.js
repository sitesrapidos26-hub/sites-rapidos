// Animações e Menu
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
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) menu.classList.remove("show");
});

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
        menu.classList.remove("show");
    });
});

// ====================== CAROUSEL - SEM FANTASMAS ======================
const track = document.getElementById('track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let currentIndex = 0;
const cardWidth = 324; // 300px + 24px gap

function updateCarousel() {
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % 4;
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + 4) % 4;
    updateCarousel();
});

// Seleção de serviço
document.querySelectorAll('.corte-card').forEach(card => {
    card.addEventListener('click', () => {
        resetAgendamento(1);
        document.querySelectorAll('.corte-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedService = card.dataset.servico;

        stepBarbeiro.classList.add('show');
        stepBarbeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// ====================== AGENDAMENTO ======================
let selectedService = '', selectedBarber = '', selectedTime = '';

const stepBarbeiro = document.getElementById('step-barbeiro');
const stepHorario = document.getElementById('step-horario');
const stepConfirmacao = document.getElementById('step-confirmacao');
const horariosGrid = document.getElementById('horarios-container');

const agenda = {
    "João": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    "Carlos": ["09:30", "10:30", "14:30", "15:30", "16:30", "17:00"]
};

function resetAgendamento(nivel) {
    if (nivel <= 1) {
        selectedBarber = ''; 
        selectedTime = '';
        document.querySelectorAll('.barbeiro-card').forEach(b => b.classList.remove('active'));
        stepBarbeiro.classList.remove('show');
    }
    if (nivel <= 2) {
        selectedTime = '';
        horariosGrid.innerHTML = '';
        stepHorario.classList.remove('show');
        stepConfirmacao.classList.remove('show');
    }
}

document.querySelectorAll('.barbeiro-card').forEach(card => {
    card.addEventListener('click', () => {
        resetAgendamento(2);
        document.querySelectorAll('.barbeiro-card').forEach(b => b.classList.remove('active'));
        card.classList.add('active');
        selectedBarber = card.dataset.barbeiro;

        horariosGrid.innerHTML = '';
        agenda[selectedBarber].forEach(time => {
            const btn = document.createElement('div');
            btn.className = 'horario';
            btn.textContent = time;
            btn.onclick = () => {
                document.querySelectorAll('.horario').forEach(h => h.classList.remove('selected'));
                btn.classList.add('selected');
                selectedTime = time;
                stepConfirmacao.classList.add('show');
                stepConfirmacao.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };
            horariosGrid.appendChild(btn);
        });

        stepHorario.classList.add('show');
        stepHorario.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

document.getElementById('confirmar').addEventListener('click', () => {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    if (!selectedService || !selectedBarber || !selectedTime || !nome || !telefone) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    const msg = `Olá! Gostaria de agendar:\n• Serviço: ${selectedService}\n• Barbeiro: ${selectedBarber}\n• Horário: ${selectedTime}\n• Nome: ${nome}\n• Telefone: ${telefone}`;
    window.open(`https://wa.me/5519999322908?text=${encodeURIComponent(msg)}`, '_blank');
});
