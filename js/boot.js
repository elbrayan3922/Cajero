// Arranque temprano (script clásico en <head>): tema claro/oscuro y preferencia de la intro, sin parpadeo
(function(){
  var K="caja-theme",r=document.documentElement,t;
  try{t=localStorage.getItem(K)}catch(e){}
  if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
  r.dataset.theme=t;
  try{if(sessionStorage.getItem("caja-intro")==="1")r.classList.add("no-intro")}catch(e){}
  function apply(v){
    r.dataset.theme=v;var b=document.getElementById("theme");
    if(b){b.textContent=v==="dark"?"☀ Claro":"☾ Oscuro";b.setAttribute("aria-label",v==="dark"?"Cambiar a modo claro":"Cambiar a modo oscuro")}
    try{localStorage.setItem(K,v)}catch(e){}
  }
  document.addEventListener("DOMContentLoaded",function(){
    apply(r.dataset.theme);
    document.getElementById("theme").addEventListener("click",function(){apply(r.dataset.theme==="dark"?"light":"dark")});
  });
})();
