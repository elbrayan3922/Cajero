# Corp LiteX | Caja

```
index.html          esqueleto (login + marco)
css/styles.css      estilos
views/*.html        markup de cada sección (fact, inv, arq, aud, adm)
js/boot.js          tema claro/oscuro y preferencia de intro (carga en <head>)
js/intro.js         presentación de bienvenida
js/app.js           entrada: carga las vistas y arranca
js/config.js        ADMIN, zona horaria, IVA, menú  <- cambia aquí el correo admin
js/firebase.js      conexión al proyecto Firebase
js/state.js         estado compartido y permisos
js/utils.js         helpers
js/auth.js          login y rol
js/ui.js            navegación y tiempo real
js/pages/*.js       lógica de cada sección
firestore.rules     reglas (cambia también el correo admin)
```

Debe servirse por http(s) (hosting), no abrirse como archivo local.
