// Estado compartido y permisos por rol
import {auth} from "./firebase.js";
export const S={me:null,role:null,products:[],invs:[],users:[],cart:[],subs:[],editing:null,editBase:0,busy:false,page:"fact",counted:false,cust:"Consumidor final",last:null};
export const email=()=>auth.currentUser.email.toLowerCase();
export const canInv=()=>S.role==="admin"||(S.role==="inventario"&&S.me?.invOpen===true);
export const canArq=()=>S.role==="admin"||(S.role==="caja"&&S.me?.arqOpen===true);
