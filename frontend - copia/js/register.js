// Requiere que api.js se cargue ANTES que este archivo (ver register.html).
// La edad se calcula con edadDesde() de api.js, la misma que valida el "servidor".
const EDAD_MIN = 18;
const inputNacimiento = document.getElementById("birthdate");

// No permite elegir fechas futuras en el calendario
inputNacimiento.max = new Date().toISOString().slice(0, 10);

inputNacimiento.addEventListener("input", function () {
    // Si el campo queda vacío, se limpia el mensaje de error anterior
    if (!inputNacimiento.value) {
        inputNacimiento.setCustomValidity("");
        return;
    }
    if (edadDesde(inputNacimiento.value) < EDAD_MIN) {
        inputNacimiento.setCustomValidity("Debes tener al menos " + EDAD_MIN + " años");
    } else {
        inputNacimiento.setCustomValidity("");
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
        nacimiento: inputNacimiento.value,
        contrasena: document.getElementById("password").value
    };

    // La API no lanza errores (throw): devuelve { ok, status, data, error }
    const boton = formulario.querySelector("button[type='submit']");
    if (boton) boton.disabled = true;

    const respuesta = await registrarUsuarios(nuevo);

    if (respuesta.ok) {
        window.location.href = "index.html";
    } else {
        alert(respuesta.error);
        if (boton) boton.disabled = false;
    }
});
