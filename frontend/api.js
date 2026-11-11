const formulario = document.getElementById("register.form");

formulario.addEventListener("submit" async function (evento){
    evento.preventDefault();

    const nuevo = {
        nombre: document.getElementById("name").value.trim(),
        apellido: document.getElementById("lastname").value.trim(),
        usuario: document.getElementById("username").value.trim(),
        correo: document.getElementById("mail").value.trim(),
        nacimiento: document.getElementById("birthdate").value,
        contraseña: document.getElementById("password").value
};

try {
    await registrarUsario(nuevo);
    window.location.href="index.html";
} catch {
    alert (error.message);
}
});