- **Fecha:** 2026-11-11
- **Integrante:** Jesús (@ijexu)
- **Herramienta y modelo:** Claude
- **Archivos afectados:** index.js.

## Objetivo
Corregir codigo de index.js
## Conversación (texto completo, sin editar)

### Prompt 1
Ayudame a corregir el siguiente codigo:
### codigo:
corrige el siguiente codigo const { use } = require("react");

const form = document.getElementById("index-form");
const button = document.getElementById("index-form-button");

 form.addEventListener("input", function () {
    button.disabled = !form.checkValidity();
 })

 button.disabled = !form.checkValidity();

 // ---------------------------------------------------------

 const formulario = document.getElementsById("index-form");
 const button = document.getElementById("index-form-button");
const formulario = document.getElementById("index-form");
const boton = document.getElementById("index-form-button");

 formulario.addEventListener("input", function () {
   boton.disabled = !formulario.checkValidity();

### Respuesta 1:
Qué estaba mal
const { use } = require("react");: require no existe en el navegador y no usas use. Rompe todo el script. Bórrala.
getElementsById: no existe, es getElementById.
Variables duplicadas: button, formulario y boton se declaran dos veces, y const no permite redeclarar.
Dos nombres para lo mismo: form/formulario y button/boton apuntan a los mismos elementos. Basta con uno.
Falta ; al cerrar el primer addEventListener.
El último bloque quedó sin cerrar: falta });.
Código corregido
javascript
const form = document.getElementById("index-form");
const button = document.getElementById("index-form-button");

// Estado inicial del botón
button.disabled = !form.checkValidity();

// Habilita o deshabilita el botón mientras se escribe
form.addEventListener("input", function () {
  button.disabled = !form.checkValidity();
});

Eso es todo lo que contenía tu código: la validación del botón. Como el segundo bloque repetía exactamente lo mismo con otros nombres, lo eliminé.

Si también necesitas el login

Tu código cortó antes de llegar a la parte del submit. Si la quieres, agrégala debajo:

javascript
form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  const encontrado = usuarios.find(function (usuarioGuardado) {
    return usuarioGuardado.usuario === usuario && usuarioGuardado.contrasena === contrasena;
  });

  if (encontrado) {
    localStorage.setItem("sesion", JSON.stringify({
      usuario: encontrado.usuario,
      rol: encontrado.rol
    }));
    window.location.href = "main.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});
