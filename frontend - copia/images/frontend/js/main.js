// Requiere que api.js se cargue ANTES que este archivo (ver main.html).
// El saldo sale de la API (obtenerUsuarioActual), la MISMA fuente que usa tokens.js,
// así que ambas páginas siempre muestran la misma cifra.

// 1. Proteger la página: sin sesión, de vuelta al login
if (!haySesion()) {
  window.location.replace("index.html");
} else {
  iniciar();
}

function iniciar() {
  const textoSaldo = document.getElementById("saldo");

  async function mostrarSaldo() {
    const respuesta = await obtenerUsuarioActual();

    if (respuesta.status === 401) {
      window.location.replace("index.html");
      return;
    }
    if (!respuesta.ok) {
      alert(respuesta.error);
      return;
    }

    textoSaldo.textContent = respuesta.data.saldo.toLocaleString("es-CL") + " $";
  }

  mostrarSaldo();

  // Al volver desde tokens.html con el botón "atrás", el navegador puede mostrar
  // la página guardada en caché con el saldo viejo: se vuelve a pedir.
  window.addEventListener("pageshow", function (evento) {
    if (evento.persisted) mostrarSaldo();
  });
}
