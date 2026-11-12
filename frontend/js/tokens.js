// 1. Proteger la página: sin sesión, de vuelta al login
const sesion = JSON.parse(localStorage.getItem("sesion"));
 
if (!sesion) {
  window.location.replace("index.html");
} else {
  iniciar();
}
 
function iniciar() {
  // Cambia sessionStorage por localStorage si quieres que el dinero
  // sobreviva aunque se cierre la pestaña
  const almacen = sessionStorage;
 
  // Cada usuario tiene su propio saldo e historial
  const claveSaldo = "saldo_" + sesion.usuario;
  const claveHistorial = "historial_" + sesion.usuario;
 
  const textoMonto = document.getElementById("monto");
  const lista = document.getElementById("lista-historial");
 
  let saldo = Number(almacen.getItem(claveSaldo)) || 0;
  let historial = JSON.parse(almacen.getItem(claveHistorial)) || [];
 
  function guardar() {
    almacen.setItem(claveSaldo, saldo);
    almacen.setItem(claveHistorial, JSON.stringify(historial));
  }
 
  function dibujar() {
    textoMonto.textContent = saldo.toLocaleString("es-CL");
 
    lista.textContent = ""; // vacía la lista antes de volver a llenarla
 
    historial.forEach(function (cantidad) {
      const item = document.createElement("li");
 
      const icono = document.createElement("img");
      icono.className = "icono-dolar";
      icono.src = "images/money-icon.png";
      icono.alt = "";
 
      const texto = document.createElement("span");
      texto.textContent = (cantidad > 0 ? "+" : "") + cantidad;
 
      item.append(icono, texto);
      lista.append(item);
    });
  }
 
  function agregar(cantidad) {
    saldo += cantidad;
    historial.unshift(cantidad); // unshift: la acción más reciente queda arriba
    guardar();
    dibujar();
  }
 
  document.querySelectorAll("[data-monto]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      agregar(Number(boton.dataset.monto));
    });
  });
 
  dibujar();
}