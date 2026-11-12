- **Fecha:** 2026-11-12
- **Integrante:** Alvaro (@ashenkn)
- **Herramienta y modelo:** Gemini (Google)
- **Archivos afectados:** frontend/api.js

## Objetivo
Quería integrar mis nuevos archivos de mocks (`usuarios`, `juegos`, `favoritos` y `movimientos`) dentro de mi capa de datos `api.js` que antes solo manejaba usuarios y sesión de forma básica. Como necesitaba simular un backend real con persistencia en `localStorage`, latencia variable, manejo uniforme de errores y CRUD completo para los nuevos recursos, consulté a la IA para aprender a estructurar la capa con los bloques marcados con `[IA]`.

## Conversación (texto completo, sin editar)

### Prompt 1
enseñame a integrar mis nuevos mocks en mi codigo, los mock que quiero agregar son los q salgan en la parte de [IA]

### Respuesta 1
¡Hola! Vamos a escalar tu capa `api.js` para integrar tus nuevos archivos JSON de mocks (`usuarios.json`, `juegos.json`, `favoritos.json` y `movimientos.json`) y simular el comportamiento de un backend real. Para lograrlo, aplicamos tres conceptos clave:

1. Carga inicial desde JSON y persistencia con prefijo en `localStorage`
- **Prefijo aislado (`PREFIJO = "casino_"`)**: Todas las claves se guardan como `casino_usuarios`, `casino_juegos`, `casino_favoritos`, `casino_movimientos` y `casino_sesion` para no chocar con datos viejos de pruebas anteriores.
- **Carga automática (`leerRecurso`)**: La primera vez que se consulta un recurso, hace `fetch("mocks/" + archivo + ".json")` y guarda una copia en `localStorage`. En las siguientes llamadas lee y escribe directo en el navegador, permitiendo crear, editar o borrar datos sin perderlos al recargar (con `restablecerDatos()` se vuelve al estado original de los JSON).

2. Simulación de red y formato uniforme de respuesta (`{ ok, status, data, error }`)
- **Envoltorio `solicitud(operacion)`**: Cada llamada pasa por una latencia aleatoria entre `300 ms` y `800 ms` (`latenciaAleatoria()`) y permite simular caídas del servidor mediante `?fallar=1` en la URL o `configurarFalla(probabilidad)`.
- **Respuestas estandarizadas**: En lugar de lanzar excepciones con `throw`, todas las funciones devuelven `{ ok: true, status, data, error: null }` o `{ ok: false, status, data: null, error }`, facilitando validar `if (!respuesta.ok)` en las vistas.

3. Sanitización y CRUD de los nuevos recursos
- **Seguridad (`sinContrasena`)**: Elimina el campo `contrasena` antes de devolver el objeto usuario al frontend en `registrarUsuarios`, `iniciarSesion`, `obtenerUsuarioActual` y `actualizarPerfil`.
- **Nuevos recursos**: Se incorporan funciones para filtrar y consultar `juegos`, agregar/quitar `favoritos` por `usuarioId`, y gestionar `movimientos` de fichas (`depositarFichas`, `entrarAJuego`, `actualizarNota` y `eliminarMovimiento`) actualizando el saldo del usuario automáticamente.

Aquí tienes los bloques completos que debes integrar en tu `api.js` manteniendo tu función `esperar(ms)`:

```javascript
// [IA] inicio · ia/2026-11-12_ashenkn_capa-api.md
// Constantes: se reemplazan las dos originales (CLAVE_USUARIOS y CLAVE_SESION)
// por versiones con prefijo, para no chocar con datos viejos en localStorage.
const PREFIJO = "casino_";
const CLAVE_USUARIOS = PREFIJO + "usuarios";
const CLAVE_JUEGOS = PREFIJO + "juegos";
const CLAVE_FAVORITOS = PREFIJO + "favoritos";
const CLAVE_MOVIMIENTOS = PREFIJO + "movimientos";
const CLAVE_SESION = PREFIJO + "sesion";
const CLAVE_FALLA = PREFIJO + "prob_falla";
const LATENCIA_MIN = 300;
const LATENCIA_MAX = 800;
const DEPOSITO_MAX = 100000;
// [IA] fin

// [IA] inicio · ia/2026-11-12_ashenkn_capa-api.md
// ---------- Utilidades de la capa ----------

function latenciaAleatoria() {
    return LATENCIA_MIN + Math.random() * (LATENCIA_MAX - LATENCIA_MIN);
}

// Formato uniforme de respuesta: { ok, status, data, error }
function respuestaOk(data, status) {
    return { ok: true, status: status || 200, data: data, error: null };
}

function respuestaError(status, mensaje) {
    return { ok: false, status: status, data: null, error: mensaje };
}

// Error forzado: agregar ?fallar=1 a la URL, o llamar configurarFalla(0.3)
// para que falle el 30 % de las llamadas (configurarFalla(0) lo desactiva).
function configurarFalla(probabilidad) {
    localStorage.setItem(CLAVE_FALLA, String(probabilidad));
}

function debeFallar() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("fallar") === "1") return true;
    const probabilidad = parseFloat(localStorage.getItem(CLAVE_FALLA)) || 0;
    return Math.random() < probabilidad;
}

function guardarRecurso(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

// La primera vez carga mocks/<archivo>.json y lo copia a localStorage.
// Desde entonces siempre se lee y se escribe en localStorage.
async function leerRecurso(clave, archivo) {
    const guardado = localStorage.getItem(clave);
    if (guardado) return JSON.parse(guardado);

    const res = await fetch("mocks/" + archivo + ".json");
    if (!res.ok) throw new Error("No se pudo cargar mocks/" + archivo + ".json");
    const datos = await res.json();
    guardarRecurso(clave, datos);
    return datos;
}

function siguienteId(lista) {
    return lista.reduce(function (max, item) {
        return Math.max(max, item.id);
    }, 0) + 1;
}

// Envuelve cada operación: latencia, error forzado y errores inesperados.
async function solicitud(operacion) {
    await esperar(latenciaAleatoria());
    if (debeFallar()) {
        return respuestaError(500, "Error simulado del servidor. Intenta nuevamente.");
    }
    try {
        return await operacion();
    } catch (error) {
        console.error(error);
        return respuestaError(500, "No se pudo completar la operación.");
    }
}

// Borra todos los datos guardados y vuelve a los mocks originales.
function restablecerDatos() {
    Object.keys(localStorage).forEach(function (clave) {
        if (clave.startsWith(PREFIJO)) localStorage.removeItem(clave);
    });
}

// ---------- Ayudas de sesión y usuarios ----------

function nombreSesion() {
    try {
        const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
        return sesion ? sesion.usuario : null;
    } catch (error) {
        return null;
    }
}

// Solo revisa si hay sesión guardada (sirve para proteger vistas privadas).
function haySesion() {
    return nombreSesion() !== null;
}

async function usuarioEnSesion() {
    const nombre = nombreSesion();
    if (nombre === null) return null;

    const usuarios = await leerRecurso(CLAVE_USUARIOS, "usuarios");
    return usuarios.find(function (user) {
        return user.usuario === nombre;
    }) || null;
}

function sinContrasena(usuario) {
    const copia = Object.assign({}, usuario);
    delete copia.contrasena;
    return copia;
}

async function cambiarSaldo(usuarioId, diferencia) {
    const usuarios = await leerRecurso(CLAVE_USUARIOS, "usuarios");
    const usuario = usuarios.find(function (user) {
        return user.id === usuarioId;
    });
    usuario.saldo += diferencia;
    guardarRecurso(CLAVE_USUARIOS, usuarios);
    return usuario.saldo;
}

function edadDesde(fecha) {
    const hoy = new Date();
    const nac = new Date(fecha + "T00:00");
    let edad = hoy.getFullYear() - nac.getFullYear();
    const aunNoCumple = hoy.getMonth() < nac.getMonth() ||
        (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate());
    if (aunNoCumple) edad--;
    return edad;
}

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// [IA] fin

// [IA] inicio · ia/2026-11-12_ashenkn_capa-api.md
// ---------- Usuarios y sesión ----------
// Versiones modificadas de tus funciones originales: ya no lanzan errores
// (throw) sino que devuelven { ok, status, data, error }. obtenerUsuarios()
// se reemplazó por leerRecurso(), porque la API no debe entregar la lista
// completa de usuarios.

function registrarUsuarios(nuevo) {
    return solicitud(async function () {
        const datos = nuevo || {};

        if (!datos.nombre || !datos.apellido || !datos.usuario ||
            !datos.correo || !datos.nacimiento || !datos.contrasena) {
            return respuestaError(400, "Todos los campos son obligatorios.");
        }
        if (!CORREO_VALIDO.test(datos.correo)) {
            return respuestaError(400, "El correo no es válido.");
        }
        if (datos.contrasena.length < 4) {
            return respuestaError(400, "La contraseña debe tener al menos 4 caracteres.");
        }
        if (Number.isNaN(new Date(datos.nacimiento + "T00:00").getTime())) {
            return respuestaError(400, "La fecha de nacimiento no es válida.");
        }
        if (edadDesde(datos.nacimiento) < 18) {
            return respuestaError(400, "Debes tener al menos 18 años.");
        }

        const usuarios = await leerRecurso(CLAVE_USUARIOS, "usuarios");
        const existe = usuarios.some(function (user) {
            return user.usuario.toLowerCase() === datos.usuario.trim().toLower