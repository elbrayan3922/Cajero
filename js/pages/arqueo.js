// Arqueo y corte: conteo, cuadre y guardado del corte
import {$,esc,money,toC,today,tnow,say,sum} from "../utils.js";
import {S,email,canArq} from "../state.js";
import {db,collection,addDoc,serverTimestamp} from "../firebase.js";

/* Arqueo y corte */
const DEN=[["c1","1¢",1],["c5","5¢",5],["c10","10¢",10],["c25","25¢",25],["c50","50¢",50],["m1","Moneda $1",100],["b1","Billete $1",100],["b2","Billete $2",200],["b5","Billete $5",500],["b10","Billete $10",1000],["b20","Billete $20",2000],["b50","Billete $50",5000],["b100","Billete $100",10000]];
DEN.forEach(([k,l])=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${l}</td><td><input id="d-${k}" type="number" min="0" step="1" placeholder="0" aria-label="${l}"></td><td class="n" id="s-${k}">$0.00</td>`;$("dl").appendChild(tr)});
try{const f=localStorage.getItem("fondo-"+today());if(f)$("fondo").value=f}catch{}
$("fondo").oninput=()=>{try{localStorage.setItem("fondo-"+today(),$("fondo").value)}catch{}renderCash()};
$("dl").oninput=()=>{S.counted=true;renderCash()};
export function renderCash(){
  const ef=sum(S.invs.filter(i=>i.method==="efectivo")),tj=sum(S.invs.filter(i=>i.method==="tarjeta")),fondo=toC($("fondo").value),exp=fondo+ef,units=S.invs.reduce((s,i)=>s+(i.units||0),0);
  let cnt=0;const counts={};DEN.forEach(([k,,v])=>{const n=Math.max(0,parseInt($("d-"+k).value,10)||0);if(n)counts[k]=n;cnt+=n*v;$("s-"+k).textContent=money(n*v);$("d-"+k).disabled=!canArq()});
  $("fondo").disabled=!canArq();$("saveCut").disabled=!canArq();
  $("sEf").textContent=money(ef);$("sTj").textContent=money(tj);$("sEx").textContent=money(exp);$("tC").textContent=money(cnt);$("cF").textContent=S.invs.length;$("cU").textContent=units;$("cT").textContent=money(ef+tj);
  const d=cnt-exp;$("cd").innerHTML=!S.counted?'<span class="mu">Cuenta el efectivo para ver el cuadre.</span>':`<span class="bd ${d===0?"":d>0?"w":"b"}">${d===0?"Cuadra":d>0?"Sobran "+money(d):"Faltan "+money(-d)}</span>`;
  const by={};S.invs.forEach(i=>i.items.forEach(x=>{const o=by[x.name]||(by[x.name]={q:0,m:0});o.q+=x.qty;o.m+=x.qty*x.price}));
  $("ot").innerHTML=Object.entries(by).map(([n,o])=>`<tr><td>${esc(n)}</td><td class="n">${o.q}</td><td class="n">${money(o.m)}</td></tr>`).join("")||'<tr><td colspan="3" class="mu">Sin ventas hoy.</td></tr>';
  return{ef,tj,fondo,exp,cnt,counts,units}}
$("saveCut").onclick=async()=>{if(!canArq())return;const c=renderCash();if(!S.counted||c.cnt===0){say("cm","Cuenta el efectivo primero.",0);return}
  try{await addDoc(collection(db,"cuts"),{date:today(),time:tnow(),cashier:email(),fondo:c.fondo,cashSales:c.ef,cardSales:c.tj,invoices:S.invs.length,units:c.units,expected:c.exp,counted:c.cnt,difference:c.cnt-c.exp,denominations:c.counts,createdAt:serverTimestamp()});say("cm","Corte guardado.",1)}
  catch{say("cm","No se pudo guardar el corte.",0)}};
