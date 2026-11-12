function mostrarSaldo() {
  const sesion = JSON.parse(localStorage.getItem("sesion"));

  if (!sesion) {
    window.location.replace("index.html");
    return;
  }
//IA
  const saldo = Number(sessionStorage.getItem("saldo_" + sesion.usuario)) || 0;
  document.getElementById("saldo").textContent = saldo.toLocaleString("es-CL") + " $";
}

mostrarSaldo();

window.addEventListener("pageshow", mostrarSaldo);
//IA fin