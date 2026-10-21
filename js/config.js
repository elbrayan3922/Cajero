// Ajustes generales
export const ADMIN="elbrayan3922@gmail.com"; // Correo del administrador (el mismo que en firestore.rules)
export const TZ="America/El_Salvador";
export const IVA=1.13;
// Datos del encabezado de la factura. CAMBIAR por los reales (hoy son de relleno).
export const EMPRESA={nombre:"Compu Invas 2A",giro:"Venta de equipo informático y accesorios",direccion:"San Salvador, El Salvador",tel:"2241-3427",nit:"0614-312692-135-4",nrc:"134399-7"};
export const CAJERO="Stanley Martinez"; // Nombre fijo del cajero en las facturas
export const NAV=[["fact","Facturación",["admin","caja"]],["inv","Inventario",["admin","inventario","caja"]],["arq","Arqueo y corte",["admin","caja"]],["aud","Auditoría",["admin","caja","inventario"]],["adm","Administración",["admin"]]];
export const TT={fact:"Facturación",inv:"Inventario",arq:"Arqueo y corte",aud:"Auditoría en vivo",adm:"Administración"};
