const formulario = document.getElementById("index-form");
const boton = document.getElementById("index-form-button");

 formulario.addEventListener("input", function () {
   boton.disabled = !formulario.checkValidity();
 });

 formulario.addEventListener("submit", function (evento) {
   evento.preventDefault();

   const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

   const usuario = document.getElementById("usuario").value.trim();
   const contrasena = document.getElementById("contrasena").value;

   const encontrado = usuarios.find(function (usuarioGuardado) {
      return usuarioGuardado.usuario === usuario && usuarioGuardado.contrasena === contrasena;
   });



   if(encontrado) {
      localStorage.setItem("sesion", JSON.stringify({
         usuario: encontrado.usuario,
         rol: encontrado.rol
      }));
      window.location.href = "main.html";
   } else {
      alert("Usuario o contraseña incorrectos");
   }


   
});

