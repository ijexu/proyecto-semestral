# Casino Red label

Aplicación web de un casino en línea simulado. Los usuarios se registran (solo mayores de 18 años), inician sesión, administran sus fichas y su historial, exploran un catálogo de juegos con búsqueda, filtro por categoría y orden, marcan favoritos y editan su perfil.

No hay backend ni base de datos: todos los datos vienen de archivos mock a través de una capa de servicios (`js/api.js`) que imita una API REST.

Proyecto del curso Desarrollo Web y Móvil (CIT2008), segundo semestre 2026. **Entrega 2: frontend avanzado con datos simulados.**

## Integrantes

| Nombre | Usuario GitHub |
|---|---|
| Alvaro Zavala | [@Ashenkn](https://github.com/Ashenkn) |
| Jesús Labraña | [@ijexu](https://github.com/ijexu) |

## Tecnologías y librerías

| Tecnología | Uso | Cómo se incluye |
|---|---|---|
| HTML5, CSS3 y JavaScript | Base de todo el proyecto | Archivos propios en `js/` y `styles/` |
| Tailwind CSS 3.4.17 | Estilos de `main.html` | CDN (`cdn.tailwindcss.com/3.4.17`) |
| Alpine.js 3.14.8 | Estado, listas, menú, dropdown y avisos de `main.html` | CDN (jsDelivr) |
| localStorage | Persistencia de usuarios, sesión, favoritos y movimientos | API del navegador |

- Las vistas `index.html`, `register.html`, `tokens.html` y `config.html` usan CSS propio con la paleta del proyecto definida como variables (`styles/`).
- No usa Node.js ni npm: no hay `npm install`. Todo se ejecuta con un servidor estático.

## Requisitos

- Navegador moderno (Chrome, Firefox o Edge).
- Conexión a internet, para cargar Tailwind y Alpine desde CDN.
- **Una** de estas opciones para servir los archivos: la extensión **Live Server** de VS Code, o Python 3.

> **Importante:** no abrir `index.html` con doble clic ni con `start index.html` (`file://`). El navegador bloquea `fetch` sobre archivos locales y los mocks no cargan. Siempre hay que usar un servidor local.

## Instalación y ejecución

1. Clonar el repositorio y entrar a la carpeta del frontend:
   ```bash
   git clone https://github.com/ijexu/proyecto-semestral.git
   cd proyecto-semestral/frontend
   ```
2. Levantar un servidor local con **una** de estas opciones:
   - **Live Server:** abrir la carpeta `frontend` en VS Code, clic derecho sobre `index.html` y elegir *Open with Live Server*.
   - **Python:** ejecutar `python3 -m http.server 5500` dentro de `frontend` y abrir <http://localhost:5500>.
3. Iniciar sesión con una de las credenciales de prueba.

## Credenciales de prueba

| Usuario | Contraseña | Saldo inicial |
|---|---|---|
| `usuario` | `1234` | 1000 |
| `camilo` | `abcd1234` | 2500 |

El proyecto no tiene rol de administrador. También se puede crear una cuenta en `register.html` (con 18 años o más; empieza con saldo 0).

## Vistas disponibles

| Vista | Archivo | Cómo llegar | Acceso |
|---|---|---|---|
| Iniciar sesión | `index.html` | Página de entrada | Público |
| Registro | `register.html` | Enlace "¡Regístrate!" en el login | Público |
| Inicio: saldo, favoritos y juegos | `main.html` | Se abre al iniciar sesión | Con sesión |
| Fichas e historial | `tokens.html` | Menú lateral → Tokens, o clic en el saldo | Con sesión |
| Configuración y perfil | `config.html` | Menú lateral → Configuración, o clic en la foto de perfil | Con sesión |

Las vistas con sesión redirigen a `index.html` si no hay sesión activa.

## Funcionalidades

- **Sesión:** login, cierre de sesión (`config.html` → Cerrar sesión) y protección de vistas privadas.
- **Juegos (`main.html`):** búsqueda por nombre, filtro por categoría (menú desplegable) y orden A-Z / Z-A.
- **Favoritos:** agregar y quitar con la estrella; el cambio se ve al instante y se revierte si la API falla.
- **Fichas (`tokens.html`):** depósito de fichas con actualización inmediata del saldo e historial de movimientos.
- **Perfil (`config.html`):** editar usuario, nombre, apellido, correo y contraseña; ver u ocultar la contraseña; eliminar la cuenta (con confirmación), que borra también sus favoritos y movimientos.
- **Componentes de interfaz:** menú lateral desplegable, menú desplegable de categorías, avisos (toasts) y pestañas Usuario / General en la configuración.
- **Estados de la interfaz en `main.html`:** cargando (skeleton), vacío (sin favoritos o sin resultados, con botón "Limpiar filtros") y error con botón "Reintentar".
- **Persistencia:** los cambios (cuentas, perfil, favoritos, fichas) se mantienen al recargar.

## Datos simulados y persistencia

- Los mocks están en `mocks/`: `usuarios.json`, `juegos.json` (12 registros, recurso principal), `favoritos.json` y `movimientos.json`.
- La primera vez que se pide un recurso, `js/api.js` lo carga desde `mocks/` y lo copia a `localStorage` (claves con prefijo `casino_v2_`). Desde entonces se lee y escribe ahí.
- Las vistas **nunca** leen los JSON ni `localStorage` directamente: siempre llaman a las funciones de `js/api.js`.
- Para volver a los datos originales, ejecutar `restablecerDatos()` en la consola del navegador y recargar.

### Formato de respuesta

Todas las funciones son asíncronas, simulan una latencia aleatoria de 300 a 800 ms y no lanzan excepciones: devuelven siempre el mismo formato.

```js
{ ok: true,  status: 200, data: { ... }, error: null }
{ ok: false, status: 401, data: null,    error: "Debes iniciar sesión." }
```

### Forzar errores

- Agregar `?fallar=1` a la URL de la página (por ejemplo `main.html?fallar=1`): las llamadas fallan con un 500 simulado y se ve el estado de error con "Reintentar".
- O ejecutar `configurarFalla(0.3)` en la consola para que falle el 30 % de las llamadas (`configurarFalla(0)` lo desactiva).

## Endpoints simulados

La columna "Se usa en" indica la vista que ya consume la función; "—" significa que está disponible en la capa de servicios pero aún no tiene pantalla.

| Función | Método | Ruta equivalente | Descripción | Se usa en |
|---|---|---|---|---|
| `registrarUsuarios(datos)` | POST | `/api/usuarios` | Crea un usuario (201). Error 400 si faltan datos, el correo es inválido o es menor de 18; 409 si el usuario ya existe. | `register.html` |
| `iniciarSesion(usuario, contrasena)` | POST | `/api/login` | Valida credenciales y guarda la sesión. Error 401 si son incorrectas. | `index.html` |
| `cerrarSesion()` | POST | `/api/logout` | Elimina la sesión. | `config.html` |
| `obtenerUsuarioActual()` | GET | `/api/perfil` | Datos del usuario con sesión (sin contraseña) o 401. | `main`, `tokens`, `config` |
| `actualizarPerfil(cambios)` | PUT | `/api/perfil` | Edita usuario, nombre, apellido, correo o contraseña. Errores 400 y 409. | `config.html` |
| `obtenerContrasena()` | GET | `/api/perfil/contrasena` | Devuelve la contraseña (solo existe por ser un mock). | `config.html` |
| `eliminarCuenta()` | DELETE | `/api/perfil` | Elimina la cuenta con sus movimientos y favoritos, y cierra la sesión. | `config.html` |
| `obtenerJuegos({busqueda, tipo, orden})` | GET | `/api/juegos` | Lista los juegos con búsqueda, filtro por tipo y orden. | `main.html` |
| `obtenerTiposDeJuego()` | GET | `/api/juegos/tipos` | Lista las categorías disponibles. | — |
| `obtenerJuego(id)` | GET | `/api/juegos/:id` | Devuelve un juego o 404. | — |
| `obtenerFavoritos()` | GET | `/api/favoritos` | Favoritos del usuario con sesión. | `main.html` |
| `agregarFavorito(juegoId)` | POST | `/api/favoritos` | Agrega un favorito (201). Errores 404 y 409. | `main.html` |
| `quitarFavorito(juegoId)` | DELETE | `/api/favoritos/:juegoId` | Quita un favorito o responde 404. | `main.html` |
| `obtenerMovimientos({tipo, orden})` | GET | `/api/movimientos` | Historial del usuario, con filtro y orden. | `tokens.html` |
| `depositarFichas(monto)` | POST | `/api/movimientos/deposito` | Suma fichas al saldo (201). Error 400 si el monto no es válido. | `tokens.html` |
| `retirarFichas(monto)` | POST | `/api/movimientos/retiro` | Resta fichas del saldo (201). Error 402 si el saldo es insuficiente. | — |
| `entrarAJuego(juegoId)` | POST | `/api/juegos/:id/entrada` | Descuenta la apuesta mínima (201). Errores 402, 403 y 404. | — |
| `actualizarNota(id, nota)` | PUT | `/api/movimientos/:id` | Edita la nota de un movimiento. | — |
| `eliminarMovimiento(id)` | DELETE | `/api/movimientos/:id` | Elimina un movimiento del historial. | — |

Las rutas de datos privados responden 401 si no hay sesión.

## Estructura del proyecto

```
proyecto-semestral/
├── README.md
├── .gitignore
├── ia/                    # registro de uso de IA
│   └── README.md
└── frontend/
    ├── index.html  register.html  main.html  tokens.html  config.html
    ├── js/                # api.js (capa de servicios), index.js, register.js,
    │                      # main.js, tokens.js, config.js
    ├── styles/            # index.css, register.css, tokens.css, style.css (config)
    ├── images/
    └── mocks/             # usuarios.json, juegos.json, favoritos.json, movimientos.json
```

Los nombres de archivos y carpetas están en minúscula y coinciden exactamente con las referencias del código (importante en Linux).

## Identidad visual

Paleta: `#820000` (rojo oscuro), `#a20e0e` (rojo), `#FF8B8B` (rosa) y `#FFDEDE` (rosa claro), con el fondo `images/backgroundcasinoff.png`. Las vistas se adaptan a móvil con `@media` o con las clases responsivas de Tailwind.

## Uso de IA

Se usó IA de forma consultiva. Cada consulta que aportó código, con sus prompts y respuestas completos, está registrada en [`ia/README.md`](ia/README.md). El código incorporado está marcado en los archivos fuente con comentarios `[IA] inicio` y `[IA] fin`.