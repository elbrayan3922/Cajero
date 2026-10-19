// Auditoría en vivo: qué sale y cuánto dinero entra
import {$,esc,money,sum} from "../utils.js";
import {S} from "../state.js";

/* Auditoría */
export function renderAud(){$("aT").textContent=money(sum(S.invs));$("aF").textContent=S.invs.length;$("aU").textContent=S.invs.reduce((s,i)=>s+(i.units||0),0);
  $("at").innerHTML=S.invs.map(i=>`<tr><td>${esc(i.number)}</td><td>${esc(i.time)}</td><td>${esc((i.cashier||"").split("@")[0])}</td><td>${i.items.map(x=>`${x.qty}× ${esc(x.name)}`).join(", ")}</td><td>${i.method==="efectivo"?"Efectivo":"Tarjeta"}</td><td class="n">${money(i.total)}</td></tr>`).join("")||'<tr><td colspan="6" class="mu">Aún no hay movimientos hoy.</td></tr>'}
