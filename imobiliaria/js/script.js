let todosImoveis = [];
let imoveisFiltrados = [];
let exibidos = 0;
const inicial = 3;
const incremento = 6;

let fotoAtual = 0;
let fotosImovel = [];

// ─────────────── CARREGAMENTO INICIAL ───────────────
fetch("./data/imoveis.json")
    .then(res => res.json())
    .then(data => {
        todosImoveis = data.imoveis || [];
        carregarDestaques();
        imoveisFiltrados = [...todosImoveis];
        mostrarMais();
    })
    .catch(err => console.error("Erro ao carregar imóveis:", err));

// ─────────────── DESTAQUES ───────────────
function carregarDestaques() {
    const container = document.getElementById("lista-destaque");
    if (!container) return;

    const destaques = todosImoveis.filter(i => i.destaque).slice(0, 3);
    container.innerHTML = destaques.map(criarCard).join("");
}

// ─────────────── BUSCA ───────────────
function buscar() {
    const cidade = document.getElementById("cidade")?.value?.trim() || "";
    const tipo   = document.getElementById("tipo")?.value?.trim()   || "";
    const precoMax = Number(document.getElementById("precoMax")?.value) || 0;

    imoveisFiltrados = todosImoveis.filter(i => {
        return (!cidade || i.cidade === cidade) &&
               (!tipo   || i.tipo   === tipo)   &&
               (!precoMax || i.preco <= precoMax);
    });

    exibidos = 0;
    const lista = document.getElementById("lista-imoveis");
    if (lista) lista.innerHTML = "";
    mostrarMais();
}

// ─────────────── PAGINAÇÃO ───────────────
function mostrarMais() {
    const lista = document.getElementById("lista-imoveis");
    const btnMais = document.getElementById("btnMais");
    if (!lista || !btnMais) return;

    const qtd = exibidos === 0 ? inicial : incremento;
    const novos = imoveisFiltrados.slice(exibidos, exibidos + qtd);

    lista.innerHTML += novos.map(criarCard).join("");
    exibidos += qtd;

    btnMais.style.display = exibidos >= imoveisFiltrados.length ? "none" : "inline-block";
}

// ─────────────── CRIAÇÃO DE CARD NA LISTA ───────────────
function criarCard(i) {
    const img = i.imagens?.[0] || "";
    const badge = i.badge ? `<span class="badge ${i.badge}">${i.badge}</span>` : "";

    return `
    <div class="card" onclick="abrirModal(${i.id})">
        ${badge}
        <img src="${img}" alt="${i.titulo || 'Imóvel à venda'}">
        <div class="card-info">
            <h3>${i.titulo || 'Sem título'}</h3>
            <p>${i.cidadeNome || '—'} • ${i.quartos || '—'}</p>
            <span class="preco">R$ ${Number(i.preco || 0).toLocaleString('pt-BR')}</span>
            <span class="btn-card">Ver Detalhes</span>
        </div>
    </div>
    `;
}

// ─────────────── ABRIR MODAL ───────────────
function abrirModal(id) {
    const imovel = todosImoveis.find(i => i.id === id);
    if (!imovel) return;

    // Preenche textos
    const tituloEl    = document.getElementById("modalTitulo");
    const cidadeEl    = document.getElementById("modalCidade");
    const quartosEl   = document.getElementById("modalQuartos");
    const banheirosEl = document.getElementById("modalBanheiros");
    const vagasEl     = document.getElementById("modalVagas");
    const tamanhoEl   = document.getElementById("modalTamanho");
    const precoEl     = document.getElementById("modalPreco");

    if (tituloEl)    tituloEl.textContent    = imovel.titulo || "Imóvel sem título";
    if (cidadeEl)    cidadeEl.textContent    = imovel.cidadeNome || "—";
    if (quartosEl)   quartosEl.textContent   = imovel.quartos || "—";
    if (banheirosEl) banheirosEl.textContent = imovel.banheiros || "—";
    if (vagasEl)     vagasEl.textContent     = imovel.vagas || "—";
    if (tamanhoEl)   tamanhoEl.textContent   = imovel.tamanho || "—";
    if (precoEl)     precoEl.textContent     = `R$ ${Number(imovel.preco || 0).toLocaleString('pt-BR')}`;

    // Link WhatsApp
    const mensagem = `Olá! Tenho interesse no imóvel:\n${imovel.titulo || ''}\n${imovel.cidadeNome || ''}\nR$ ${Number(imovel.preco || 0).toLocaleString('pt-BR')}\n\nGostaria de mais informações!`;
    const link = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    const btnWhats = document.getElementById("btnWhatsModal");
    if (btnWhats) btnWhats.href = link;

    // Galeria de fotos
    fotosImovel = imovel.imagens || [];
    fotoAtual = 0;

    const slider = document.getElementById("slider");
    const dotsContainer = document.getElementById("dots");

    if (slider) {
        slider.innerHTML = fotosImovel
            .map((src, idx) => `<img src="${src}" alt="Foto ${idx + 1} - ${imovel.titulo || 'Imóvel'}">`)
            .join("");
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = fotosImovel
            .map((_, i) => `
                <div class="dot ${i === 0 ? 'active' : ''}" 
                     onclick="irParaFoto(${i})"
                     aria-label="Ir para foto ${i + 1}"></div>
            `)
            .join("");
    }

    // Abre o modal com animação
    const modal = document.getElementById("modalImovel");
    if (modal) {
        modal.classList.remove("fechando");
        modal.classList.add("aberto");
        document.body.style.overflow = "hidden";
    }
}

// ─────────────── NAVEGAÇÃO NO CARROSSEL ───────────────
function mudarFoto(dir) {
    if (fotosImovel.length <= 1) return;

    fotoAtual = (fotoAtual + dir + fotosImovel.length) % fotosImovel.length;
    atualizarSlider();
}

function irParaFoto(index) {
    if (index < 0 || index >= fotosImovel.length) return;
    fotoAtual = index;
    atualizarSlider();
}

function atualizarSlider() {
    const slider = document.getElementById("slider");
    if (slider) {
        slider.style.transform = `translateX(-${fotoAtual * 100}%)`;
    }

    // Atualiza os dots
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === fotoAtual);
    });
}

// ─────────────── FECHAR MODAL ───────────────
function fecharModal() {
    const modal = document.getElementById("modalImovel");
    if (!modal) return;

    modal.classList.add("fechando");
    setTimeout(() => {
        modal.classList.remove("aberto", "fechando");
        document.body.style.overflow = "";
    }, 450);
}

// ─────────────── EVENT LISTENERS ───────────────
document.addEventListener("DOMContentLoaded", () => {
    // Botão "Mostrar mais"
    const btnMais = document.getElementById("btnMais");
    if (btnMais) btnMais.addEventListener("click", mostrarMais);

    // Fechar modal clicando fora ou no X
    window.addEventListener("click", e => {
        const modal = document.getElementById("modalImovel");
        const closeBtn = document.querySelector(".close-modal");
        if (modal && (e.target === modal || e.target === closeBtn || closeBtn?.contains(e.target))) {
            fecharModal();
        }
    });

    // Fechar com tecla ESC
    window.addEventListener("keydown", e => {
        if (e.key === "Escape") fecharModal();
    });
});

// ─────────────── MENU MOBILE ───────────────
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}

// ─────────────── MENU ATIVO AO SCROLL ───────────────
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll("nav a");
    let current = "";

    sections.forEach(sec => {
        const top = sec.offsetTop - 150;
        if (scrollY >= top && scrollY < top + sec.offsetHeight) {
            current = sec.getAttribute("id") || "";
        }
    });

    links.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
});
