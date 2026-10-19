// Presentación de bienvenida: una vez por sesión; clic o tecla para saltarla
const el=document.getElementById("intro");
if(el&&!document.documentElement.classList.contains("no-intro")){
  const close=()=>{if(!el.isConnected||el.classList.contains("out"))return;el.classList.add("out");setTimeout(()=>el.remove(),700);try{sessionStorage.setItem("caja-intro","1")}catch{}};
  setTimeout(close,2800);el.addEventListener("click",close);document.addEventListener("keydown",close,{once:true});
}
