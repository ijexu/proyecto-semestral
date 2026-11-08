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