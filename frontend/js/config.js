// Requiere que api.js se cargue ANTES que este archivo (ver config.html).

// 1. Proteger la página: sin sesión, de vuelta al login
if (!haySesion()) {
    window.location.replace("index.html");
}

// ---------- Menú lateral: muestra una sección y oculta las demás ----------
const botonesSeccion = document.querySelectorAll("[data-seccion]");
const secciones = document.querySelectorAll(".menu-section section");

botonesSeccion.forEach(function (boton) {
    boton.addEventListener("click", function () {
        secciones.forEach(function (seccion) {
            seccion.classList.add("oculto");
        });
        const id = boton.dataset.seccion;
        document.getElementById(id).classList.remove("oculto");
    });
});

// ---------- Datos del perfil ----------
// Para cada campo editable: id del <span> donde se muestra, tipo de <input> y nombre legible.
const CAMPOS = {
    usuario:    { span: "user",     tipo: "text",     etiqueta: "usuario" },
    nombre:     { span: "name",     tipo: "text",     etiqueta: "nombre" },
    apellido:   { span: "lastname", tipo: "text",     etiqueta: "apellido" },
    correo:     { span: "mail",     tipo: "email",    etiqueta: "correo" },
    contrasena: { span: "password", tipo: "password", etiqueta: "contraseña" }
};
const MASCARA = "*********";

let perfil = null;              // datos del usuario (sin contraseña), tal como los entrega la API
let contrasenaVisible = false;  // estado del botón del ojo
let edicion = null;             // campo que se está editando ahora: { campo, input, boton, cancelar, titulo }
let guardando = false;

function mostrarPerfil() {
    document.getElementById("user").textContent = perfil.usuario;
    document.getElementById("name").textContent = perfil.nombre;
    document.getElementById("lastname").textContent = perfil.apellido;
    document.getElementById("mail").textContent = perfil.correo;
    document.getElementById("birthdate").textContent = perfil.nacimiento;
}

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

    perfil = respuesta.data;
    mostrarPerfil();
    pintarContrasena();
}

// ---------- Ver / ocultar contraseña ----------
const botonOjo = document.querySelector(".viewpassword-button");

async function pintarContrasena() {
    const texto = document.getElementById("password");

    if (!contrasenaVisible) {
        texto.textContent = MASCARA;
        botonOjo.textContent = "👁";
        botonOjo.setAttribute("aria-label", "Mostrar contraseña");
        return;
    }

    const respuesta = await obtenerContrasena();
    if (!respuesta.ok) {
        alert(respuesta.error);
        contrasenaVisible = false;
        pintarContrasena();
        return;
    }
    texto.textContent = respuesta.data.contrasena;
    botonOjo.textContent = "🙈";
    botonOjo.setAttribute("aria-label", "Ocultar contraseña");
}

botonOjo.addEventListener("click", function () {
    contrasenaVisible = !contrasenaVisible;
    pintarContrasena();
});

// ---------- Editar un dato ----------
// ✎ convierte el dato en un campo de texto y el botón pasa a ✔ (guardar).
// Aparece un ✕ para cancelar. También: Enter guarda y Escape cancela.
function empezarEdicion(boton) {
    const campo = boton.dataset.campo;

    // Si ya se estaba editando este campo, el mismo botón (ahora ✔) guarda
    if (edicion && edicion.campo === campo) {
        guardarEdicion();
        return;
    }
    cancelarEdicion(); // solo se edita un dato a la vez

    const definicion = CAMPOS[campo];
    const titulo = document.getElementById(definicion.span).parentElement; // el <h3>

    const input = document.createElement("input");
    input.type = definicion.tipo;
    input.className = "edit-input";
    input.setAttribute("aria-label", "Nuevo " + definicion.etiqueta);
    if (campo === "contrasena") {
        input.placeholder = "Nueva contraseña";
        input.autocomplete = "new-password";
    } else {
        input.value = perfil[campo];
        input.autocomplete = "off";
    }

    const cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "edit-button";
    cancelar.textContent = "✕";
    cancelar.setAttribute("aria-label", "Cancelar");
    cancelar.title = "Cancelar";
    cancelar.addEventListener("click", cancelarEdicion);

    input.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();
            guardarEdicion();
        } else if (evento.key === "Escape") {
            cancelarEdicion();
        }
    });

    titulo.classList.add("oculto");
    titulo.before(input);
    boton.after(cancelar);
    boton.textContent = "✔";
    boton.setAttribute("aria-label", "Guardar " + definicion.etiqueta);
    boton.title = "Guardar";

    edicion = { campo: campo, input: input, boton: boton, cancelar: cancelar, titulo: titulo };
    input.focus();
    input.select();
}

function cerrarEdicion() {
    const etiqueta = CAMPOS[edicion.campo].etiqueta;
    edicion.input.remove();
    edicion.cancelar.remove();
    edicion.titulo.classList.remove("oculto");
    edicion.boton.textContent = "✎";
    edicion.boton.setAttribute("aria-label", "Editar " + etiqueta);
    edicion.boton.title = "Editar " + etiqueta;
    edicion = null;
}

function cancelarEdicion() {
    if (edicion && !guardando) cerrarEdicion();
}

async function guardarEdicion() {
    if (!edicion || guardando) return;

    const campo = edicion.campo;
    const input = edicion.input;
    const boton = edicion.boton;
    // La contraseña se guarda tal cual (los espacios cuentan); el resto sin espacios en los bordes
    const valor = campo === "contrasena" ? input.value : input.value.trim();

    // Nada que guardar: simplemente se cierra la edición
    if (valor === "" && campo === "contrasena") { cerrarEdicion(); return; }
    if (campo !== "contrasena" && valor === perfil[campo]) { cerrarEdicion(); return; }

    guardando = true;
    input.disabled = true;
    boton.disabled = true;

    const cambios = {};
    cambios[campo] = valor;
    const respuesta = await actualizarPerfil(cambios);

    guardando = false;
    input.disabled = false;
    boton.disabled = false;

    if (respuesta.status === 401) {
        window.location.replace("index.html");
        return;
    }
    if (!respuesta.ok) {
        alert(respuesta.error);   // se queda en modo edición para corregir
        input.focus();
        return;
    }

    perfil = respuesta.data;
    cerrarEdicion();
    mostrarPerfil();
    if (campo === "contrasena") pintarContrasena(); // si el ojo está abierto, muestra la nueva
}

document.querySelectorAll("[data-campo]").forEach(function (boton) {
    boton.addEventListener("click", function () {
        empezarEdicion(boton);
    });
});

// ---------- Cerrar sesión ----------
document.getElementById("cerrar-sesion").addEventListener("click", function () {
    // cerrarSesion() borra la sesión al instante, así que no hace falta esperar la respuesta
    cerrarSesion();
    window.location.replace("index.html");
});

// ---------- Eliminar cuenta ----------
document.getElementById("eliminar-cuenta").addEventListener("click", async function (evento) {
    const boton = evento.currentTarget;

    const seguro = confirm(
        "¿Seguro que quieres eliminar tu cuenta?\n\n" +
        "Se borrarán tus datos, tu saldo, tu historial y tus favoritos. " +
        "Esta acción no se puede deshacer."
    );
    if (!seguro) return;

    boton.disabled = true;
    const respuesta = await eliminarCuenta();

    if (respuesta.status === 401) {
        window.location.replace("index.html");
        return;
    }
    if (!respuesta.ok) {
        alert(respuesta.error);
        boton.disabled = false;
        return;
    }

    alert("Tu cuenta fue eliminada.");
    window.location.replace("index.html");
});

cargarDatosPerfil();
