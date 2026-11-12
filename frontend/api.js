//
const CLAVE_USUARIOS = "usuarios";
const CLAVE_SESION = "sesion";

function esperar(ms) {
    return new Promise(function (resolve){
        setTimeout(resolve, ms);
    });
}

async function obtenerUsuarios(){
await esperar(300);
return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

async function registrarUsuarios(nuevo) {
    const usuarios = await obtenerUsuarios();

    const existe = usuarios.some(function (user){
        return user.usuario === nuevo.usuario;
    });
    if(existe){
        throw new Error("Ese nombre de usuario ya está en uso");
    }
    usuarios.push(nuevo);
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    return nuevo;
}

async function iniciarSesion(usuario, contrasena) {
    const usuarios = await obtenerUsuarios();

    const encontrado = usuarios.find(function (user) {
        return user.usuario === usuario && user.contrasena === contrasena;
    });
if(!encontrado) {
    throw new Error("Usuario o contraseña incorrectos");
}

localStorage.setItem(CLAVE_SESION, JSON.stringify({
    usuario: encontrado.usuario
}));
return encontrado;
}

async function obtenerUsuarioActual() {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
    if (!sesion) return null;

    const usuarios = await obtenerUsuarios();
    return usuarios.find(function (user) {
        return user.usuario === sesion.usuario;
    }) || null;
}

function cerrarSesion(){
    localStorage.removeItem(CLAVE_SESION);
}