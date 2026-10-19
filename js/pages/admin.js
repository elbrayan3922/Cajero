// Administración: usuarios, roles y bloqueos
import {$,esc,say} from "../utils.js";
import {S} from "../state.js";
import {db,doc,setDoc,updateDoc,deleteDoc} from "../firebase.js";

/* Administración */
export function renderUsers(){if(S.role!=="admin")return;
  $("ut").innerHTML=S.users.map(u=>`<tr><td>${esc(u.id)}</td><td>${esc(u.role)}</td><td><button class="sm ${u.active===false?"gh":""}" data-a="act" data-id="${esc(u.id)}">${u.active===false?"Inactivo":"Activo"}</button></td><td><button class="sm ${(u.role==="caja"?u.arqOpen:u.invOpen)?"":"gh"}" data-a="${u.role==="caja"?"arq":"inv"}" data-id="${esc(u.id)}">${(u.role==="caja"?u.arqOpen:u.invOpen)?"🔓 Editable":"🔒 Bloqueado"}</button></td><td><button class="gh sm" data-a="del" data-id="${esc(u.id)}">Quitar</button></td></tr>`).join("")||'<tr><td colspan="5" class="mu">Sin usuarios.</td></tr>'}
$("ut").onclick=async e=>{const b=e.target.closest("button"),u=b&&S.users.find(x=>x.id===b.dataset.id);if(!u)return;
  try{if(b.dataset.a==="del"){if(confirm("¿Quitar a "+u.id+"?"))await deleteDoc(doc(db,"users",u.id))}else{const f={inv:"invOpen",arq:"arqOpen",act:"active"}[b.dataset.a];await updateDoc(doc(db,"users",u.id),{[f]:f==="active"?u.active===false:!u[f]})}}catch{say("um","No se pudo actualizar.",0)}};
$("uf").onsubmit=async e=>{e.preventDefault();const m=$("ue").value.trim().toLowerCase();
  try{await setDoc(doc(db,"users",m),{role:$("ur").value,active:true,invOpen:false,arqOpen:false});$("uf").reset();say("um","Usuario autorizado (inicia bloqueado).",1)}catch{say("um","No se pudo agregar.",0)}};
