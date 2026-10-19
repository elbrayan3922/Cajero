// Ajustes generales
export const ADMIN="elbrayan3922@gmail.com"; // CAMBIAR: correo del administrador (el mismo que en firestore.rules)
export const TZ="America/El_Salvador";
export const IVA=1.13;
export const CAJERO="Stanley Martinez"; // Nombre fijo del cajero en las facturas
export const NAV=[["fact","Facturación",["admin","caja"]],["inv","Inventario",["admin","inventario","caja"]],["arq","Arqueo y corte",["admin","caja"]],["aud","Auditoría",["admin","caja","inventario"]],["adm","Administración",["admin"]]];
export const TT={fact:"Facturación",inv:"Inventario",arq:"Arqueo y corte",aud:"Auditoría en vivo",adm:"Administración"};
