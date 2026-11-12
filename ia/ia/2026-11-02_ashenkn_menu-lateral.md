# Menú lateral desplegable con Tailwind y Alpine

- **Fecha:** 2026-11-02
- **Integrante:** Alvaro (@ashenkn)
- **Herramienta y modelo:** Gemini (Google)
- **Archivos afectados:** frontend/main.html

## Objetivo
Quería rediseñar la pantalla principal del casino a partir de una imagen de referencia: un menú lateral desplegable, las fichas y el perfil arriba a la derecha. No conocía Tailwind CSS ni Alpine.js, así que consulté a la IA para entender cómo funcionan (qué hace cada clase y cada directiva) y obtener un primer esqueleto que pudiera estudiar, probar y modificar.

## Conversación (texto completo, sin editar)

### Prompt 1
quiero cambiar mi main de mi casino por uino que funcione y se vea asi, lo de la izquierda debiese ser un menu desplegable, enseñame a lograr esto paso a paso

(adjunté una captura del diseño de referencia)

### Respuesta 1
¡Hola! Vamos a armar este primer paso juntos siguiendo de referencia tu imagen. Para que aprendas cómo estructurar todo sin abrumarte, hoy nos enfocaremos únicamente en el Paso 1: el esqueleto y la interactividad básica del menú desplegable.

Para lograr esto usamos dos herramientas:

Tailwind CSS: para manejar los estilos (colores, espaciados y flexbox) mediante clases de utilidad.

Alpine.js: para darle vida al menú sin escribir JavaScript complejo.

1. El estado del menú (x-data) y los script esenciales
Para que un menú abra y cierre, necesitamos una variable que recuerde si está abierto o cerrado. En Alpine.js esto se define en el contenedor principal con x-data="{ abierto: false }".

Además, incluimos las librerías necesarias en el <head>:


    <script src="https://cdn.tailwindcss.com/3.4.17"></script> <!-- prefabrica el css a partir de las clases -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script> <!-- defer: espera a que cargue el HTML antes de activarse -->
    

2. El botón y la visibilidad de los textos (x-show y @click)
El botón ☰: Lleva el evento @click="abierto = !abierto". Cada vez que haces clic, invierte el valor de abierto (si es false pasa a true y viceversa).

Los textos de las opciones: Usan la directiva x-show="abierto". Si abierto es false, los elementos <span> se ocultan automáticamente, dejando solo los íconos visibles en el lateral.


 <div x-data="{ abierto: false }" class="flex">

    <aside class="bg-[#0D0C1E] p-3 min-h-screen flex flex-col">
        <button @click="abierto = !abierto" class="bg-[#1F113A] hover:bg-[#E99415] hover:text-black p-3 rounded w-full">☰</button>

        <a href="#" class="flex items-center gap-2 bg-[#1F113A] hover:bg-[#E99415] hover:text-black p-3 rounded mt-3">
            <img src="images/Monto.jpg" alt="Fichas" class="w-8 h-8">
            <span x-show="abierto">Fichas</span>
        </a>          

        <!-- aquí irían más <a> con las otras opciones del menú -->

    </aside>      

    <main class="flex-1">
        <!-- contenido principal: barra superior, fichas, perfil -->
    </main>

</div>                      
          



### Prompt 2
como cambio la paleta de colores a la siguiente:
Paleta de colores:
#E99415
#F0C32C

Fondos:
#1F113A a #0D0C1E

Tipografia:
sans-serif

### Respuesta 2
Para cambiar la paleta de colores a tus tonos exactos utilizando Tailwind CSS, puedes usar las clases con corchetes de valores arbitrarios (ej. bg-[#HEX], text-[#HEX]).

Aquí tienes la guía de cambio y respetando la estructura con Alpine.js

Mapeo de la nueva paleta
Fondo con degradado: bg-gradient-to-b from-[#1F113A] to-[#0D0C1E]

Fondo del menú lateral: bg-[#0D0C1E]

Botones e íconos (base): bg-[#1F113A]

Botones e íconos (hover/destacado): hover:bg-[#E99415]

Textos de acento (Monto/Balance): text-[#F0C32C]

Título principal: text-[#E99415]

Tipografía: font-sans (o style="font-family: sans-serif;")





### Prompt 3
como le agrego fotos en el lugar d elos botones

### Respuesta 3
Para agregar imágenes a tus botones manteniendo la misma estructura modular que ya construiste con Tailwind CSS y Alpine.js, debes integrar la etiqueta <img> dentro del propio <button> o enlace <a>.

Aquí tienes la guía paso a paso y la respuesta orientativa para incluir fotos/iconos en cada botón de tu menú lateral.

Explicación del concepto
Contenedor flexible (flex + items-center + gap-2): Al botón le asignamos clases de Flexbox para que la imagen y el texto queden alineados verticalmente y con un espacio cómodo entre ellos.

Tamaño controlado (w-8 h-8): Le damos una dimensión fija a la imagen para que no desfigure el menú lateral cuando el texto se oculte.

Visibilidad condicional (x-show="abierto"): El texto dentro del <span> es el que se oculta al cerrar el menú, mientras que la imagen/icono se mantiene visible en todo momento.




## Qué se incorporó al proyecto
- Tailwind CSS y Alpine.js cargados por CDN.
- Menú lateral que se abre y se cierra con una variable de Alpine (x-data, @click y x-show).
- Degradado de fondo con la paleta de colores del proyecto.
- Íconos con imágenes (etiqueta img) en lugar de emojis.
- Modificaciones mías: correciones a mi gusto o cambio de colores requeridos para que se mantenga fiel al casino
- Descartado: los colores del código de su primera version, que reemplacé por los de la paleta del casino


## Verificación
- Lo probé con Live Server: el menú se abre y se cierra con ☰ 
- Entiendo que x-data crea la variable abierto, que @click la invierte con !, y que x-show muestra los textos solo cuando vale true.
