if (!haySesion()) {
  window.location.replace("index.html");
}
function pagina() {
  return {
    abierto: false,
    cargando: true,
    error: "",
    saldo: null,
    juegos: [],
    favoritos: [],
    busqueda: "",
    categoria: "todos",
    orden: "asc",
    menuCategorias: false,
    pendientes: {},     
    entrando: false,         
    avisos: [],             
    contadorAvisos: 0,
    get tipos() {
      const lista = [];
      this.juegos.forEach(function (juego) {
        if (!lista.includes(juego.tipo)) lista.push(juego.tipo);
      });
      return lista.sort();
    },

    get juegosFavoritos() {
      return this.favoritos
        .map((id) => this.juegos.find((juego) => juego.id === id))
        .filter(Boolean);
    },
    get juegosFiltrados() {
      const texto = this.busqueda.trim().toLowerCase();
      return this.juegos
        .filter((juego) => juego.nombre.toLowerCase().includes(texto))
        .filter((juego) => this.categoria === "todos" || juego.tipo === this.categoria)
        .sort((a, b) => this.orden === "asc"
          ? a.nombre.localeCompare(b.nombre)
          : b.nombre.localeCompare(a.nombre));
    },
 
    init() {
      if (!haySesion()) return; 

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
 
    async alternarFavorito(juego) {
      if (this.pendientes[juego.id]) return; 
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

      const correcto = respuesta.ok ||
        (agregar && respuesta.status === 409) ||
        (!agregar && respuesta.status === 404);
 
      if (correcto) {
        this.avisar(juego.nombre + (agregar ? " se agregó a favoritos" : " se quitó de favoritos"), "ok");
        return;
      }
 
      if (agregar) {
        this.favoritos = this.favoritos.filter((id) => id !== juego.id);
      } else {
        this.favoritos.push(juego.id);
      }
      this.avisar(respuesta.error, "error");
    },
 
    async entrar(juego) {
      if (this.entrando) return;
      if (!juego.activo) {
        this.avisar(juego.nombre + " no está disponible por ahora", "error");
        return;
      }
      this.entrando = true;

      const respuesta = await entrarAJuego(juego.id);
 
      if (respuesta.status === 401) {
        window.location.replace("index.html");
        return;
      }
      if (!respuesta.ok) {
        this.entrando = false;
        this.avisar(respuesta.error, "error");
        return;
      }
 
      this.saldo = respuesta.data.saldo;
      window.location.href = "404.html";
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
 
    avisar(mensaje, tipo) {
      const id = ++this.contadorAvisos;
      this.avisos.push({ id: id, mensaje: mensaje, tipo: tipo });
      setTimeout(() => {
        this.avisos = this.avisos.filter((aviso) => aviso.id !== id);
      }, 3500);
    }
  };
}