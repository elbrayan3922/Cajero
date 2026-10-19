// Acceso: login con Google/correo verificado y lectura del rol
import {$,say} from "./utils.js";
import {ADMIN} from "./config.js";
import {S} from "./state.js";
import {auth,db,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,sendEmailVerification,onAuthStateChanged,signOut,doc,onSnapshot} from "./firebase.js";
import {start,refresh} from "./ui.js";

/* Acceso */
const AUTH_MSG={
  "auth/popup-blocked":"El navegador bloqueó la ventana. Permite las ventanas emergentes para este sitio e intenta de nuevo.",
  "auth/unauthorized-domain":"Este dominio no está autorizado. En Firebase: Authentication > Configuración > Dominios autorizados, agrega este dominio.",
  "auth/operation-not-allowed":"Google no está activado. En Firebase: Authentication > Método de acceso > Google > Habilitar.",
  "auth/popup-closed-by-user":"Cerraste la ventana antes de terminar.",
  "auth/cancelled-popup-request":"Se canceló el intento anterior. Vuelve a pulsar el botón.",
  "auth/network-request-failed":"Sin conexión. Revisa tu internet."};
$("g").onclick=()=>signInWithPopup(auth,new GoogleAuthProvider()).catch(e=>{console.error(e);say("lm",AUTH_MSG[e.code]||`No se pudo iniciar sesión (${e.code||"error"}).`,0)});
$("lf").onsubmit=async e=>{e.preventDefault();try{await signInWithEmailAndPassword(auth,$("em").value.trim(),$("pw").value)}catch{say("lm","Correo o contraseña incorrectos.",0)}};
$("out").onclick=()=>signOut(auth);
onAuthStateChanged(auth,async u=>{
  S.subs.forEach(f=>f());S.subs=[];S.me=null;S.role=null;S.cart=[];
  if(!u){$("shell").hidden=true;$("login").hidden=false;return}
  if(!u.emailVerified){await sendEmailVerification(u).catch(()=>{});await signOut(auth);say("lm","Verifica tu correo (te enviamos un enlace) e inicia de nuevo.",0);return}
  const e=u.email.toLowerCase();
  if(e===ADMIN){S.role="admin";start()}
  else S.subs.push(onSnapshot(doc(db,"users",e),s=>{
    if(!s.exists()||s.data().active===false){signOut(auth);say("lm","Tu correo no está autorizado. Pide acceso al administrador.",0);return}
    S.me=s.data();const first=!S.role;S.role=S.me.role;first?start():refresh()},()=>{signOut(auth);say("lm","No se pudo verificar tu acceso.",0)}))});
