// Requiere que api.js se cargue ANTES que este archivo (ver tokens.html).
// Saldo e historial vienen de la API (depositarFichas, retirarFichas,
// obtenerUsuarioActual, obtenerMovimientos), igual que en main.js.

// 1. Proteger la página: sin sesión, de vuelta al login
if (!haySesion()) {
  window.location.replace("index.html");
} else {
  iniciar();
}

function iniciar() {
  const textoMonto = document.getElementById("monto");
  const lista = document.getElementById("lista-historial");
  const botones = document.querySelectorAll("[data-monto]");

  function bloquear(estado) {
    botones.forEach(function (boton) {
      boton.disabled = estado;
    });
  }

  async function dibujar() {
    const [rUsuario, rMovimientos] = await Promise.all([
      obtenerUsuarioActual(),
      obtenerMovimientos({ tipo: "todos", orden: "desc" })
    ]);

    if (rUsuario.status === 401 || rMovimientos.status === 401) {
      window.location.replace("index.html");
      return;
    }
    if (!rUsuario.ok || !rMovimientos.ok) {
      alert(rUsuario.error || rMovimientos.error);
      return;
    }

    textoMonto.textContent = rUsuario.data.saldo.toLocaleString("es-CL");

    lista.textContent = ""; // vacía la lista antes de volver a llenarla

    rMovimientos.data.forEach(function (movimiento) {
      const item = document.createElement("li");

      const icono = document.createElement("img");
      icono.className = "icono-dolar";
      icono.src = "images/money-icon.png";
      icono.alt = "";

      // depósito suma (+); entrada a un juego y retiro restan (-)
      const signo = movimiento.tipo === "deposito" ? "+" : "-";
      const texto = document.createElement("span");
      texto.textContent = signo + movimiento.monto;

      item.append(icono, texto);
      lista.append(item);
    });
  }

  async function agregar(cantidad) {
    bloquear(true); // evita doble clic mientras responde la API

    const respuesta = cantidad > 0
      ? await depositarFichas(cantidad)
      : await retirarFichas(-cantidad);

    if (!respuesta.ok) alert(respuesta.error);

    await dibujar();
    bloquear(false);
  }

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      agregar(Number(boton.dataset.monto));
    });
  });

  dibujar();
}
