- **Fecha:** 2026-11-12
- **Integrante:** Jesús (@ijexu)
- **Herramienta y modelo:** Claude
- **Archivos afectados:** main.html y main.js

## Objetivo
Que los botones de cada juego te descuenten de los fondos(tokens) que tenga el usuario
## Conversación (texto completo, sin editar)

### Prompt 1
Ayudame a crear lo necesario que al apretar un juego se descuente de los fondos la apuesta minima de este (respuesta nueva y desde cero)

### respuesta
1. El cobro: api.js

No hay que escribir nada, porque tu api.js ya trae entrarAJuego(juegoId). Esa función:

comprueba que haya sesión y que el juego exista y esté activo,
toma apuestaMinima del juego (si no le pasas un monto),
rechaza con error 402 si el saldo no alcanza,
resta la apuesta del saldo y la guarda en el historial de movimientos,
devuelve { ok, status, data: { movimiento, saldo }, error }.
2. El clic: main.html

Hay que hacer clicable el icono de la tarjeta. Aparece dos veces (Favoritos y Juegos); reemplaza esta línea en ambos lugares:

html
<div class="tarjeta-icono" aria-hidden="true" x-text="juego.icono"></div>

por esta:

html
<div class="tarjeta-icono" role="button" tabindex="0"
     @click="entrar(juego)" @keydown.enter="entrar(juego)"
     :aria-label="'Jugar ' + juego.nombre"
     :aria-disabled="!juego.activo"
     style="cursor:pointer" x-text="juego.icono"></div>
3. La acción: js/main.js

Dentro de pagina(), agrega el estado junto a pendientes:

js
entrando: false,   // evita dobles clics mientras se cobra

y la acción, por ejemplo antes de elegirCategoria:

js
async entrar(juego) {
  if (this.entrando) return;
  if (!juego.activo) {
    this.avisar(juego.nombre + " no está disponible por ahora", "error");
    return;
  }
  this.entrando = true;

  const respuesta = await entrarAJuego(juego.id);   // descuenta la apuesta mínima

  if (respuesta.status === 401) {                   // sesión vencida
    window.location.replace("index.html");
    return;
  }
  if (!respuesta.ok) {                              // saldo insuficiente, falla, etc.
    this.entrando = false;
    this.avisar(respuesta.error, "error");
    return;
  }

  this.saldo = respuesta.data.saldo;                // refresca el saldo en pantalla
  window.location.href = "404.html";                // destino por ahora
},
4. Los datos: mocks/juegos.json

Cada juego necesita estos campos, con estos nombres exactos:

json
{ "id": 1, "nombre": "Baccarat", "activo": true,
  "apuestaMinima": 500, "apuestaMaxima": 50000, ... }

Si falta apuestaMinima o apuestaMaxima, entrarAJuego devuelve un error en vez de cobrar.

Para probarlo
Abre el proyecto con un servidor local (Live Server), no con doble clic.
Los usuarios nuevos parten con saldo 0, así que deposita fichas desde la página de tokens primero.
Si ves datos viejos después de cambiar los mocks, ejecuta restablecerDatos() en la consola del navegador. La API guarda todo en localStorage.
Aprieta un juego: el saldo baja y llegas a 404.html. Al volver, el saldo ya está descontado.