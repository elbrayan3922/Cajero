// Factura: misma plantilla para la previsualización y la impresión (ticket 80/58 mm y hoja media carta/carta/A4)
import {esc,money} from "../utils.js";
import {EMPRESA as E} from "../config.js";

const U=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve","veinte","veintiuno","veintidós","veintitrés","veinticuatro","veinticinco","veintiséis","veintisiete","veintiocho","veintinueve"];
const D=["","","","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
const C=["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];
const apo=s=>s.replace(/veintiuno$/,"veintiún").replace(/uno$/,"un");
function m1000(n){if(n<30)return U[n];if(n<100){const u=n%10;return D[Math.floor(n/10)]+(u?" y "+U[u]:"")}if(n===100)return"cien";const r=n%100;return C[Math.floor(n/100)]+(r?" "+m1000(r):"")}
function ent(n){if(n<1000)return m1000(n);if(n<1e6){const m=Math.floor(n/1000),r=n%1000;return(m===1?"mil":apo(m1000(m))+" mil")+(r?" "+m1000(r):"")}const m=Math.floor(n/1e6),r=n%1e6;return(m===1?"un millón":apo(ent(m))+" millones")+(r?" "+ent(r):"")}
export const enLetras=c=>{const e=Math.floor(c/100);return(e===1?"UN DÓLAR":apo(ent(e)).toUpperCase()+" DÓLARES")+` CON ${String(c%100).padStart(2,"0")}/100 USD`};

export function ticketHTML(d,edit,fmt="80"){
  const sheet=["mc","carta","a4"].includes(fmt),no=d.number?esc(d.number):"<i>se asigna al cobrar</i>";
  const units=d.items.reduce((s,i)=>s+i.qty,0);
  const head=sheet
    ?`<div class="tk-hd"><div><div class="tk-brand">${esc(E.nombre)}</div><div>${esc(E.giro)}</div><div>${esc(E.direccion)}</div><div>Tel. ${esc(E.tel)} · NIT ${esc(E.nit)} · NRC ${esc(E.nrc)}</div></div><div class="tk-box"><b>FACTURA</b><div>Consumidor final</div><div>Nº ${no}</div></div></div>`
    :`<div class="tk-c"><div class="tk-brand">${esc(E.nombre)}</div><div>${esc(E.giro)}</div><div>${esc(E.direccion)}</div><div>Tel. ${esc(E.tel)}</div><div>NIT ${esc(E.nit)} · NRC ${esc(E.nrc)}</div></div><hr><div class="tk-c"><b>FACTURA · CONSUMIDOR FINAL</b></div><div class="tk-r"><span>Nº</span><b>${no}</b></div>`;
  const row=i=>sheet
    ?`<tr><td>${i.qty}</td><td>${i.code?esc(i.code)+" · ":""}${esc(i.name)}</td><td class="n">${money(i.price)}</td><td class="n">${money(i.price*i.qty)}</td></tr>`
    :`<tr><td colspan="2">${esc(i.name)}${i.code?` <span class="tk-mu">(${esc(i.code)})</span>`:""}</td></tr><tr><td>${i.qty} × ${money(i.price)}</td><td class="n">${money(i.price*i.qty)}</td></tr>`;
  const rows=d.items.map(row).join("")||`<tr><td colspan="${sheet?4:2}" class="tk-mu">Sin productos</td></tr>`;
  const th=sheet?'<thead><tr><th>Cant.</th><th>Descripción</th><th class="n">P. unit.</th><th class="n">Total</th></tr></thead>':"";
  const cash=d.method==="efectivo"&&d.received?`<div class="tk-r"><span>Efectivo recibido</span><span>${money(d.received)}</span></div><div class="tk-r"><span>Cambio</span><span>${money(d.change)}</span></div>`:"";
  return `${head}
<div class="tk-r"><span>Fecha y hora</span><span${d.live?' id="tkTime"':""}>${esc(d.stamp)}</span></div>
<div class="tk-r"><span>Cliente</span>${edit?`<input id="cust" maxlength="60" value="${esc(d.customer)}" aria-label="Nombre del cliente">`:`<span>${esc(d.customer)}</span>`}</div>
<div class="tk-r"><span>Atendió</span><b>${esc(d.cashierName)}</b></div>
<div class="tk-r"><span>Condición</span><span>Contado · ${d.method==="efectivo"?"Efectivo":"Tarjeta"}</span></div>
<hr><table>${th}${rows}</table><hr>
<div class="tk-r"><span>Artículos</span><span>${units}</span></div>
<div class="tk-r"><span>Subtotal (sin IVA)</span><span>${money(d.subtotal)}</span></div>
<div class="tk-r"><span>IVA 13%</span><span>${money(d.iva)}</span></div>
<div class="tk-r tk-t"><span>TOTAL A PAGAR</span><span>${money(d.total)}</span></div>${cash}
<div class="tk-w">SON: ${enLetras(d.total)}</div>
<hr><div class="tk-c">¡Gracias por su compra!<br><span class="tk-mu">Conserve este documento para cualquier reclamo.</span></div>
<div class="tk-sim">Documento de simulación, sin validez fiscal.</div>`;
}
