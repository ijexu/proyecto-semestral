// Requiere que api.js se cargue ANTES que este archivo en register.html
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
    // Si el campo queda vacío, se limpia el mensaje de error anterior
    if (!input.value) {
        input.setCustomValidity("");
        return;
    }
    if (calcularEdad(input.value) < EDAD_MIN) {
        input.setCustomValidity(`Debes tener al menos ${EDAD_MIN} años`);
    } else {
        input.setCustomValidity("");
    }
});
 
// ------------------------------------------------------------------------------------------------------------
 
const formulario = document.getElementById("register-form");
 
formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
 
    const nuevo = {
        nombre: document.getElementById("name").value.trim(),
        apellido: document.getElementById("lastname").value.trim(),
        usuario: document.getElementById("username").value.trim(),
        correo: document.getElementById("mail").value.trim(),
        nacimiento: document.getElementById("birthdate").value,
        contrasena: document.getElementById("password").value
    };
 
    // IA: la API ya no lanza errores (throw), devuelve { ok, status, data, error }
    const boton = formulario.querySelector("button[type='submit']");
    if (boton) boton.disabled = true;
 
    const respuesta = await registrarUsuarios(nuevo);
 
    if (respuesta.ok) {
        window.location.href = "index.html";
    } else {
        alert(respuesta.error);
        if (boton) boton.disabled = false;
    }
    // IA fin
});