// Requiere que api.js se cargue ANTES que este archivo (ver index.html).
const formulario = document.getElementById("index-form");
const boton = document.getElementById("index-form-button");

function actualizarBoton() {
    boton.disabled = !formulario.checkValidity();
}

formulario.addEventListener("input", actualizarBoton);
// El autocompletado del navegador puede llenar los campos sin disparar "input"
actualizarBoton();
window.addEventListener("pageshow", actualizarBoton);

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value;

    boton.disabled = true;
    const respuesta = await iniciarSesion(usuario, contrasena);

    if (respuesta.ok) {
        window.location.href = "main.html";
    } else {
        alert(respuesta.error);
        actualizarBoton();
    }
});
