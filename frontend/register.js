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

    // ------------------------------------

     const formulario = document.getElementById("index-form");

 formulario.addEventListener("submit", function (a) {
   a.preventDefault();

   const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

   const username = document.getElementById("username").ariaValueMax.trim();

   const existencia = usuarios.some(function (e) {
      return username.usuarios === username;
   });

   if (existencia) {
      alert("Ese nombre de usuario ya está en uso");
      return;
   }

   usuarios.push({
      nombre: formulario.elements["name"].value,
      apellido: formulario.element["lastname"].value
      usuario: username,
      correo: document.getElementById("mail").value,
      nacimiento: document.getElementById("birthdate").value,
      contrasena: document.getElementById("password"),
      rol: "usuario"
   });

   localStorage.setItem("usuarios", JSON.stringify(usuarios));
   window.location.href = "index.html";
 })