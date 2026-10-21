// Inventario: productos (editable solo si el admin lo desbloquea)
import {$,esc,money,toC,say} from "../utils.js";
import {S,canInv} from "../state.js";
import {db,collection,doc,addDoc,updateDoc,increment,serverTimestamp} from "../firebase.js";

/* Inventario */
export function renderInv(){const a=S.products.filter(p=>p.active!==false);$("stA").textContent=a.length;$("stU").textContent=a.reduce((s,p)=>s+(p.stock||0),0);$("stL").textContent=a.filter(p=>p.stock<=5).length;
  $("pf").hidden=!canInv();const b=$("it");b.replaceChildren();
  S.products.forEach(p=>{const st=p.active===false?["","Inactivo"]:p.stock<=0?["b","Agotado"]:p.stock<=5?["w","Stock bajo"]:["","Disponible"],tr=document.createElement("tr");
    tr.innerHTML=`<td>${esc(p.code)}</td><td>${esc(p.name)}</td><td class="n">${money(p.price)}</td><td class="n">${p.stock}</td><td><span class="bd ${st[0]}">${st[1]}</span></td><td>${canInv()?`<button class="gh sm" data-a="e" data-id="${p.id}">Editar</button> <button class="gh sm" data-a="t" data-id="${p.id}">${p.active===false?"Activar":"Desactivar"}</button>`:""}</td>`;b.appendChild(tr)})}
function resetForm(){S.editing=null;$("pf").reset();$("ft").textContent="Registrar producto";$("pcx").hidden=true}
$("pcx").onclick=resetForm;
$("it").onclick=async e=>{const b=e.target.closest("button");if(!b||!canInv())return;const p=S.products.find(x=>x.id===b.dataset.id);if(!p)return;
  if(b.dataset.a==="e"){S.editing=p.id;S.editBase=p.stock;$("pc").value=p.code;$("pn").value=p.name;$("pp").value=(p.price/100).toFixed(2);$("ps").value=p.stock;$("ft").textContent="Editar producto";$("pcx").hidden=false;$("pn").focus()}
  else try{await updateDoc(doc(db,"products",p.id),{active:p.active===false})}catch{say("im","No se pudo cambiar el estado.",0)}};
$("pf").onsubmit=async e=>{e.preventDefault();if(!canInv())return;
  const code=$("pc").value.trim(),name=$("pn").value.trim(),price=toC($("pp").value),stock=parseInt($("ps").value,10);
  if(!code||!name||!(price>0)||!(stock>=0)){say("im","Completa código, nombre, precio y cantidad válidos.",0);return}
  if(S.products.some(p=>p.id!==S.editing&&(p.code||"").toLowerCase()===code.toLowerCase())){say("im","Ese código ya existe.",0);return}
  try{S.editing?await updateDoc(doc(db,"products",S.editing),{code,name,price,stock:increment(stock-S.editBase)}):await addDoc(collection(db,"products"),{code,name,price,stock,active:true,createdAt:serverTimestamp()});resetForm();say("im","Guardado.",1)}
  catch{say("im","No se pudo guardar (¿bloqueado?).",0)}};
