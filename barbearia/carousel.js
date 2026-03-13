const track = document.querySelector(".carousel-track")
const slides = document.querySelectorAll(".carousel-track img")
const next = document.querySelector(".next")
const prev = document.querySelector(".prev")

let index = 0
let autoplay
let restartTimer

let slideWidth
let visibleSlides
let maxIndex

window.addEventListener("load", () => {

    slideWidth = slides[0].offsetWidth + 20

    visibleSlides = window.innerWidth < 768 ? 1 : 3
    maxIndex = slides.length - visibleSlides

    startAuto()
})

function updateCarousel(){
    track.style.transform = `translateX(-${index * slideWidth}px)`
}

function nextSlide(){
    index++
    if(index > maxIndex){
        index = 0
    }
    updateCarousel()
}

function prevSlide(){
    index--
    if(index < 0){
        index = maxIndex
    }
    updateCarousel()
}

function startAuto(){
    clearInterval(autoplay)
    autoplay = setInterval(nextSlide, 3000)
}

function pauseAuto(){
    clearInterval(autoplay)

    clearTimeout(restartTimer)

    restartTimer = setTimeout(()=>{
        startAuto()
    },5000)
}

next.addEventListener("click", ()=>{
    nextSlide()
    pauseAuto()
})

prev.addEventListener("click", ()=>{
    prevSlide()
    pauseAuto()
})

window.addEventListener("resize", () => {
    slideWidth = slides[0].offsetWidth + 20
    visibleSlides = window.innerWidth < 768 ? 1 : 3
    maxIndex = slides.length - visibleSlides
    updateCarousel()
})
