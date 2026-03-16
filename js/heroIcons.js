document.addEventListener("DOMContentLoaded", () => {

function typeText(el,text,speed=35){

el.innerText = ""

let i = 0

function typing(){

if(i < text.length){

el.innerText += text.charAt(i)
i++

setTimeout(typing,speed)

}

}

typing()

}

const hero = document.getElementById("heroIcons")
const header = document.querySelector("header")
const scrollIndicator = document.querySelector(".scrollIndicator")

const iconData = [

{
img:"img/002_1.png",
texts:["阿萬剉冰","生食一定有風險\n半生不熟有噴有崩"]
},

{
img:"img/004_1.png",
texts:["烤魷魚遊戲","這是什麼GAME？"]
},

{
img:"img/005_1.png",
texts:["勝利的美酒","喝酒BAD\n我們喝奶茶"]
},

{
img:"img/006_1.png",
texts:["瓦菇菇炸片集團","是怕你吃上癮"]
},

{
img:"img/003_2.png",
texts:["夜市HOT狗勾","你口味這麼重喔？"]
},

{
img:"img/001_2.png",
texts:["古早味粉肝湯","讓大腸桿菌知道\n誰才是身體的主人"]
},

{
img:"img/001_1.png",
texts:["粉肝幫QQ地瓜球"]
}

]

/* -------- 設定 -------- */

/* 手機 icon 自動縮小 */

const iconSize = window.innerWidth < 768 ? 120 : 170

/* 手機 icon 數量減少 */

const maxIcons = window.innerWidth < 768 ? 4 : 6

const activeIcons = []

let iconQueue = []

/* -------- shuffle -------- */

function shuffle(arr){

const a = [...arr]

for(let i=a.length-1;i>0;i--){

const j = Math.floor(Math.random()*(i+1))
;[a[i],a[j]]=[a[j],a[i]]

}

return a

}

/* -------- icon queue -------- */

function getIconData(){

if(iconQueue.length===0){
iconQueue = shuffle(iconData)
}

return iconQueue.shift()

}

/* -------- 文字 queue -------- */

function getText(data){

if(!data.textQueue || data.textQueue.length===0){
data.textQueue = shuffle(data.texts)
}

return data.textQueue.shift()

}

/* -------- overlap 檢查 -------- */

function overlap(x,y){

const heroWidth = hero.offsetWidth
const heroHeight = hero.offsetHeight

for(const p of activeIcons){

const dx = (x - p.x) * heroWidth / 100
const dy = (y - p.y) * heroHeight / 100

const dist = Math.sqrt(dx*dx + dy*dy)

if(dist < iconSize) return true

}

return false

}

/* -------- spawn 平衡 -------- */

function countSide(){

let left=0
let right=0

for(const p of activeIcons){

if(p.x < 50) left++
else right++

}

return {left,right}

}

/* -------- spawn -------- */

function spawn(){

if(activeIcons.length >= maxIcons) return

const heroHeight = hero.offsetHeight
const heroWidth = hero.offsetWidth

/* header 避開 */

const headerOffset = header.offsetHeight + 40
const minTopPercent = (headerOffset / heroHeight) * 100

/* scroll indicator */

let indicatorTopPercent = 90

if(scrollIndicator){

const rect = scrollIndicator.getBoundingClientRect()
const heroRect = hero.getBoundingClientRect()

indicatorTopPercent =
((rect.top - heroRect.top) / heroHeight) * 100 - 10

}

/* 左右 padding */

const iconWidthPercent = (iconSize / heroWidth) * 100
let sidePadding = iconWidthPercent / 2

/* 桌機左右 200px */

if(window.innerWidth > 768){

const safePx = 200
const safePercent = (safePx / heroWidth) * 100

sidePadding = Math.max(sidePadding, safePercent)

}

/* 左右平衡 */

const {left,right} = countSide()

let minX = sidePadding
let maxX = 100 - sidePadding

if(left > right + 1){

minX = 50
maxX = 100 - sidePadding

}

else if(right > left + 1){

minX = sidePadding
maxX = 50

}

/* 隨機位置 */

let x,y
let tries=0

do{

x = Math.random()*(maxX-minX)+minX
y = Math.random()*(indicatorTopPercent-minTopPercent)+minTopPercent

tries++

}while(overlap(x,y) && tries<80)

/* 記錄位置 */

activeIcons.push({x,y})

/* DOM */

const el = document.createElement("div")
el.className = "heroIcon"

el.style.left = x+"%"
el.style.top = y+"%"

const data = getIconData()

const img = document.createElement("img")
img.src = data.img

const bubble = document.createElement("div")
bubble.className = "chatBubble"
const text = getText(data)

typeText(bubble,text)

el.appendChild(img)
el.appendChild(bubble)

hero.appendChild(el)

/* 顯示 */

requestAnimationFrame(()=>{
requestAnimationFrame(()=>{
el.classList.add("show")
})
})

/* 消失 */

setTimeout(()=>{

el.classList.remove("show")
el.classList.add("hide")

setTimeout(()=>{

hero.removeChild(el)

const i = activeIcons.findIndex(p=>p.x===x && p.y===y)

if(i>-1) activeIcons.splice(i,1)

},400)

},8000)

}

/* spawn interval */

setTimeout(() => {
    setInterval(spawn,1500)
},3000)

})