const EDAD_MIN = 18;
const input = document.getElementById("birthdate"); 

function calcularEdad(fechaNac) {
    const hoy = new Date();
    const nac = new Date(fechaNac + "T00:00");
    let edad = hoy.getFullYear() - nac.getFullYear();
    const aunNoCumple = hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate());
    if (aunNoCumple) edad--;
    return edad;
}

input.addEventListener("input", () => {
    if(!input.value) return;
    if(calcularEdad(input.value) < EDAD_MIN) {
        input.setCustomValidity(`Deber tener al menos ${EDAD_MIN} años`);}
    else {
        input.setCustomValidity("");
    }
    });

const botones = document.querySelectorAll("[data-seccion]");
const secciones = document.querySelectorAll(".menu-section section");

botones.forEach(function (boton) {
    boton.addEventListener("click", function() {
        secciones.forEach (function (seccion) {
            seccion.classList.add("oculto");
        });

        const id = boton.dataset.seccion;
        document.getElementById(id).classList.remove("oculto");
    });;