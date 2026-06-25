// ========================================================
// BARBER ELITE - SUPABASE INTEGRATION & UI LOGIC
// ========================================================

const SUPABASE_URL = 'https://hpgunwhlkqutnictygju.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-bu28OsOS3j1jWhbBYYnDw_BuZl1n3E';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ================= ELEMENTOS =================
const loginSection = document.getElementById("loginSection");
const formLogin = document.getElementById("formLogin");
const loginError = document.getElementById("loginError");
const btnLogin = document.getElementById("btnLogin");

const appContainer = document.getElementById("appContainer");
const conteudo = document.getElementById("conteudo");
const tituloPagina = document.getElementById("tituloPagina");
const dataAtualBadge = document.getElementById("dataAtualBadge");
const statusUpdate = document.getElementById("statusUpdate");
const toastContainer = document.getElementById("toastContainer");

// Stats
const dashboardStats = document.getElementById("dashboardStats");
const statTotal = document.getElementById("statTotal");
const statConcluidos = document.getElementById("statConcluidos");
const statPendentes = document.getElementById("statPendentes");

// ================= TOAST NOTIFICATIONS =================
function showToast(message, type = 'success') {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color:var(--success)"></i>' : '<i class="fas fa-exclamation-circle" style="color:var(--danger)"></i>';
    
    toast.innerHTML = `
        ${icon}
        <div>
            <strong style="display:block; font-size:0.9rem;">${type === 'success' ? 'Sucesso' : 'Atenção'}</strong>
            <span style="font-size:0.85rem; color:var(--text-muted);">${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("closing");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ================= ESTADO & UTILITÁRIOS =================
function setStatusLoading(isLoading) {
    if (isLoading) {
        statusUpdate.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Sincronizando...</span>`;
    } else {
        const hora = new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
        statusUpdate.innerHTML = `<div class="pulse-dot"></div><span>Atualizado às ${hora}</span>`;
    }
}

function formatDateToBR(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

// Atualiza data do topo
const hojeObj = new Date();
dataAtualBadge.textContent = hojeObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

// ================= AUTENTICAÇÃO =================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    btnLogin.disabled = true;
    btnLogin.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Entrando...</span>`;
    loginError.textContent = "";

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        loginError.textContent = "Falha no login: " + error.message;
        btnLogin.disabled = false;
        btnLogin.innerHTML = `<span>Entrar no Sistema</span><i class="fas fa-arrow-right"></i>`;
    } else {
        showToast("Login efetuado com sucesso!");
    }
});

// Listener de Sessão
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        loginSection.style.opacity = "0";
        setTimeout(() => {
            loginSection.classList.add("hidden");
            appContainer.classList.remove("hidden");
            carregarPagina("agenda");
        }, 400);
    } else {
        loginSection.classList.remove("hidden");
        loginSection.style.opacity = "1";
        appContainer.classList.add("hidden");
        conteudo.innerHTML = "";
    }
});

window.logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) showToast("Erro ao sair", "error");
};

// ================= NAVEGAÇÃO =================
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        carregarPagina(link.dataset.page);
    });
});

async function carregarPagina(page) {
    conteudo.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:15px;">Carregando dados...</p></div>`;
    dashboardStats.classList.add("hidden");
    document.getElementById("botoesFixos").classList.remove("hidden");

    if (page === "agenda") {
        tituloPagina.textContent = "Agenda de Hoje";
        dashboardStats.classList.remove("hidden");
        await carregarAgenda();
    } 
    else if (page === "bloqueios") {
        tituloPagina.textContent = "Horários Bloqueados";
        await carregarBloqueios();
    } 
    else if (page === "agendaCompleta") {
        tituloPagina.textContent = "Calendário Completo";
        document.getElementById("botoesFixos").classList.add("hidden");
        gerarCalendario();
    }
}

// ================= AGENDA (CRUD) =================
window.carregarAgenda = async () => {
    setStatusLoading(true);
    conteudo.innerHTML = `<div id="agendaGrid" class="grid-agenda"></div>`;
    const grid = document.getElementById("agendaGrid");
    
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        const { data, error } = await supabase
            .from('agendamentos')
            .select('*')
            .eq('data', today)
            .order('horario', { ascending: true });

        if (error) throw error;

        // Reset Stats
        let totais = data.length;
        let concluidos = 0;
        let pendentes = 0;

        if (totais === 0) {
            grid.innerHTML = `<div class="loading-state">Nenhum agendamento para hoje. Aproveite o dia!</div>`;
        } else {
            data.forEach(d => {
                if (d.status === 'concluido') concluidos++;
                else pendentes++;

                const statusClass = d.status === 'concluido' ? 'concluido' : 'pendente';
                const statusIcon = d.status === 'concluido' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-clock"></i>';
                
                const card = document.createElement("div");
                card.className = "card-reserva";
                // Efeito visual sutil se concluído
                if (d.status === 'concluido') card.style.opacity = '0.7';

                // Link do WhatsApp com msg pré preenchida
                const wppMsg = encodeURIComponent(`Olá ${d.nome}, aqui é da Barber Elite. O seu horário das ${d.horario} está confirmado?`);
                const wppLink = `https://wa.me/55${d.telefone.replace(/\D/g, '')}?text=${wppMsg}`;

                card.innerHTML = `
                    <div class="card-header">
                        <span class="badge-time">${d.horario.substring(0,5)}</span>
                        <span class="badge-status ${statusClass}">${statusIcon} ${d.status}</span>
                    </div>
                    <h3>${d.nome}</h3>
                    <div class="info-row"><i class="fas fa-cut"></i> ${d.servico || 'Não especificado'}</div>
                    <div class="info-row"><i class="fas fa-user-tie"></i> ${d.barbeiro || 'Qualquer'}</div>
                    <div class="info-row"><i class="fas fa-phone"></i> ${d.telefone}</div>
                    
                    <div class="card-actions">
                        <a href="${wppLink}" target="_blank" class="btn-wpp" title="Avisar no WhatsApp"><i class="fab fa-whatsapp" style="font-size:1.2rem;"></i></a>
                        ${d.status !== 'concluido' ? 
                            `<button class="btn-concluir" onclick="concluirAgendamento('${d.id}')"><i class="fas fa-check"></i> Concluir</button>` 
                            : ''
                        }
                    </div>
                    <button class="btn-remover" onclick="excluirAgendamento('${d.id}')" title="Excluir Agendamento"><i class="fas fa-trash-alt"></i> Remover</button>
                `;
                grid.appendChild(card);
            });
        }

        // Atualizar Stats UI
        statTotal.textContent = totais;
        statConcluidos.textContent = concluidos;
        statPendentes.textContent = pendentes;

    } catch (e) {
        showToast("Erro ao buscar agenda: " + e.message, "error");
        grid.innerHTML = `<div class="loading-state" style="color:var(--danger)">Falha ao carregar dados: ${e.message}</div>`;
    } finally {
        setStatusLoading(false);
    }
};

window.concluirAgendamento = async (id) => {
    try {
        const { error } = await supabase
            .from('agendamentos')
            .update({ status: 'concluido' })
            .eq('id', id);

        if (error) throw error;
        showToast("Serviço concluído!");
        carregarAgenda();
    } catch (e) {
        showToast("Erro ao concluir: " + e.message, "error");
    }
};

window.excluirAgendamento = (id) => {
    abrirConfirmacao("Tem certeza que deseja excluir permanentemente este agendamento?", async () => {
        try {
            const { error } = await supabase.from('agendamentos').delete().eq('id', id);
            if (error) throw error;
            showToast("Agendamento excluído.");
            
            // Recarrega de acordo com a aba atual
            const activePage = document.querySelector(".nav-link.active").dataset.page;
            if (activePage === 'agenda') carregarAgenda();
            // Lógica para recarregar se estiver na agenda completa omitida para simplicidade, 
            // mas o ideal é recarregar a visualização do dia.
        } catch (e) {
            showToast("Erro ao excluir: " + e.message, "error");
        }
    });
};

// ================= BLOQUEIOS =================
window.carregarBloqueios = async () => {
    setStatusLoading(true);
    conteudo.innerHTML = `<div id="bloqueiosGrid" class="grid-agenda"></div>`;
    const grid = document.getElementById("bloqueiosGrid");
    
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('bloqueios')
            .select('*')
            .gte('data', today) // Mostra de hoje em diante
            .order('data', { ascending: true })
            .order('horario', { ascending: true });

        if (error) throw error;

        if (data.length === 0) {
            grid.innerHTML = `<div class="loading-state">Nenhum horário bloqueado daqui pra frente.</div>`;
        } else {
            data.forEach(d => {
                const card = document.createElement("div");
                card.className = "card-reserva";
                card.style.borderLeft = "4px solid var(--danger)";
                card.innerHTML = `
                    <div class="card-header">
                        <span class="badge-time">${d.horario.substring(0,5)}</span>
                        <span style="color:var(--text-muted); font-size:0.85rem;">${formatDateToBR(d.data)}</span>
                    </div>
                    <h3 style="color:var(--danger)">BLOQUEADO</h3>
                    <div class="info-row"><i class="fas fa-info-circle"></i> ${d.motivo || 'Motivo não informado'}</div>
                    
                    <button class="btn-remover" onclick="removerBloqueio('${d.id}')" style="margin-top:20px;">
                        <i class="fas fa-trash-alt"></i> Desbloquear
                    </button>
                `;
                grid.appendChild(card);
            });
        }
    } catch (e) {
        showToast("Erro ao buscar bloqueios.", "error");
        grid.innerHTML = `<div class="loading-state" style="color:var(--danger)">Falha: ${e.message}</div>`;
    } finally {
        setStatusLoading(false);
    }
};

window.abrirModalBloquear = () => {
    document.getElementById("modalBloquear").classList.remove("hidden");
    
    const select = document.getElementById("horarioBloqueio");
    select.innerHTML = "";
    for (let h = 8; h <= 20; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hora = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
            const opt = document.createElement("option");
            opt.value = hora;
            opt.textContent = hora;
            select.appendChild(opt);
        }
    }
    // Set today as min date
    document.getElementById("dataBloqueio").min = new Date().toISOString().split('T')[0];
};

window.salvarBloqueio = async () => {
    const dataObj = document.getElementById("dataBloqueio").value;
    const selectElem = document.getElementById("horarioBloqueio");
    const horarios = Array.from(selectElem.selectedOptions).map(o => o.value);
    const motivo = document.getElementById("motivoBloqueio").value.trim();

    if (!dataObj || horarios.length === 0) {
        showToast("Selecione data e horários.", "error");
        return;
    }

    try {
        const inserts = horarios.map(h => ({
            data: dataObj,
            horario: h,
            motivo: motivo || 'Indisponível'
        }));

        const { error } = await supabase.from('bloqueios').insert(inserts);
        if (error) throw error;

        showToast(`${horarios.length} horário(s) bloqueado(s)!`);
        fecharModal('modalBloquear');
        
        // Refresh se estiver na aba de bloqueios
        if (document.querySelector(".nav-link.active").dataset.page === 'bloqueios') {
            carregarBloqueios();
        }
    } catch (e) {
        showToast("Erro ao salvar bloqueios: " + e.message, "error");
    }
};

window.removerBloqueio = (id) => {
    abrirConfirmacao("Remover este bloqueio e liberar o horário?", async () => {
        try {
            const { error } = await supabase.from('bloqueios').delete().eq('id', id);
            if (error) throw error;
            showToast("Bloqueio removido.");
            carregarBloqueios();
        } catch (e) {
            showToast("Erro ao remover: " + e.message, "error");
        }
    });
};

window.fecharModal = (id) => {
    document.getElementById(id).classList.add("hidden");
};

// ================= MODAL DE CONFIRMAÇÃO =================
let confirmCallback = null;
function abrirConfirmacao(mensagem, callback) {
    document.getElementById("textoConfirmacao").textContent = mensagem;
    confirmCallback = callback;
    document.getElementById("modalConfirmacao").classList.remove("hidden");
}

document.getElementById("btnConfirmarAcao").addEventListener("click", () => {
    if (confirmCallback) confirmCallback();
    fecharModal("modalConfirmacao");
});

// ================= CALENDÁRIO MENSAL =================
function gerarCalendario() {
    conteudo.innerHTML = `
        <div id="calendarioMes"></div>
        <div id="detalhesDia" class="grid-agenda" style="margin-top:30px; padding-top:30px; border-top:1px solid var(--border)"></div>
    `;
    const mesDiv = document.getElementById("calendarioMes");

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const ano = hoje.getFullYear();

    mesDiv.innerHTML = `
        <div class="calendario-header">${hoje.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}</div>
        <div class="calendario-grid" id="gridDias"></div>
    `;
    
    const gridDias = document.getElementById("gridDias");
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    diasSemana.forEach(dia => {
        const div = document.createElement("div");
        div.className = "calendario-dia-semana";
        div.textContent = dia;
        gridDias.appendChild(div);
    });

    const primeiroDia = new Date(ano, mesAtual, 1);
    const ultimoDia = new Date(ano, mesAtual + 1, 0).getDate();
    let diaSemana = primeiroDia.getDay();

    for (let i = 0; i < diaSemana; i++) {
        const div = document.createElement("div");
        div.className = "calendario-dia vazio";
        gridDias.appendChild(div);
    }

    const diaHoje = hoje.getDate();

    for (let d = 1; d <= ultimoDia; d++) {
        const div = document.createElement("div");
        div.className = "calendario-dia";
        div.textContent = d;
        if (d === diaHoje) {
            div.style.borderColor = "var(--gold)";
            div.style.color = "var(--gold)";
        }
        div.onclick = () => carregarDiaEspecifico(`${ano}-${(mesAtual+1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`);
        gridDias.appendChild(div);
    }
}

async function carregarDiaEspecifico(dataStr) {
    const detalhesDiv = document.getElementById("detalhesDia");
    detalhesDiv.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Buscando agenda do dia ${formatDateToBR(dataStr)}...</div>`;

    try {
        // Fetch Agendamentos e Bloqueios em Paralelo
        const [agResp, blResp] = await Promise.all([
            supabase.from('agendamentos').select('*').eq('data', dataStr).order('horario'),
            supabase.from('bloqueios').select('*').eq('data', dataStr).order('horario')
        ]);

        if (agResp.error) throw agResp.error;
        if (blResp.error) throw blResp.error;

        detalhesDiv.innerHTML = `<div style="grid-column: 1/-1"><h3 style="margin-bottom:15px; color:var(--gold)">Resumo do dia: ${formatDateToBR(dataStr)}</h3></div>`;

        if (agResp.data.length === 0 && blResp.data.length === 0) {
            detalhesDiv.innerHTML += `<div class="loading-state">Nenhum evento registrado nesta data.</div>`;
            return;
        }

        // Renderiza Agendamentos
        agResp.data.forEach(d => {
            const card = document.createElement("div");
            card.className = "card-reserva";
            const statusClass = d.status === 'concluido' ? 'concluido' : 'pendente';
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="badge-time">${d.horario.substring(0,5)}</span>
                    <span class="badge-status ${statusClass}">${d.status}</span>
                </div>
                <h3>${d.nome}</h3>
                <div class="info-row"><i class="fas fa-cut"></i> ${d.servico || '—'}</div>
                <div class="info-row"><i class="fas fa-phone"></i> ${d.telefone}</div>
                <div class="card-actions">
                    <button class="btn-remover" onclick="excluirAgendamento('${d.id}')"><i class="fas fa-trash"></i> Remover</button>
                </div>
            `;
            detalhesDiv.appendChild(card);
        });

        // Renderiza Bloqueios
        blResp.data.forEach(d => {
            const card = document.createElement("div");
            card.className = "card-reserva";
            card.style.borderLeft = "4px solid var(--danger)";
            card.innerHTML = `
                <div class="card-header">
                    <span class="badge-time">${d.horario.substring(0,5)}</span>
                </div>
                <h3 style="color:var(--danger)">BLOQUEADO</h3>
                <div class="info-row"><i class="fas fa-info-circle"></i> ${d.motivo || '—'}</div>
                <button class="btn-remover" onclick="removerBloqueio('${d.id}')" style="margin-top:15px;"><i class="fas fa-trash"></i> Desbloquear</button>
            `;
            detalhesDiv.appendChild(card);
        });

    } catch (e) {
        detalhesDiv.innerHTML = `<div class="loading-state" style="color:var(--danger)">Erro ao carregar dados: ${e.message}</div>`;
    }
}