/* Bienvenida: pantalla de presentación autónoma (estilos + marcado + lógica en un solo archivo).
   Uso: <script src="js/bienvenida.js"></script> justo debajo de <body>. No necesita nada más. */
(function(){
  var SIGLAS="CLX",TITULO="Corp",RESALTE="LiteX",LEMA="Facturación · Inventario · Arqueo",DURACION=2800;
  try{if(sessionStorage.getItem("caja-intro")==="1")return}catch(e){} /* una vez por sesión */
  if(document.getElementById("intro"))return;
  var st=document.createElement("style");
  st.textContent=`#intro{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#2b2008 0,#0d0a05 55%,#050402 100%);color:#f3ede0;cursor:pointer;transition:opacity .6s ease,visibility .6s}
#intro.out{opacity:0;visibility:hidden}
.in-box{text-align:center;display:grid;gap:14px;justify-items:center}
.in-mark{color:#17110a;width:84px;height:84px;border-radius:24px;display:grid;place-items:center;font:800 30px/1 Inter,system-ui,sans-serif;letter-spacing:2px;background:linear-gradient(135deg,#d9a030,#8f6512);animation:pop .7s cubic-bezier(.2,.9,.3,1.3) both,pulse 2s .8s ease-out infinite}
.in-name{font:700 34px/1.1 Inter,system-ui,sans-serif;letter-spacing:-.5px;animation:rise .7s .35s both}.in-name b{color:#e2b04a}
.in-tag{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#b8a888;animation:rise .7s .6s both}
.in-bar{width:160px;height:3px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:6px;animation:rise .5s .8s both}
.in-bar i{display:block;height:100%;background:linear-gradient(90deg,#d9a030,#e2b04a);transform-origin:left;animation:load 2s .6s ease-in-out both}
@keyframes pop{from{opacity:0;transform:scale(.6) rotate(-8deg)}to{opacity:1;transform:none}}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes load{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(208,154,42,.55)}100%{box-shadow:0 0 0 26px rgba(208,154,42,0)}}
@media(prefers-reduced-motion:reduce){#intro *{animation:none!important}}`;
  document.head.appendChild(st);
  var el=document.createElement("div");el.id="intro";el.setAttribute("aria-hidden","true");
  el.innerHTML='<div class="in-box"><div class="in-mark">'+SIGLAS+'</div><div class="in-name">'+TITULO+' <b>'+RESALTE+'</b></div><div class="in-tag">'+LEMA+'</div><div class="in-bar"><i></i></div></div>';
  document.body.appendChild(el);
  function close(){
    if(el.classList.contains("out"))return;
    el.classList.add("out");setTimeout(function(){el.remove()},700);
    try{sessionStorage.setItem("caja-intro","1")}catch(e){}
  }
  setTimeout(close,DURACION);el.addEventListener("click",close);document.addEventListener("keydown",close,{once:true});
})();
