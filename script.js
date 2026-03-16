window.scrollTo(0,0)

const sections = document.querySelectorAll("section:not(.hero)")

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.style.opacity = "1"
entry.target.style.transform = "translateY(0)"

}

})

})

sections.forEach(section => {

section.style.opacity = "0"
section.style.transform = "translateY(40px)"
section.style.transition = "all 0.7s ease"

observer.observe(section)

})


/* MENU MOBILE */

const hamburger = document.getElementById("hamburger")
const nav = document.querySelector("nav")

hamburger.addEventListener("click", () => {

nav.classList.toggle("active")

})
