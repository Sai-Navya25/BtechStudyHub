const live=document.querySelector('.livechat')
fetch('/livechat.html')
.then(res=>res.text())
.then(data=>{
    live.innerHTML=data
})