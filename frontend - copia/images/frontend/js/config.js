// Requiere que api.js se cargue ANTES que este archivo (ver config.html).

// 1. Proteger la página: sin sesión, de vuelta al login
if (!haySesion()) {
    window.location.replace("index.html");
}

// ---------- Menú lateral: muestra una sección y oculta las demás ----------
const botones = document.querySelectorAll("[data-seccion]");
const secciones = document.querySelectorAll(".menu-section section");

botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
        secciones.forEach(function (seccion) {
            seccion.classList.add("oculto");
        });
        const id = boton.dataset.seccion;
        document.getElementById(id).classList.remove("oculto");
    });
});

// ---------- Datos del perfil ----------
async function cargarDatosPerfil() {
    // La API devuelve { ok, status, data, error }: los datos del usuario están en .data
    const respuesta = await obtenerUsuarioActual();

    if (respuesta.status === 401) {
        window.location.replace("index.html");
        return;
    }
    if (!respuesta.ok) {
        alert(respuesta.error);
        return;
    }

    const datos = respuesta.data;
    document.getElementById("user").textContent = datos.usuario;
    document.getElementById("name").textContent = datos.nombre;
    document.getElementById("lastname").textContent = datos.apellido;
    document.getElementById("mail").textContent = datos.correo;
    document.getElementById("birthdate").textContent = datos.nacimiento;
    document.getElementById("password").textContent = "*********";
}

cargarDatosPerfil();
