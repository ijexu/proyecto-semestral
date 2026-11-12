
const formulario = document.getElementById("index-form");
const boton = document.getElementById("index-form-button");
 
formulario.addEventListener("input", function () {
    boton.disabled = !formulario.checkValidity();
});
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
        boton.disabled = !formulario.checkValidity();
    }
});
