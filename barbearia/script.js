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

nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();
    if (currentIndex >= originalLength) {
        setTimeout(() => { currentIndex = 0; updateCarousel(false); }, 500);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex <= 0) currentIndex = originalLength;
    currentIndex--;
    updateCarousel();
});

// ====================== SUPABASE & TOASTS ======================
const SUPABASE_URL = 'https://hpgunwhlkqutnictygju.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-bu28OsOS3j1jWhbBYYnDw_BuZl1n3E';
const supabaseDb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showToast(message, type = 'success') {
    const container = document.getElementById("toastContainer");
    if(!container) return alert(message);

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color:#2ed573"></i>' : '<i class="fas fa-exclamation-circle" style="color:#ff4757"></i>';
    
    toast.innerHTML = `
        ${icon}
        <div>
            <strong style="display:block; font-size:0.9rem;">${type === 'success' ? 'Sucesso' : 'Atenção'}</strong>
            <span style="font-size:0.85rem; color:#ccc;">${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("closing");
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

// ====================== AGENDAMENTO ======================
let selectedService = '';
let selectedBarber = '';
let selectedTime = '';
let selectedDate = new Date().toISOString().split('T')[0]; // data inicial = hoje

const stepBarbeiro = document.getElementById('step-barbeiro');
const stepHorario = document.getElementById('step-horario');
const stepConfirmacao = document.getElementById('step-confirmacao');
const horariosGrid = document.getElementById('horarios-container');

// Durações em minutos (ajuste conforme necessário)
const duracaoServicos = {
    "Degradê": 30,
    "Social": 30,
    "Navalhado": 35,
    "Barba": 40
    // adicione outros serviços aqui se precisar
};

// RESET PARCIAL
function resetAgendamento(nivel = 0) {
    if (nivel <= 1) {
        selectedBarber = '';
        selectedTime = '';
        document.querySelectorAll('.barbeiro-card').forEach(b => b.classList.remove('active'));
        horariosGrid.innerHTML = '';
        stepHorario.classList.remove('show'); stepHorario.classList.add('hidden-step');
        stepConfirmacao.classList.remove('show'); stepConfirmacao.classList.add('hidden-step');
    }
    if (nivel <= 0) {
        selectedService = '';
        document.querySelectorAll('.corte-card').forEach(c => c.classList.remove('active'));
        stepBarbeiro.classList.remove('show'); stepBarbeiro.classList.add('hidden-step');
    }
}

// CLICK SERVIÇO
track.addEventListener('click', (e) => {
    const card = e.target.closest('.corte-card');
    if (!card) return;

    resetAgendamento(0);

    document.querySelectorAll('.corte-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedService = card.dataset.servico;

    stepBarbeiro.classList.remove('hidden-step');
    stepBarbeiro.classList.add('show');
    stepBarbeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// CLICK BARBEIRO → gera horários dinâmicos considerando duração
document.querySelectorAll('.barbeiro-card').forEach(card => {
    card.addEventListener('click', async () => {
        resetAgendamento(1);

        document.querySelectorAll('.barbeiro-card').forEach(b => b.classList.remove('active'));
        card.classList.add('active');
        selectedBarber = card.dataset.barbeiro;

        // Atualiza os horários disponíveis para a data atual
        await atualizarHorariosDisponiveis();

        stepHorario.classList.remove('hidden-step');
        stepHorario.classList.add('show');
        stepHorario.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// Função que gera e exibe os horários disponíveis
async function atualizarHorariosDisponiveis() {
    const duracao = duracaoServicos[selectedService] || 30;
    const horarios = await gerarHorariosDisponiveis(selectedBarber, selectedDate, duracao);

    horariosGrid.innerHTML = '';

    if (horarios.length === 0) {
        const msg = document.createElement('p');
        msg.style.cssText = 'grid-column: 1/-1; text-align:center; padding:40px; color:#888; font-size:1.1rem;';
        msg.textContent = 'Nenhum horário disponível nesta data para este barbeiro.';
        horariosGrid.appendChild(msg);
    } else {
        horarios.forEach(time => {
            const btn = document.createElement('div');
            btn.className = 'horario';
            btn.textContent = time;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.horario').forEach(h => h.classList.remove('selected'));
                btn.classList.add('selected');
                selectedTime = time;

                stepConfirmacao.classList.remove('hidden-step');
                stepConfirmacao.classList.add('show');
                stepConfirmacao.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            horariosGrid.appendChild(btn);
        });
    }
}

// Gera lista de horários livres considerando duração do serviço
async function gerarHorariosDisponiveis(barbeiro, data, duracaoMinutos) {
    let horaInicio = 8 * 60;   // 08:00 em minutos
    const horaFim = 18 * 60;   // 18:00 em minutos
    const horarios = [];

    const ocupados = await obterHorariosOcupados(barbeiro, data);
    const bloqueados = await obterHorariosBloqueados(data); // se quiser por barbeiro, ajuste a query

    while (horaInicio + duracaoMinutos <= horaFim) {
        const horaStr = `${Math.floor(horaInicio / 60).toString().padStart(2, '0')}:${(horaInicio % 60).toString().padStart(2, '0')}`;
        let slotLivre = true;

        // Verifica todos os slots de 30 em 30 min que o serviço ocupa
        for (let offset = 0; offset < duracaoMinutos; offset += 30) {
            const slotAtual = `${Math.floor((horaInicio + offset) / 60).toString().padStart(2, '0')}:${((horaInicio + offset) % 60).toString().padStart(2, '0')}`;
            if (ocupados.includes(slotAtual) || bloqueados.includes(slotAtual)) {
                slotLivre = false;
                break;
            }
        }

        if (slotLivre) {
            horarios.push(horaStr);
        }

        horaInicio += 30;
    }

    return horarios;
}

// Consulta horários ocupados (agendamentos)
async function obterHorariosOcupados(barbeiro, data) {
    try {
        const { data: agendamentos, error } = await supabaseDb
            .from('agendamentos')
            .select('horario')
            .eq('barbeiro', barbeiro)
            .eq('data', data);
            
        if (error) throw error;
        return agendamentos.map(a => a.horario.substring(0, 5));
    } catch (e) {
        console.error("Erro ao consultar ocupados:", e);
        return [];
    }
}

// Consulta horários bloqueados
async function obterHorariosBloqueados(data) {
    try {
        const { data: bloqueios, error } = await supabaseDb
            .from('bloqueios')
            .select('horario')
            .eq('data', data);
            
        if (error) throw error;
        return bloqueios.map(b => b.horario.substring(0, 5));
    } catch (e) {
        console.error("Erro ao consultar bloqueios:", e);
        return [];
    }
}

// Quando mudar a data
document.addEventListener('DOMContentLoaded', () => {
    const inputData = document.getElementById('dataAgendamento');
    if (inputData) {
        const hojeIso = new Date().toISOString().split('T')[0];
        inputData.min = hojeIso;
        inputData.value = hojeIso;
        
        inputData.addEventListener('change', async () => {
            selectedDate = inputData.value;
            if (selectedBarber) {
                await atualizarHorariosDisponiveis();
            }
        });
    }

    // Máscara de Telefone
    const inputTelefone = document.getElementById('telefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
            
            if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
            
            if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            if (value.length > 10) { // Se tem 9 dígitos no celular
                value = `${value.slice(0, 10)}-${value.slice(10)}`;
            } else if (value.length > 9) { // Se tem 8 dígitos (telefone fixo)
                value = `${value.slice(0, 9)}-${value.slice(9)}`;
            }
            
            e.target.value = value;
        });
    }
});

// CONFIRMAR AGENDAMENTO
document.getElementById('confirmar').addEventListener('click', async () => {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const btnConfirmar = document.getElementById('confirmar');

    if (!selectedService || !selectedBarber || !selectedTime || !selectedDate || !nome || !telefone) {
        showToast("Por favor, preencha todos os campos e selecione data/horário.", "error");
        return;
    }

    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agendando...';

    try {
        // Verifica conflito novamente
        const { data: conflitos, error: checkError } = await supabaseDb
            .from('agendamentos')
            .select('id')
            .eq('barbeiro', selectedBarber)
            .eq('data', selectedDate)
            .eq('horario', selectedTime);

        if (checkError) throw checkError;

        if (conflitos && conflitos.length > 0) {
            showToast(`O horário ${selectedTime} já foi preenchido. Escolha outro.`, "error");
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = 'Confirmar Agendamento';
            return;
        }

        // Insere
        const { error } = await supabaseDb.from('agendamentos').insert([{
            nome,
            telefone,
            servico: selectedService,
            barbeiro: selectedBarber,
            horario: selectedTime,
            data: selectedDate
        }]);

        if (error) throw error;

        showToast(`Agendamento confirmado para ${selectedDate.split('-').reverse().join('/')} às ${selectedTime}!`);

        // Reset total
        resetAgendamento(0);
        document.getElementById('nome').value = '';
        document.getElementById('telefone').value = '';
        document.getElementById('dataAgendamento').value = new Date().toISOString().split('T')[0];
        selectedDate = new Date().toISOString().split('T')[0];
    } catch (e) {
        showToast("Erro ao salvar. Tente novamente.", "error");
        console.error(e);
    } finally {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = 'Confirmar Agendamento';
    }
});