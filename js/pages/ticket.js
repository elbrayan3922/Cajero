// Factura: misma plantilla para la previsualización y la impresión
import {esc,money} from "../utils.js";

export function ticketHTML(d,edit){
  const rows=d.items.map(i=>`<tr><td>${i.qty}×</td><td>${esc(i.name)}</td><td class="n">${money(i.price*i.qty)}</td></tr>`).join("")||'<tr><td colspan="3" class="tk-mu">Sin productos</td></tr>';
  const cash=d.method==="efectivo"&&d.received?`<div class="tk-r"><span>Recibido</span><span>${money(d.received)}</span></div><div class="tk-r"><span>Cambio</span><span>${money(d.change)}</span></div>`:"";
  return `<div class="tk-c"><b>Corp LiteX</b><br><small>Factura · documento de simulación sin validez fiscal</small></div>
<div class="tk-r"><span>Nº</span><b>${d.number?esc(d.number):"se asigna al cobrar"}</b></div>
<div class="tk-r"><span>Fecha</span><span>${esc(d.date)} ${esc(d.time)}</span></div>
<div class="tk-r"><span>Cliente</span>${edit?`<input id="cust" maxlength="60" value="${esc(d.customer)}" aria-label="Nombre del cliente">`:`<span>${esc(d.customer)}</span>`}</div>
<div class="tk-r"><span>Atendió</span><b>${esc(d.cashierName)}</b></div>
<hr><table>${rows}</table><hr>
<div class="tk-r"><span>Subtotal</span><span>${money(d.subtotal)}</span></div>
<div class="tk-r"><span>IVA 13% incl.</span><span>${money(d.iva)}</span></div>
<div class="tk-r tk-t"><span>TOTAL</span><span>${money(d.total)}</span></div>
<div class="tk-r"><span>Pago</span><span>${d.method==="efectivo"?"Efectivo":"Tarjeta"}</span></div>${cash}
<hr><div class="tk-c tk-mu">¡Gracias por su compra!</div>`;
}
