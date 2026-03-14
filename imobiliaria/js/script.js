let todosImoveis=[]
let imoveisFiltrados=[]
let exibidos=0

const inicial=3
const incremento=6

fetch('/imobiliaria/data/imoveis.json') // Caminho do JSON corrigido
  .then(response => response.json())
  .then(data => {
    todosImoveis = data.imoveis
    carregarDestaques()
    imoveisFiltrados = [...todosImoveis]
    mostrarMais()
})

function carregarDestaques(){

    const destaque=todosImoveis.filter(i=>i.destaque).slice(0,3)

    const container=document.getElementById("lista-destaque")

    container.innerHTML=""

    destaque.forEach(i=>{
        container.innerHTML+=criarCard(i)
    })

}

function buscar(){

    const cidade=document.getElementById("cidade").value
    const tipo=document.getElementById("tipo").value
    const preco=parseInt(document.getElementById("precoMax").value)

    imoveisFiltrados=todosImoveis.filter(i=>{

        return (!cidade || i.cidade===cidade) &&
               (!tipo || i.tipo===tipo) &&
               (!preco || i.preco<=preco)

    })

    exibidos=0

    document.getElementById("lista-imoveis").innerHTML=""

    mostrarMais()

}

function mostrarMais(){

    const lista=document.getElementById("lista-imoveis")
    const btn=document.getElementById("btnMais")

    const qtd=exibidos===0 ? inicial : incremento

    const novos=imoveisFiltrados.slice(exibidos,exibidos+qtd)

    let html = ""

    novos.forEach(i=>{
        html += criarCard(i)
    })

    lista.innerHTML += html

    exibidos+=qtd

    if(exibidos>=imoveisFiltrados.length){

        btn.style.display="none"

    }else{

        btn.style.display="inline-block"

    }

}

window.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("btnMais").addEventListener("click",mostrarMais)
})

function criarCard(i) {
    const imgOriginal = i.imagens[0];
    const img = imgOriginal.startsWith('/imobiliaria/') ? imgOriginal : `/imobiliaria/${imgOriginal}`;

    const badge = i.badge ? `<span class="badge ${i.badge}">${i.badge}</span>` : ""
    const msg = `https://wa.me/5199999999999?text=${encodeURIComponent("Olá, tenho interesse no imóvel " + i.titulo)}`

    return `
    <div class="card">
        ${badge}
        <img src="${img}" alt="${i.titulo}">
        <div class="card-info">
            <h3>${i.titulo}</h3>
            <p>${i.cidadeNome} • ${i.quartos}</p>
            <span class="preco">R$ ${i.preco.toLocaleString()}</span>
            <a href="${msg}" target="_blank" class="btn-card">
                Falar no WhatsApp
            </a>
        </div>
    </div>
    `
}

const sections = document.querySelectorAll("section")
const navLinks = document.querySelectorAll("nav a")

window.addEventListener("scroll", () => {

    let current = ""

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150
        const sectionHeight = section.offsetHeight

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id")
        }

    })

    navLinks.forEach(link => {

        link.classList.remove("active")

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active")
        }

    })

})

const menuToggle = document.querySelector(".menu-toggle")
const nav = document.querySelector("nav")

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active")
})
