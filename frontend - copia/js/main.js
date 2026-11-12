// Requiere que api.js se cargue ANTES que este archivo (ver main.html).
// Toda la información (saldo, juegos y favoritos) viene de la capa de servicios api.js.

// 1. Proteger la página: sin sesión, de vuelta al login
if (!haySesion()) {
  window.location.replace("index.html");
}

// Estado y acciones de la página, usados con Alpine: x-data="pagina()"
function pagina() {
  return {
    // ----- estado -----
    abierto: false,          // menú lateral abierto o cerrado
    cargando: true,
    error: "",
    saldo: null,
    juegos: [],              // todos los juegos (mocks/juegos.json)
    favoritos: [],           // ids de los juegos favoritos del usuario, en el orden en que se agregaron
    busqueda: "",
    categoria: "todos",      // "todos" o un tipo de juego
    orden: "asc",            // "asc" = A-Z, "desc" = Z-A
    menuCategorias: false,
    pendientes: {},          // favoritos que se están guardando en este momento
    avisos: [],              // mensajes tipo toast
    contadorAvisos: 0,

    // ----- datos derivados -----
    // Categorías disponibles, tomadas de los propios juegos
    get tipos() {
      const lista = [];
      this.juegos.forEach(function (juego) {
        if (!lista.includes(juego.tipo)) lista.push(juego.tipo);
      });
      return lista.sort();
    },

    // Sección de arriba: solo los favoritos. NO les afecta la búsqueda, la categoría ni el orden.
    get juegosFavoritos() {
      return this.favoritos
        .map((id) => this.juegos.find((juego) => juego.id === id))
        .filter(Boolean);
    },

    // Sección de abajo: todos los juegos, con búsqueda, categoría y orden aplicados
    get juegosFiltrados() {
      const texto = this.busqueda.trim().toLowerCase();
      return this.juegos
        .filter((juego) => juego.nombre.toLowerCase().includes(texto))
        .filter((juego) => this.categoria === "todos" || juego.tipo === this.categoria)
        .sort((a, b) => this.orden === "asc"
          ? a.nombre.localeCompare(b.nombre)
          : b.nombre.localeCompare(a.nombre));
    },

    // ----- acciones -----
    init() {
      if (!haySesion()) return; // ya se redirigió arriba

      // Al volver con el botón "atrás", el navegador puede mostrar el saldo viejo guardado en caché
      window.addEventListener("pageshow", (evento) => {
        if (evento.persisted) this.cargarSaldo();
      });

      this.cargar();
    },

    async cargar() {
      this.cargando = true;
      this.error = "";

      const respuestas = await Promise.all([
        obtenerUsuarioActual(),
        obtenerJuegos(),
        obtenerFavoritos()
      ]);
      const [rUsuario, rJuegos, rFavoritos] = respuestas;

      if (respuestas.some((r) => r.status === 401)) {
        window.location.replace("index.html");
        return;
      }
      const fallida = respuestas.find((r) => !r.ok);
      if (fallida) {
        this.error = fallida.error;
        this.cargando = false;
        return;
      }

      this.saldo = rUsuario.data.saldo;
      this.juegos = rJuegos.data;
      this.favoritos = rFavoritos.data
        .sort((a, b) => a.id - b.id)
        .map((favorito) => favorito.juegoId);
      this.cargando = false;
    },

    async cargarSaldo() {
      const respuesta = await obtenerUsuarioActual();
      if (respuesta.status === 401) {
        window.location.replace("index.html");
        return;
      }
      if (respuesta.ok) this.saldo = respuesta.data.saldo;
    },

    esFavorito(juegoId) {
      return this.favoritos.includes(juegoId);
    },

    // Agrega o quita un favorito. La pantalla cambia al instante y, si la API falla, se revierte.
    async alternarFavorito(juego) {
      if (this.pendientes[juego.id]) return; // evita dobles clics mientras responde
      this.pendientes[juego.id] = true;

      const agregar = !this.esFavorito(juego.id);
      if (agregar) {
        this.favoritos.push(juego.id);
      } else {
        this.favoritos = this.favoritos.filter((id) => id !== juego.id);
      }

      const respuesta = agregar
        ? await agregarFavorito(juego.id)
        : await quitarFavorito(juego.id);
      this.pendientes[juego.id] = false;

      if (respuesta.status === 401) {
        window.location.replace("index.html");
        return;
      }

      // 409 = ya estaba agregado y 404 = ya no estaba: el resultado final es el esperado
      const correcto = respuesta.ok ||
        (agregar && respuesta.status === 409) ||
        (!agregar && respuesta.status === 404);

      if (correcto) {
        this.avisar(juego.nombre + (agregar ? " se agregó a favoritos" : " se quitó de favoritos"), "ok");
        return;
      }

      // Falló: se deja todo como estaba
      if (agregar) {
        this.favoritos = this.favoritos.filter((id) => id !== juego.id);
      } else {
        this.favoritos.push(juego.id);
      }
      this.avisar(respuesta.error, "error");
    },

    elegirCategoria(tipo) {
      this.categoria = tipo;
      this.menuCategorias = false;
    },

    limpiarFiltros() {
      this.busqueda = "";
      this.categoria = "todos";
    },

    etiquetaCategoria(tipo) {
      return tipo.charAt(0).toUpperCase() + tipo.slice(1);
    },

    // Muestra un aviso (toast) durante unos segundos
    avisar(mensaje, tipo) {
      const id = ++this.contadorAvisos;
      this.avisos.push({ id: id, mensaje: mensaje, tipo: tipo });
      setTimeout(() => {
        this.avisos = this.avisos.filter((aviso) => aviso.id !== id);
      }, 3500);
    }
  };
}
