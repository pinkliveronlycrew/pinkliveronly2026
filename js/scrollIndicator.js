window.addEventListener("scroll", () => {

const indicator = document.querySelector(".scrollIndicator")

if(window.scrollY > 100){
indicator.style.opacity = 0
}else{
indicator.style.opacity = 1
}

})