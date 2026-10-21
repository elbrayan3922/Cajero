// Facturación: venta, cobro y descuento de stock
import {$,esc,money,toC,pad,today,tnow,dnow,say} from "../utils.js";
import {IVA,CAJERO} from "../config.js";
import {ticketHTML} from "./ticket.js";
import {S,email} from "../state.js";
import {db,doc,runTransaction,serverTimestamp} from "../firebase.js";

/* Facturación */
export function renderProducts(){const t=$("q").value.trim().toLowerCase(),g=$("grid");g.replaceChildren();
  S.products.filter(p=>p.active!==false&&((p.name||"").toLowerCase().includes(t)||(p.code||"").toLowerCase().includes(t))).forEach(p=>{const b=document.createElement("button");b.className="prod";b.disabled=!(p.stock>0);b.dataset.id=p.id;b.innerHTML=`<b>${esc(p.name)}</b><small>${esc(p.code)} · Stock ${p.stock}</small><span>${money(p.price)}</span>`;g.appendChild(b)});
  if(!g.children.length)g.innerHTML='<p class="mu">Sin productos.</p>'}
$("q").oninput=renderProducts;
$("q").onkeydown=e=>{if(e.key==="Enter"){const p=S.products.find(x=>(x.code||"").toLowerCase()===$("q").value.trim().toLowerCase());if(p){e.preventDefault();add(p.id);$("q").value="";renderProducts()}}};
$("grid").onclick=e=>{const b=e.target.closest(".prod");if(b&&!b.disabled)add(b.dataset.id)};
function add(id){const p=S.products.find(x=>x.id===id);if(!p)return;const l=S.cart.find(x=>x.id===id);if((l?l.qty:0)+1>p.stock){say("pm",`Solo hay ${p.stock} de ${p.name}.`,0);return}say("pm","",1);S.last=null;S.frozen=null;l?l.qty++:S.cart.push({id,name:p.name,code:p.code||"",price:p.price,qty:1});renderCart()}
const tot=()=>S.cart.reduce((s,l)=>s+l.price*l.qty,0);
export function renderCart(){const t=tot(),iva=Math.round(t-t/IVA),r=toC($("rec").value),ef=$("pay").value==="efectivo";
  $("cart").innerHTML=S.cart.length?S.cart.map((l,i)=>`<div class="cl"><span>${esc(l.name)}</span><span><button class="gh sm" data-i="${i}" data-d="-1">−</button> ${l.qty} <button class="gh sm" data-i="${i}" data-d="1">+</button></span><b>${money(l.price*l.qty)}</b></div>`).join(""):'<p class="mu">Toca un producto para agregarlo.</p>';
  $("tots").innerHTML=`<div class="tr"><span>IVA incluido 13%</span><span>${money(iva)}</span></div><div class="tr big"><span>Total</span><span>${money(t)}</span></div>`;
  $("cashRow").hidden=!ef;$("chg").textContent=ef&&t>0&&r>=t?"Cambio "+money(r-t):"";renderPreview()}
$("cart").onclick=e=>{const b=e.target.closest("button"),l=b&&S.cart[+b.dataset.i];if(!l)return;const d=+b.dataset.d,p=S.products.find(x=>x.id===l.id);if(d>0&&l.qty+1>(p?p.stock:0)){say("pm","No hay más stock.",0);return}l.qty+=d;if(l.qty<1)S.cart.splice(+b.dataset.i,1);renderCart()};
["rec","pay"].forEach(i=>$(i).oninput=renderCart);$("clr").onclick=()=>{S.cart=[];S.last=null;S.frozen=null;S.cust="Consumidor final";$("rec").value="";renderCart()};
$("issue").onclick=async()=>{
  if(S.busy||!S.cart.length){if(!S.cart.length)say("pm","Agrega al menos un producto.",0);return}
  const total=tot(),iva=Math.round(total-total/IVA),method=$("pay").value,rec=toC($("rec").value);
  if(method==="efectivo"&&rec<total){say("pm","El efectivo recibido no cubre el total.",0);return}
  S.busy=true;$("issue").disabled=true;say("pm","Emitiendo...",1);
  const items=S.cart.map(l=>({id:l.id,name:l.name,code:l.code||"",price:l.price,qty:l.qty})),customer=(S.cust||"").trim()||"Consumidor final";
  try{
    const inv=await runTransaction(db,async tx=>{
      const cr=doc(db,"counters","invoices"),cs=await tx.get(cr),last=cs.exists()?cs.data().last:0;
      const refs=items.map(i=>doc(db,"products",i.id)),snaps=await Promise.all(refs.map(r=>tx.get(r)));
      snaps.forEach((s,k)=>{if(!s.exists()||s.data().active===false||s.data().stock<items[k].qty)throw new Error("Sin stock de "+items[k].name)});
      const number=pad(last+1),lines={};items.forEach(i=>lines[i.id]=i.qty);
      const data={number,date:today(),time:tnow(),items,lines,units:items.reduce((s,i)=>s+i.qty,0),subtotal:total-iva,iva,total,method,received:method==="efectivo"?rec:0,change:method==="efectivo"?rec-total:0,customer,cashier:email(),cashierName:CAJERO};
      tx.set(cr,{last:last+1});tx.set(doc(db,"invoices",number),{...data,createdAt:serverTimestamp()});
      snaps.forEach((s,k)=>tx.update(refs[k],{stock:s.data().stock-items[k].qty,lastInv:number}));
      return data});
    S.cart=[];S.last=inv;S.frozen=null;S.cust="Consumidor final";$("rec").value="";renderCart();say("pm",`Factura ${inv.number} emitida por ${money(inv.total)}.`,1)
  }catch(e){console.error(e);say("pm",/Sin stock/.test(e.message)?e.message:"No se pudo emitir la factura.",0)}
  finally{S.busy=false;$("issue").disabled=false}};

/* Previsualización e impresión */
const FMTS=["80","58","mc","carta","a4"];
const PAGE={"80":"80mm auto;margin:0","58":"58mm auto;margin:0","mc":"139.7mm 215.9mm;margin:8mm","carta":"letter;margin:12mm","a4":"A4;margin:12mm"};
try{const x=localStorage.getItem("caja-fmt");if(FMTS.includes(x))S.fmt=x}catch{}
const stampNow=()=>dnow()+" "+tnow();
function draft(){const t=tot(),iva=Math.round(t-t/IVA),method=$("pay").value,r=toC($("rec").value);
  return{number:"",customer:S.cust,items:S.cart,subtotal:t-iva,iva,total:t,method,received:method==="efectivo"?r:0,change:method==="efectivo"&&r>=t?r-t:0,cashierName:CAJERO}}
function renderPreview(){
  if(document.activeElement&&document.activeElement.id==="cust")return;
  const issued=!!S.last&&!S.cart.length,d={...(issued?S.last:draft()),stamp:S.frozen||stampNow(),live:!S.frozen};
  $("pvPaper").className="paper f"+S.fmt;$("pvPaper").innerHTML=ticketHTML(d,!issued,S.fmt);$("prn").disabled=!issued;document.querySelectorAll("#dlPdf,#dlImg").forEach(b=>b.disabled=!issued)}
$("fmt").value=S.fmt;
$("fmt").onchange=()=>{S.fmt=$("fmt").value;try{localStorage.setItem("caja-fmt",S.fmt)}catch{}renderPreview()};
$("pvPaper").oninput=e=>{if(e.target.id==="cust")S.cust=e.target.value};
$("prn").onclick=()=>{if(!S.last)return;
  S.frozen=S.frozen||stampNow();renderPreview();
  let st=$("pageStyle");if(!st){st=document.createElement("style");st.id="pageStyle";document.head.appendChild(st)}st.textContent=`@page{size:${PAGE[S.fmt]}}`;
  let a=$("printArea");if(!a){a=document.createElement("div");a.id="printArea";document.body.appendChild(a)}
  a.dataset.f=S.fmt;a.innerHTML=`<div class="paper f${S.fmt}">${ticketHTML({...S.last,stamp:S.frozen,live:false},false,S.fmt)}</div>`;window.print()};
setInterval(()=>{const e=$("tkTime");if(e&&!S.frozen)e.textContent=stampNow()},1000);

/* Descargar PDF al tamaño del formato elegido (las librerías se cargan solo al pulsar el botón) */
const H2C="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",JSPDF="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
const MM={"80":{pw:80,mg:4,w:72},"58":{pw:58,mg:4,w:50},"mc":{pw:139.7,ph:215.9,mg:8,w:123.7},"carta":{pw:215.9,ph:279.4,mg:12,w:191.9},"a4":{pw:210,ph:297,mg:12,w:186}};
const loadJS=(src,ok)=>new Promise((res,rej)=>{if(ok())return res();const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("No cargó "+src));document.head.appendChild(s)});
const setDl=v=>document.querySelectorAll("#dlPdf,#dlImg").forEach(b=>b.disabled=v);
async function exportar(modo){ // "pdf" o "png"
  if(!S.last)return;
  S.frozen=S.frozen||stampNow();renderPreview();setDl(true);say("pm",modo==="pdf"?"Generando PDF...":"Generando imagen...",1);
  let box=null;
  try{
    await loadJS(H2C,()=>window.html2canvas);if(modo==="pdf")await loadJS(JSPDF,()=>window.jspdf);
    const m=MM[S.fmt];
    box=document.createElement("div");box.id="pdfBox";box.style.cssText=`position:fixed;left:-10000px;top:0;width:${Math.round(m.w*3.78)}px;background:#fff`;
    box.innerHTML=`<div class="paper f${S.fmt}" style="max-width:none;width:100%;padding:0;margin:0;border-radius:0;box-shadow:none">${ticketHTML({...S.last,stamp:S.frozen,live:false},false,S.fmt)}</div>`;
    document.body.appendChild(box);
    const cv=await window.html2canvas(box,{scale:3,backgroundColor:"#fff",onclone:d=>{d.getElementById("pdfBox").style.left="0"}}),nombre="Factura-"+S.last.number;
    if(modo==="png"){const a=document.createElement("a");a.href=cv.toDataURL("image/png");a.download=nombre+".png";document.body.appendChild(a);a.click();a.remove()}
    else{
      const ch=m.w*cv.height/cv.width,PH=m.ph||Math.max(ch+2*m.mg,40),{jsPDF}=window.jspdf;
      const pdf=new jsPDF({unit:"mm",format:[m.pw,PH],orientation:m.pw>PH?"l":"p"});
      let w=m.w,h=ch;if(h>PH-2*m.mg){h=PH-2*m.mg;w=h*cv.width/cv.height}
      pdf.addImage(cv.toDataURL("image/png"),"PNG",m.mg,m.mg,w,h);pdf.save(nombre+".pdf");
    }
    say("pm","Factura descargada.",1);
  }catch(e){console.error(e);say("pm","No se pudo generar el archivo (¿sin internet?). Usa Imprimir y elige Guardar como PDF.",0)}
  finally{if(box)box.remove();renderPreview()}}
$("dlPdf").onclick=()=>exportar("pdf");$("dlImg").onclick=()=>exportar("png");
