const header = document.querySelector("header")
const heroLogo = document.querySelector(".heroLogo")

window.addEventListener("scroll", ()=>{

const scroll = window.scrollY

if(scroll > 20){

header.classList.add("shrink")
if(heroLogo) heroLogo.classList.add("hide")

}else{

header.classList.remove("shrink")
if(heroLogo) heroLogo.classList.remove("hide")

}

})