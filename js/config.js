// Ajustes generales
export const ADMIN="admin@tucorreo.com"; // CAMBIAR: correo del administrador (el mismo que en firestore.rules)
export const TZ="America/El_Salvador";
export const IVA=1.13;
export const NAV=[["fact","Facturación",["admin","caja"]],["inv","Inventario",["admin","inventario","caja"]],["arq","Arqueo y corte",["admin","caja"]],["aud","Auditoría",["admin","caja","inventario"]],["adm","Administración",["admin"]]];
export const TT={fact:"Facturación",inv:"Inventario",arq:"Arqueo y corte",aud:"Auditoría en vivo",adm:"Administración"};
