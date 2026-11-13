- **Fecha:** 2026-11-12
- **Integrante:** Jesús (@ijexu)
- **Herramienta y modelo:** Claude
- **Archivos afectados:** main.html y main.css

## Objetivo
Convertir todo el codigo de tailwind a css normal para ser mas manejable y entendible para quien lo edite (yo en este caso).
## Conversación (texto completo, sin editar)

### Prompt 1
codigo de main.html con tailwind, pasalo a html normal con un css normal
### codigo :
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casino · Juegos</title>
    <script src="https://cdn.tailwindcss.com/3.4.17"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
    <style>[x-cloak] { display: none !important; }</style>
</head>

<body class="bg-white text-black" style="font-family: sans-serif;">

<!-- Todo el estado de la página vive en pagina() (js/main.js) -->
<div x-data="pagina()" class="min-h-screen">

    <!-- Fondo oscuro para cerrar el menú en móvil -->
    <div x-show="abierto" x-cloak @click="abierto = false"
         class="fixed inset-0 z-20 bg-black/40 md:hidden" aria-hidden="true"></div>

    <!-- ============ MENÚ LATERAL DESPLEGABLE ============ -->
    <aside id="menu-lateral"
           class="fixed inset-y-0 left-0 z-30 bg-[#820000] transition-all duration-200"
           :class="abierto ? 'w-64' : 'w-14'">

        <nav x-show="abierto" x-cloak aria-label="Menú principal" class="flex flex-col gap-2 p-2">
            <a href="config.html"
               class="flex items-center gap-3 rounded-lg bg-[#a20e0e] px-3 py-3 text-sm font-bold uppercase text-white hover:bg-[#FF8B8B] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <img src="images/config-icon.png" alt="" class="h-8 w-8 object-contain">
                Configuración
            </a>
            <a href="tokens.html"
               class="flex items-center gap-3 rounded-lg bg-[#a20e0e] px-3 py-3 text-sm font-bold uppercase text-white hover:bg-[#FF8B8B] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <img src="images/token-icon.png" alt="" class="h-8 w-8 object-contain">
                Tokens
            </a>
        </nav>

        <!-- Flecha para abrir y cerrar el menú -->
        <button type="button" @click="abierto = !abierto"
                :aria-expanded="abierto" aria-controls="menu-lateral"
                :aria-label="abierto ? 'Cerrar menú' : 'Abrir menú'"
                class="absolute right-1 top-1/2 grid h-12 w-9 -translate-y-1/2 place-items-center rounded-md bg-[#a20e0e] text-white hover:bg-[#FF8B8B] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <svg class="h-5 w-5 transition-transform" :class="abierto ? 'rotate-180' : ''"
                 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6 3.5v13l9-6.5z"/>
            </svg>
        </button>
    </aside>

    <!-- ============ CONTENIDO ============ -->
    <div class="pl-14 transition-all duration-200" :class="abierto ? 'md:pl-64' : ''">

        <header class="flex h-[4.5rem] items-center justify-end gap-4 bg-[#a20e0e] px-4 text-white">
            <a href="tokens.html" title="Ir a mis fichas"
               class="text-2xl font-bold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <span x-text="saldo === null ? '$ …' : '$ ' + saldo.toLocaleString('es-CL')"></span>
            </a>
            <a href="config.html" class="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <img src="images/profile-icon.png" alt="Ir a mi perfil"
                     class="h-14 w-14 rounded-full bg-[#c9d1db] object-cover">
            </a>
        </header>

        <main class="min-h-screen px-4 pb-10 bg-cover bg-center bg-no-repeat bg-[url('images/backgroundcasinoff.png')]">
            <h1 class="sr-only">Casino: juegos</h1>

            <!-- Estado de error, con opción de reintentar -->
            <div x-show="error" x-cloak role="alert"
                 class="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#a20e0e] bg-[#FFDEDE] p-4 text-[#820000]">
                <p class="flex-1 font-bold" x-text="error"></p>
                <button type="button" @click="cargar()"
                        class="rounded-lg bg-[#a20e0e] px-4 py-2 font-bold text-white hover:bg-[#820000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#820000]">
                    Reintentar
                </button>
            </div>

            <div x-show="!error">

                <!-- ============ FAVORITOS  ============ -->
                <section aria-labelledby="titulo-favoritos" :aria-busy="cargando" class="pt-4">
                    <h2 id="titulo-favoritos" class="border-b-2 border-white pb-1 text-lg font-bold" text-white>Favoritos</h2>

                    <div class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
                        <!-- Cargando -->
                        <template x-for="i in (cargando ? 3 : 0)" :key="'sk-fav-' + i">
                            <div class="h-36 animate-pulse rounded-lg bg-[#c9d1db]"></div>
                        </template>

                        <!-- Tarjetas -->
                        <template x-for="juego in juegosFavoritos" :key="juego.id">
                            <article class="flex min-h-[9rem] flex-col rounded-lg bg-[#c9d1db]" :class="juego.activo ? '' : 'opacity-60'">
                                <div class="flex flex-1 items-center justify-center text-5xl" aria-hidden="true" x-text="juego.icono"></div>
                                <div class="flex items-end justify-between gap-1 p-2">
                                    <div class="min-w-0">
                                        <h3 class="text-sm font-bold leading-tight" x-text="juego.nombre"></h3>
                                        <p x-show="!juego.activo" class="text-xs font-semibold text-[#820000]">No disponible</p>
                                    </div>
                                    <button type="button" @click="alternarFavorito(juego)"
                                            :aria-pressed="esFavorito(juego.id)"
                                            :aria-label="'Quitar ' + juego.nombre + ' de favoritos'"
                                            class="shrink-0 text-3xl leading-none text-[#a20e0e] transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                            x-text="'★'"></button>
                                </div>
                            </article>
                        </template>
                    </div>

                    <!-- Vacío -->
                    <p x-show="!cargando && juegosFavoritos.length === 0" x-cloak class="mt-4 text-white">
                        Aún no tienes favoritos. Toca la estrella ☆ de un juego para agregarlo aquí.
                    </p>
                </section>

                <!-- ============ TODOS LOS JUEGOS ============ -->
                <section aria-labelledby="titulo-juegos" :aria-busy="cargando" class="pt-6">
                    <h2 id="titulo-juegos" class="text-lg font-bold" text-white>Juegos</h2>

                    <div class="mt-2 flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3">
                        <!-- Búsqueda -->
                        <div class="w-full sm:w-72">
                            <label for="busqueda" class="sr-only">Buscar juego</label>
                            <input id="busqueda" type="search" x-model="busqueda" placeholder="BÚSQUEDA" autocomplete="off"
                                   class="w-full rounded-full bg-[#a20e0e] px-5 py-2 font-bold text-white placeholder-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#820000]">
                        </div>

                        <div class="flex items-center gap-2">
                            <!-- Categorías -->
                            <div class="relative" @keydown.escape="menuCategorias = false" @click.outside="menuCategorias = false">
                                <button type="button" @click="menuCategorias = !menuCategorias"
                                        :aria-expanded="menuCategorias" aria-haspopup="true"
                                        class="flex items-center gap-2 rounded-full bg-[#a20e0e] px-5 py-2 font-bold text-white hover:bg-[#820000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#820000]">
                                    <span x-text="'Categoría: ' + (categoria === 'todos' ? 'Todas' : etiquetaCategoria(categoria))"></span>
                                    <span aria-hidden="true" class="text-xs">▼</span>
                                </button>

                                <div x-show="menuCategorias" x-cloak x-transition
                                     class="absolute right-0 z-10 mt-2 w-56 overflow-hidden rounded-lg border border-white/10 bg-[#0D0C1E] py-1 shadow-xl">
                                    <button type="button" @click="elegirCategoria('todos')"
                                            class="w-full px-4 py-2 text-left text-sm hover:bg-[#FF8B8B] hover:text-black"
                                            :class="categoria === 'todos' ? 'font-bold text-[#F0C32C]' : 'text-white'">
                                        Todas las categorías
                                    </button>
                                    <template x-for="tipo in tipos" :key="tipo">
                                        <button type="button" @click="elegirCategoria(tipo)"
                                                class="w-full px-4 py-2 text-left text-sm hover:bg-[#FF8B8B] hover:text-black"
                                                :class="categoria === tipo ? 'font-bold text-[#F0C32C]' : 'text-white'"
                                                x-text="etiquetaCategoria(tipo)"></button>
                                    </template>
                                </div>
                            </div>

                            <!-- Orden A-Z / Z-A -->
                            <button type="button" @click="orden = (orden === 'asc' ? 'desc' : 'asc')"
                                    :aria-label="'Orden ' + (orden === 'asc' ? 'A a Z' : 'Z a A') + '. Tocar para invertir'"
                                    class="rounded-full bg-[#a20e0e] px-5 py-2 font-bold text-white hover:bg-[#820000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#820000]"
                                    x-text="orden === 'asc' ? 'A-Z' : 'Z-A'"></button>
                        </div>
                    </div>

                    <div class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
                        <!-- Cargando -->
                        <template x-for="i in (cargando ? 8 : 0)" :key="'sk-juego-' + i">
                            <div class="h-36 animate-pulse rounded-lg bg-[#c9d1db]"></div>
                        </template>

                        <!-- Tarjetas -->
                        <template x-for="juego in juegosFiltrados" :key="juego.id">
                            <article class="flex min-h-[9rem] flex-col rounded-lg bg-[#c9d1db]" :class="juego.activo ? '' : 'opacity-60'">
                                <div class="flex flex-1 items-center justify-center text-5xl" aria-hidden="true" x-text="juego.icono"></div>
                                <div class="flex items-end justify-between gap-1 p-2">
                                    <div class="min-w-0">
                                        <h3 class="text-sm font-bold leading-tight" x-text="juego.nombre"></h3>
                                        <p x-show="!juego.activo" class="text-xs font-semibold text-[#820000]">No disponible</p>
                                    </div>
                                    <button type="button" @click="alternarFavorito(juego)"
                                            :aria-pressed="esFavorito(juego.id)"
                                            :aria-label="(esFavorito(juego.id) ? 'Quitar ' : 'Agregar ') + juego.nombre + (esFavorito(juego.id) ? ' de favoritos' : ' a favoritos')"
                                            class="shrink-0 text-3xl leading-none transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                            :class="esFavorito(juego.id) ? 'text-[#a20e0e]' : 'text-black/60 hover:text-[#a20e0e]'"
                                            x-text="esFavorito(juego.id) ? '★' : '☆'"></button>
                                </div>
                            </article>
                        </template>
                    </div>

                    <!-- Vacío -->
                    <div x-show="!cargando && juegosFiltrados.length === 0" x-cloak class="mt-4 text-gray-700">
                        <p>No se encontraron juegos con esos filtros.</p>
                        <button type="button" @click="limpiarFiltros()"
                                class="mt-2 rounded-full bg-[#a20e0e] px-4 py-2 font-bold text-white hover:bg-[#820000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#820000]">
                            Limpiar filtros
                        </button>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <!-- Avisos (toasts) -->
    <div class="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col gap-2" role="status" aria-live="polite">
        <template x-for="aviso in avisos" :key="aviso.id">
            <div class="rounded-lg px-4 py-3 text-sm font-bold text-white shadow-lg"
                 :class="aviso.tipo === 'error' ? 'bg-[#b00020]' : 'bg-[#1f6f3a]'" x-text="aviso.mensaje"></div>
        </template>
    </div>
</div>

### Respuesta 1: 
Listo: main.html ahora no usa Tailwind y todo el estilo está en styles/main.css. Guarda el CSS en styles/ junto a tus otros estilos y el HTML en la raíz, como antes.

Alpine se mantiene: el menú, los filtros, los favoritos y los avisos siguen funcionando igual, así que js/main.js no cambia.
Clases dinámicas: donde Tailwind alternaba clases con :class (menú abierto, favorito activo, tarjeta no disponible, etc.), ahora se alternan clases propias como menu-lateral--abierto o btn-favorito--activo.
Imagen de fondo: en el CSS la ruta es ../images/backgroundcasinoff.png, porque es relativa a la carpeta styles/.
Títulos blancos: en tu código original text-white estaba escrito fuera del atributo class en los h2 de “Favoritos” y “Juegos”, así que nunca se aplicaba y esos títulos salían negros. Como el resto de ese bloque usa blanco, los dejé blancos. Si los prefieres negros, quita color: #fff; de la regla .seccion h2.

# html:
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casino · Juegos</title>
    <link rel="stylesheet" href="styles/main.css">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
</head>

<body>

<!-- Todo el estado de la página vive en pagina() (js/main.js) -->
<div x-data="pagina()" class="pagina">

    <!-- Fondo oscuro para cerrar el menú en móvil -->
    <div x-show="abierto" x-cloak @click="abierto = false"
         class="fondo-menu" aria-hidden="true"></div>

    <!-- ============ MENÚ LATERAL DESPLEGABLE ============ -->
    <aside id="menu-lateral" class="menu-lateral" :class="abierto ? 'menu-lateral--abierto' : ''">

        <nav x-show="abierto" x-cloak aria-label="Menú principal" class="menu-nav">
            <a href="config.html" class="menu-enlace">
                <img src="images/config-icon.png" alt="">
                Configuración
            </a>
            <a href="tokens.html" class="menu-enlace">
                <img src="images/token-icon.png" alt="">
                Tokens
            </a>
        </nav>

        <!-- Flecha para abrir y cerrar el menú -->
        <button type="button" @click="abierto = !abierto"
                :aria-expanded="abierto" aria-controls="menu-lateral"
                :aria-label="abierto ? 'Cerrar menú' : 'Abrir menú'"
                class="menu-flecha">
            <svg :class="abierto ? 'girada' : ''" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6 3.5v13l9-6.5z"/>
            </svg>
        </button>
    </aside>

    <!-- ============ CONTENIDO ============ -->
    <div class="contenido" :class="abierto ? 'contenido--menu-abierto' : ''">

        <header class="cabecera">
            <a href="tokens.html" title="Ir a mis fichas" class="cabecera-saldo">
                <span x-text="saldo === null ? '$ …' : '$ ' + saldo.toLocaleString('es-CL')"></span>
            </a>
            <a href="config.html" class="cabecera-perfil">
                <img src="images/profile-icon.png" alt="Ir a mi perfil">
            </a>
        </header>

        <main class="principal">
            <h1 class="sr-only">Casino: juegos</h1>

            <!-- Estado de error, con opción de reintentar -->
            <div x-show="error" x-cloak role="alert" class="error">
                <p x-text="error"></p>
                <button type="button" @click="cargar()" class="btn-rojo btn-cuadrado">
                    Reintentar
                </button>
            </div>

            <div x-show="!error">

                <!-- ============ FAVORITOS ============ -->
                <section aria-labelledby="titulo-favoritos" :aria-busy="cargando" class="seccion seccion--favoritos">
                    <h2 id="titulo-favoritos">Favoritos</h2>

                    <div class="grilla">
                        <!-- Cargando -->
                        <template x-for="i in (cargando ? 3 : 0)" :key="'sk-fav-' + i">
                            <div class="esqueleto"></div>
                        </template>

                        <!-- Tarjetas -->
                        <template x-for="juego in juegosFavoritos" :key="juego.id">
                            <article class="tarjeta" :class="juego.activo ? '' : 'tarjeta--inactiva'">
                                <div class="tarjeta-icono" aria-hidden="true" x-text="juego.icono"></div>
                                <div class="tarjeta-pie">
                                    <div class="tarjeta-info">
                                        <h3 x-text="juego.nombre"></h3>
                                        <p x-show="!juego.activo" class="tarjeta-aviso">No disponible</p>
                                    </div>
                                    <button type="button" @click="alternarFavorito(juego)"
                                            :aria-pressed="esFavorito(juego.id)"
                                            :aria-label="'Quitar ' + juego.nombre + ' de favoritos'"
                                            class="btn-favorito btn-favorito--activo"
                                            x-text="'★'"></button>
                                </div>
                            </article>
                        </template>
                    </div>

                    <!-- Vacío -->
                    <p x-show="!cargando && juegosFavoritos.length === 0" x-cloak class="texto-vacio">
                        Aún no tienes favoritos. Toca la estrella ☆ de un juego para agregarlo aquí.
                    </p>
                </section>

                <!-- ============ TODOS LOS JUEGOS ============ -->
                <section aria-labelledby="titulo-juegos" :aria-busy="cargando" class="seccion seccion--juegos">
                    <h2 id="titulo-juegos">Juegos</h2>

                    <div class="herramientas">
                        <!-- Búsqueda -->
                        <div class="busqueda">
                            <label for="busqueda" class="sr-only">Buscar juego</label>
                            <input id="busqueda" type="search" x-model="busqueda" placeholder="BÚSQUEDA" autocomplete="off">
                        </div>

                        <div class="acciones">
                            <!-- Categorías -->
                            <div class="categorias" @keydown.escape="menuCategorias = false" @click.outside="menuCategorias = false">
                                <button type="button" @click="menuCategorias = !menuCategorias"
                                        :aria-expanded="menuCategorias" aria-haspopup="true"
                                        class="btn-rojo btn-pildora categorias-boton">
                                    <span x-text="'Categoría: ' + (categoria === 'todos' ? 'Todas' : etiquetaCategoria(categoria))"></span>
                                    <span aria-hidden="true" class="flecha">▼</span>
                                </button>

                                <div x-show="menuCategorias" x-cloak x-transition class="categorias-menu">
                                    <button type="button" @click="elegirCategoria('todos')"
                                            class="categorias-opcion"
                                            :class="categoria === 'todos' ? 'categorias-opcion--activa' : ''">
                                        Todas las categorías
                                    </button>
                                    <template x-for="tipo in tipos" :key="tipo">
                                        <button type="button" @click="elegirCategoria(tipo)"
                                                class="categorias-opcion"
                                                :class="categoria === tipo ? 'categorias-opcion--activa' : ''"
                                                x-text="etiquetaCategoria(tipo)"></button>
                                    </template>
                                </div>
                            </div>

                            <!-- Orden A-Z / Z-A -->
                            <button type="button" @click="orden = (orden === 'asc' ? 'desc' : 'asc')"
                                    :aria-label="'Orden ' + (orden === 'asc' ? 'A a Z' : 'Z a A') + '. Tocar para invertir'"
                                    class="btn-rojo btn-pildora"
                                    x-text="orden === 'asc' ? 'A-Z' : 'Z-A'"></button>
                        </div>
                    </div>

                    <div class="grilla">
                        <!-- Cargando -->
                        <template x-for="i in (cargando ? 8 : 0)" :key="'sk-juego-' + i">
                            <div class="esqueleto"></div>
                        </template>

                        <!-- Tarjetas -->
                        <template x-for="juego in juegosFiltrados" :key="juego.id">
                            <article class="tarjeta" :class="juego.activo ? '' : 'tarjeta--inactiva'">
                                <div class="tarjeta-icono" aria-hidden="true" x-text="juego.icono"></div>
                                <div class="tarjeta-pie">
                                    <div class="tarjeta-info">
                                        <h3 x-text="juego.nombre"></h3>
                                        <p x-show="!juego.activo" class="tarjeta-aviso">No disponible</p>
                                    </div>
                                    <button type="button" @click="alternarFavorito(juego)"
                                            :aria-pressed="esFavorito(juego.id)"
                                            :aria-label="(esFavorito(juego.id) ? 'Quitar ' : 'Agregar ') + juego.nombre + (esFavorito(juego.id) ? ' de favoritos' : ' a favoritos')"
                                            class="btn-favorito"
                                            :class="esFavorito(juego.id) ? 'btn-favorito--activo' : ''"
                                            x-text="esFavorito(juego.id) ? '★' : '☆'"></button>
                                </div>
                            </article>
                        </template>
                    </div>

                    <!-- Vacío -->
                    <div x-show="!cargando && juegosFiltrados.length === 0" x-cloak class="sin-resultados">
                        <p>No se encontraron juegos con esos filtros.</p>
                        <button type="button" @click="limpiarFiltros()" class="btn-rojo btn-cuadrado">
                            Limpiar filtros
                        </button>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <!-- Avisos (toasts) -->
    <div class="avisos" role="status" aria-live="polite">
        <template x-for="aviso in avisos" :key="aviso.id">
            <div class="aviso"
                 :class="aviso.tipo === 'error' ? 'aviso--error' : 'aviso--ok'" x-text="aviso.mensaje"></div>
        </template>
    </div>
</div>

<script src="js/api.js"></script>
<script src="js/main.js"></script>
</body>
</html>

# css:
n · CSS
/* ============ BASE (lo que Tailwind hacía por defecto) ============ */
*, *::before, *::after { box-sizing: border-box; }
 
body, h1, h2, h3, p { margin: 0; }
 
body {
    background: #fff;
    color: #000;
    font-family: sans-serif;
}
 
a { color: inherit; text-decoration: none; }
 
img, svg { display: block; }
 
button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
}
 
input {
    font: inherit;
    border: 0;
    -webkit-appearance: none;
    appearance: none;
}
 
[x-cloak] { display: none !important; }
 
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
 
/* Foco visible */
:focus-visible {
    outline: 2px solid var(--foco, #820000);
    outline-offset: 2px;
}
 
/* ============ PÁGINA ============ */
.pagina { min-height: 100vh; }
 
/* Fondo oscuro para cerrar el menú en móvil */
.fondo-menu {
    position: fixed;
    inset: 0;
    z-index: 20;
    background: rgba(0, 0, 0, 0.4);
}
 
@media (min-width: 768px) {
    .fondo-menu { display: none; }
}
 
/* ============ MENÚ LATERAL ============ */
.menu-lateral {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 30;
    width: 3.5rem;
    background: #820000;
    transition: all 0.2s;
}
 
.menu-lateral--abierto { width: 16rem; }
 
.menu-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
}
 
.menu-enlace {
    --foco: #fff;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: #a20e0e;
    color: #fff;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
}
 
.menu-enlace:hover { background: #FF8B8B; color: #000; }
 
.menu-enlace img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
}
 
.menu-flecha {
    --foco: #fff;
    position: absolute;
    right: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 3rem;
    border-radius: 0.375rem;
    background: #a20e0e;
    color: #fff;
}
 
.menu-flecha:hover { background: #FF8B8B; color: #000; }
 
.menu-flecha svg {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.15s;
}
 
.menu-flecha svg.girada { transform: rotate(180deg); }
 
/* ============ CONTENIDO ============ */
.contenido {
    padding-left: 3.5rem;
    transition: all 0.2s;
}
 
@media (min-width: 768px) {
    .contenido--menu-abierto { padding-left: 16rem; }
}
 
.cabecera {
    --foco: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    height: 4.5rem;
    padding: 0 1rem;
    background: #a20e0e;
    color: #fff;
}
 
.cabecera-saldo {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
}
 
.cabecera-saldo:hover { text-decoration: underline; }
 
.cabecera-perfil { border-radius: 9999px; }
 
.cabecera-perfil img {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 9999px;
    background: #c9d1db;
    object-fit: cover;
}
 
.principal {
    min-height: 100vh;
    padding: 0 1rem 2.5rem;
    background-image: url('../images/backgroundcasinoff.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
 
/* ============ BOTONES ROJOS ============ */
.btn-rojo {
    background: #a20e0e;
    color: #fff;
    font-weight: 700;
}
 
.btn-rojo:hover { background: #820000; }
 
.btn-pildora {
    border-radius: 9999px;
    padding: 0.5rem 1.25rem;
}
 
.btn-cuadrado {
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
}
 
/* ============ ERROR ============ */
.error {
    --foco: #820000;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #a20e0e;
    border-radius: 0.5rem;
    background: #FFDEDE;
    color: #820000;
}
 
.error p { flex: 1; font-weight: 700; }
 
/* ============ SECCIONES ============ */
.seccion { padding-top: 1rem; }
.seccion--juegos { padding-top: 1.5rem; }
 
.seccion h2 {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 700;
    color: #fff;
}
 
.seccion--favoritos h2 {
    padding-bottom: 0.25rem;
    border-bottom: 2px solid #fff;
}
 
.texto-vacio {
    margin-top: 1rem;
    color: #fff;
}
 
/* ============ TARJETAS ============ */
.grilla {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}
 
.esqueleto {
    height: 9rem;
    border-radius: 0.5rem;
    background: #c9d1db;
    animation: pulso 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
 
@keyframes pulso {
    50% { opacity: 0.5; }
}
 
.tarjeta {
    display: flex;
    flex-direction: column;
    min-height: 9rem;
    border-radius: 0.5rem;
    background: #c9d1db;
}
 
.tarjeta--inactiva { opacity: 0.6; }
 
.tarjeta-icono {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    line-height: 1;
}
 
.tarjeta-pie {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.25rem;
    padding: 0.5rem;
}
 
.tarjeta-info { min-width: 0; }
 
.tarjeta-info h3 {
    font-size: 0.875rem;
    line-height: 1.25;
    font-weight: 700;
}
 
.tarjeta-aviso {
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 600;
    color: #820000;
}
 
.btn-favorito {
    --foco: #000;
    flex-shrink: 0;
    font-size: 1.875rem;
    line-height: 1;
    color: rgba(0, 0, 0, 0.6);
    transition: transform 0.15s, color 0.15s;
}
 
.btn-favorito:hover { transform: scale(1.1); color: #a20e0e; }
 
.btn-favorito--activo { color: #a20e0e; }
 
/* ============ BARRA DE HERRAMIENTAS ============ */
.herramientas {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #000;
}
 
.busqueda { width: 100%; }
 
@media (min-width: 640px) {
    .busqueda { width: 18rem; }
}
 
.busqueda input {
    width: 100%;
    border-radius: 9999px;
    background: #a20e0e;
    padding: 0.5rem 1.25rem;
    color: #fff;
    font-weight: 700;
}
 
.busqueda input::placeholder { color: rgba(255, 255, 255, 0.8); }
 
.acciones {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
 
/* Categorías */
.categorias { position: relative; }
 
.categorias-boton {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
 
.categorias-boton .flecha {
    font-size: 0.75rem;
    line-height: 1rem;
}
 
.categorias-menu {
    position: absolute;
    right: 0;
    z-index: 10;
    width: 14rem;
    margin-top: 0.5rem;
    padding: 0.25rem 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    background: #0D0C1E;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
 
.categorias-opcion {
    width: 100%;
    padding: 0.5rem 1rem;
    text-align: left;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #fff;
}
 
.categorias-opcion--activa { font-weight: 700; color: #F0C32C; }
 
.categorias-opcion:hover { background: #FF8B8B; color: #000; }
 
/* ============ SIN RESULTADOS ============ */
.sin-resultados {
    margin-top: 1rem;
    color: #374151;
}
 
.sin-resultados button {
    margin-top: 0.5rem;
    border-radius: 9999px;
}
 
/* ============ AVISOS (TOASTS) ============ */
.avisos {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 40;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: calc(100vw - 2rem);
}
 
.aviso {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    color: #fff;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 700;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}
 
.aviso--error { background: #b00020; }
.aviso--ok { background: #1f6f3a; }




