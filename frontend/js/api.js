
//
// [IA] inicio · ia/AAAA-MM-DD_usuario-github_capa-api.md
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
 
function esperar(ms) {
    return new Promise(function (resolve){
        setTimeout(resolve, ms);
    });
}
 
// [IA] inicio · ia/AAAA-MM-DD_usuario-github_capa-api.md
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
 
// [IA] inicio · ia/AAAA-MM-DD_usuario-github_capa-api.md
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
            return user.usuario.toLowerCase() === datos.usuario.trim().toLowerCase();
        });
        if (existe) {
            return respuestaError(409, "Ese nombre de usuario ya está en uso.");
        }
 
        const registro = {
            id: siguienteId(usuarios),
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            usuario: datos.usuario.trim(),
            correo: datos.correo.trim(),
            nacimiento: datos.nacimiento,
            contrasena: datos.contrasena,
            saldo: 0
        };
        usuarios.push(registro);
        guardarRecurso(CLAVE_USUARIOS, usuarios);
        return respuestaOk(sinContrasena(registro), 201);
    });
}
 
function iniciarSesion(usuario, contrasena) {
    return solicitud(async function () {
        const usuarios = await leerRecurso(CLAVE_USUARIOS, "usuarios");
 
        const encontrado = usuarios.find(function (user) {
            return user.usuario === usuario && user.contrasena === contrasena;
        });
        if (!encontrado) {
            return respuestaError(401, "Usuario o contraseña incorrectos.");
        }
 
        localStorage.setItem(CLAVE_SESION, JSON.stringify({
            usuario: encontrado.usuario
        }));
        return respuestaOk(sinContrasena(encontrado));
    });
}
 
function obtenerUsuarioActual() {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
        return respuestaOk(sinContrasena(usuario));
    });
}
 
// La sesión se borra de inmediato (antes de la latencia), para que funcione
// aunque la página cambie justo después de llamar a cerrarSesion().
function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    return solicitud(async function () {
        return respuestaOk(null);
    });
}
 
function actualizarPerfil(cambios) {
    return solicitud(async function () {
        const actual = await usuarioEnSesion();
        if (!actual) return respuestaError(401, "Debes iniciar sesión.");
 
        const datos = cambios || {};
        const nombre = (datos.nombre !== undefined ? datos.nombre : actual.nombre).trim();
        const apellido = (datos.apellido !== undefined ? datos.apellido : actual.apellido).trim();
        const correo = (datos.correo !== undefined ? datos.correo : actual.correo).trim();
 
        if (!nombre || !apellido) {
            return respuestaError(400, "El nombre y el apellido no pueden estar vacíos.");
        }
        if (!CORREO_VALIDO.test(correo)) {
            return respuestaError(400, "El correo no es válido.");
        }
 
        const usuarios = await leerRecurso(CLAVE_USUARIOS, "usuarios");
        const usuario = usuarios.find(function (user) {
            return user.id === actual.id;
        });
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.correo = correo;
        guardarRecurso(CLAVE_USUARIOS, usuarios);
        return respuestaOk(sinContrasena(usuario));
    });
}
// [IA] fin
 
// [IA] inicio · ia/AAAA-MM-DD_usuario-github_capa-api.md
// ---------- Juegos ----------
 
function obtenerJuegos(opciones) {
    return solicitud(async function () {
        const filtros = opciones || {};
        const texto = (filtros.busqueda || "").trim().toLowerCase();
        const tipo = filtros.tipo || "todos";
        const orden = filtros.orden || "asc";
 
        const juegos = await leerRecurso(CLAVE_JUEGOS, "juegos");
        const resultado = juegos
            .filter(function (juego) {
                return juego.nombre.toLowerCase().includes(texto);
            })
            .filter(function (juego) {
                return tipo === "todos" || juego.tipo === tipo;
            })
            .sort(function (a, b) {
                return orden === "desc"
                    ? b.nombre.localeCompare(a.nombre)
                    : a.nombre.localeCompare(b.nombre);
            });
        return respuestaOk(resultado);
    });
}
 
function obtenerTiposDeJuego() {
    return solicitud(async function () {
        const juegos = await leerRecurso(CLAVE_JUEGOS, "juegos");
        const tipos = [];
        juegos.forEach(function (juego) {
            if (!tipos.includes(juego.tipo)) tipos.push(juego.tipo);
        });
        return respuestaOk(tipos.sort());
    });
}
 
function obtenerJuego(id) {
    return solicitud(async function () {
        const juegos = await leerRecurso(CLAVE_JUEGOS, "juegos");
        const juego = juegos.find(function (j) {
            return j.id === Number(id);
        });
        if (!juego) return respuestaError(404, "El juego no existe.");
        return respuestaOk(juego);
    });
}
 
// ---------- Favoritos ----------
 
function obtenerFavoritos() {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const favoritos = await leerRecurso(CLAVE_FAVORITOS, "favoritos");
        return respuestaOk(favoritos.filter(function (f) {
            return f.usuarioId === usuario.id;
        }));
    });
}
 
function agregarFavorito(juegoId) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const juegos = await leerRecurso(CLAVE_JUEGOS, "juegos");
        const existeJuego = juegos.some(function (j) {
            return j.id === Number(juegoId);
        });
        if (!existeJuego) return respuestaError(404, "El juego no existe.");
 
        const favoritos = await leerRecurso(CLAVE_FAVORITOS, "favoritos");
        const yaEsta = favoritos.some(function (f) {
            return f.usuarioId === usuario.id && f.juegoId === Number(juegoId);
        });
        if (yaEsta) return respuestaError(409, "El juego ya está en tus favoritos.");
 
        const nuevo = {
            id: siguienteId(favoritos),
            usuarioId: usuario.id,
            juegoId: Number(juegoId)
        };
        favoritos.push(nuevo);
        guardarRecurso(CLAVE_FAVORITOS, favoritos);
        return respuestaOk(nuevo, 201);
    });
}
 
function quitarFavorito(juegoId) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const favoritos = await leerRecurso(CLAVE_FAVORITOS, "favoritos");
        const indice = favoritos.findIndex(function (f) {
            return f.usuarioId === usuario.id && f.juegoId === Number(juegoId);
        });
        if (indice === -1) {
            return respuestaError(404, "El juego no está en tus favoritos.");
        }
 
        const eliminado = favoritos.splice(indice, 1)[0];
        guardarRecurso(CLAVE_FAVORITOS, favoritos);
        return respuestaOk(eliminado);
    });
}
 
// ---------- Movimientos de fichas (CRUD principal) ----------
 
function obtenerMovimientos(opciones) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const filtros = opciones || {};
        const tipo = filtros.tipo || "todos";
        const orden = filtros.orden || "desc";
 
        const movimientos = await leerRecurso(CLAVE_MOVIMIENTOS, "movimientos");
        const resultado = movimientos
            .filter(function (m) {
                return m.usuarioId === usuario.id;
            })
            .filter(function (m) {
                return tipo === "todos" || m.tipo === tipo;
            })
            .sort(function (a, b) {
                return orden === "asc"
                    ? a.fecha.localeCompare(b.fecha)
                    : b.fecha.localeCompare(a.fecha);
            });
        return respuestaOk(resultado);
    });
}
 
// Crear (depósito): suma fichas al saldo.
function depositarFichas(monto) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const valor = Number(monto);
        if (!Number.isInteger(valor) || valor <= 0) {
            return respuestaError(400, "El monto debe ser un número entero mayor a 0.");
        }
        if (valor > DEPOSITO_MAX) {
            return respuestaError(400, "El depósito máximo es de " + DEPOSITO_MAX + " fichas.");
        }
 
        const movimientos = await leerRecurso(CLAVE_MOVIMIENTOS, "movimientos");
        const nuevo = {
            id: siguienteId(movimientos),
            usuarioId: usuario.id,
            tipo: "deposito",
            monto: valor,
            juegoId: null,
            nota: "Depósito de fichas",
            fecha: new Date().toISOString().slice(0, 19)
        };
        movimientos.push(nuevo);
        guardarRecurso(CLAVE_MOVIMIENTOS, movimientos);
 
        const saldo = await cambiarSaldo(usuario.id, valor);
        return respuestaOk({ movimiento: nuevo, saldo: saldo }, 201);
    });
}
 
// IA inicio · retiro de fichas (lo necesita tokens.js para los botones negativos)
function retirarFichas(monto) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const valor = Number(monto);
        if (!Number.isInteger(valor) || valor <= 0) {
            return respuestaError(400, "El monto debe ser un número entero mayor a 0.");
        }
        if (usuario.saldo < valor) {
            return respuestaError(402, "Saldo insuficiente.");
        }
 
        const movimientos = await leerRecurso(CLAVE_MOVIMIENTOS, "movimientos");
        const nuevo = {
            id: siguienteId(movimientos),
            usuarioId: usuario.id,
            tipo: "retiro",
            monto: valor,
            juegoId: null,
            nota: "Retiro de fichas",
            fecha: new Date().toISOString().slice(0, 19)
        };
        movimientos.push(nuevo);
        guardarRecurso(CLAVE_MOVIMIENTOS, movimientos);
 
        const saldo = await cambiarSaldo(usuario.id, -valor);
        return respuestaOk({ movimiento: nuevo, saldo: saldo }, 201);
    });
}
// IA fin
 
// Crear (entrada): descuenta el precio de entrada del juego (apuestaMinima).
function entrarAJuego(juegoId) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const juegos = await leerRecurso(CLAVE_JUEGOS, "juegos");
        const juego = juegos.find(function (j) {
            return j.id === Number(juegoId);
        });
        if (!juego) return respuestaError(404, "El juego no existe.");
        if (!juego.activo) {
            return respuestaError(403, "Este juego no está disponible por ahora.");
        }
 
        const precio = juego.apuestaMinima;
        if (usuario.saldo < precio) {
            return respuestaError(402, "Saldo insuficiente. La entrada cuesta " + precio + " fichas.");
        }
 
        const movimientos = await leerRecurso(CLAVE_MOVIMIENTOS, "movimientos");
        const nuevo = {
            id: siguienteId(movimientos),
            usuarioId: usuario.id,
            tipo: "entrada",
            monto: precio,
            juegoId: juego.id,
            nota: "Entrada al juego",
            fecha: new Date().toISOString().slice(0, 19)
        };
        movimientos.push(nuevo);
        guardarRecurso(CLAVE_MOVIMIENTOS, movimientos);
 
        const saldo = await cambiarSaldo(usuario.id, -precio);
        return respuestaOk({ movimiento: nuevo, saldo: saldo }, 201);
    });
}
 
// Editar: solo se puede cambiar la nota; el monto nunca se modifica.
function actualizarNota(id, nota) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const texto = (nota || "").trim();
        if (!texto) return respuestaError(400, "La nota no puede estar vacía.");
        if (texto.length > 60) {
            return respuestaError(400, "La nota admite hasta 60 caracteres.");
        }
 
        const movimientos = await leerRecurso(CLAVE_MOVIMIENTOS, "movimientos");
        const movimiento = movimientos.find(function (m) {
            return m.id === Number(id) && m.usuarioId === usuario.id;
        });
        if (!movimiento) return respuestaError(404, "El movimiento no existe.");
 
        movimiento.nota = texto;
        guardarRecurso(CLAVE_MOVIMIENTOS, movimientos);
        return respuestaOk(movimiento);
    });
}
 
// Eliminar: borra la fila del historial; no modifica el saldo.
function eliminarMovimiento(id) {
    return solicitud(async function () {
        const usuario = await usuarioEnSesion();
        if (!usuario) return respuestaError(401, "Debes iniciar sesión.");
 
        const movimientos = await leerRecurso(CLAVE_MOVIMIENTOS, "movimientos");
        const indice = movimientos.findIndex(function (m) {
            return m.id === Number(id) && m.usuarioId === usuario.id;
        });
        if (indice === -1) return respuestaError(404, "El movimiento no existe.");
 
        const eliminado = movimientos.splice(indice, 1)[0];
        guardarRecurso(CLAVE_MOVIMIENTOS, movimientos);
        return respuestaOk(eliminado);
    });
}
// [IA] fin