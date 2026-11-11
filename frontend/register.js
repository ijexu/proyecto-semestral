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
    if(!input.value) return;
    if(calcularEdad(input.value) < EDAD_MIN) {
        input.setCustomValidity(`Deber tener al menos ${EDAD_MIN} años`);}
    else {
        input.setCustomValidity("");
    }
    });

// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------


const formulario = document.getElementById("register-form");

 formulario.addEventListener("submit", function (evento) {
   evento.preventDefault();

   const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

   const username = document.getElementById("username").value.trim();

   const existencia = usuarios.some(function (usuarioGuardado) {
      return usuarioGuardado.usuario === username;
   });

   if (existencia) {
      alert("Ese nombre de usuario ya está en uso");
      return;
   }

   usuarios.push({
      nombre: formulario.elements["name"].value,
      apellido: formulario.elements["lastname"].value,
      usuario: username,
      correo: document.getElementById("mail").value,
      nacimiento: document.getElementById("birthdate").value,
      contrasena: document.getElementById("password").value,
      rol: "usuario"
   });

   localStorage.setItem("usuarios", JSON.stringify(usuarios));
   window.location.href = "index.html";
 })