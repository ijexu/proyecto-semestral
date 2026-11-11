const botones = document.querySelectorAll("[data-seccion]");
const secciones = document.querySelectorAll(".menu-section section");

botones.forEach(function (boton) {
    boton.addEventListener("click", function() {
        secciones.forEach (function (seccion) {
            seccion.classList.add("oculto");
        });
        const id = boton.dataset.seccion;
        document.getElementById(id).classList.remove("oculto");
    });
});

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------

const sesion = JSON.parse(localStorage.getItem("sesion"));

if(!sesion){
    window.location.href="index.html";
} else {

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const datos = usuarios.find(function (u) {
    return u.usuario === sesion.usuario;
});

if (datos) {
    document.getElementById("user").textContent = datos.usuario;
    document.getElementById("name").textContent = datos.nombre;
    document.getElementById("lastname").textContent = datos.apellido;
    document.getElementById("mail").textContent = datos.correo;
    document.getElementById("birthdate").textContent = datos.nacimiento;
    document.getElementById("password").textContent = datos.contrasena;
}}