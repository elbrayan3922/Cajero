// Punto de entrada: carga las vistas (views/*.html) y arranca la app
import "./intro.js";

const VIEWS=["fact","inv","arq","aud","adm"];
try{
  await Promise.all(VIEWS.map(async v=>{
    const r=await fetch(`views/${v}.html`);
    if(!r.ok)throw new Error(v);
    document.getElementById("p-"+v).innerHTML=await r.text();
  }));
  await import("./auth.js");
}catch(e){
  console.error(e);
  document.getElementById("lm").textContent="No se pudo cargar la aplicación. Ábrela desde un servidor o hosting, no como archivo local.";
}
