// Utilidades
import {TZ} from "./config.js";
export const $=id=>document.getElementById(id);
export const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
export const money=c=>"$"+(c/100).toFixed(2);
export const toC=v=>{const n=parseFloat(v);return Number.isFinite(n)?Math.round(n*100):0};
export const pad=n=>String(n).padStart(4,"0");
export const today=()=>new Intl.DateTimeFormat("en-CA",{timeZone:TZ}).format(new Date());
export const tnow=()=>new Date().toLocaleTimeString("es-SV",{timeZone:TZ});
export const dnow=()=>new Date().toLocaleDateString("es-SV",{timeZone:TZ});
export const say=(id,t,ok)=>{const e=$(id);e.textContent=t;e.className="msg "+(t?(ok?"ok":"er"):"")};
export const err=e=>{console.error(e);say("gm","Error de conexión o permisos con Firestore.",0)};
export const sum=a=>a.reduce((s,i)=>s+i.total,0);
