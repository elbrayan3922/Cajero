// Navegación, suscripciones en tiempo real y bloqueos visibles
import {$,today,say,err} from "./utils.js";
import {NAV,TT} from "./config.js";
import {S,email,canInv,canArq} from "./state.js";
import {db,collection,onSnapshot,query,where} from "./firebase.js";
import {renderProducts,renderCart} from "./pages/facturacion.js";
import {renderInv} from "./pages/inventario.js";
import {renderCash} from "./pages/arqueo.js";
import {renderAud} from "./pages/auditoria.js";
import {renderUsers} from "./pages/admin.js";

export function start(){
  $("login").hidden=true;$("shell").hidden=false;say("lm","",1);$("who").textContent=email()+" · "+S.role;
  $("nav").replaceChildren(...NAV.filter(n=>n[2].includes(S.role)).map(n=>{const b=document.createElement("button");b.dataset.p=n[0];b.textContent=n[1];b.onclick=()=>show(n[0]);return b}));
  S.subs.push(onSnapshot(collection(db,"products"),s=>{S.products=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.name||"").localeCompare(b.name||"","es"));refresh()},err));
  S.subs.push(onSnapshot(query(collection(db,"invoices"),where("date","==",today())),s=>{S.invs=s.docs.map(d=>d.data()).sort((a,b)=>b.number.localeCompare(a.number));refresh()},err));
  if(S.role==="admin")S.subs.push(onSnapshot(collection(db,"users"),s=>{S.users=s.docs.map(d=>({id:d.id,...d.data()}));refresh()},err));
  show(NAV.find(n=>n[2].includes(S.role))[0])}
export function show(id){S.page=id;["fact","inv","arq","aud","adm"].forEach(p=>$("p-"+p).hidden=p!==id);$("ttl").textContent=TT[id];document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.p===id));refresh()}
export function refresh(){if(!S.role)return;renderProducts();renderCart();renderInv();renderCash();renderAud();renderUsers();
  const m=S.page==="inv"&&!canInv()?"Inventario en solo lectura: bloqueado por el administrador.":S.page==="arq"&&!canArq()?"Arqueo en solo lectura: requiere autorización del administrador.":"";$("lock").textContent="🔒 "+m;$("lock").hidden=!m}
