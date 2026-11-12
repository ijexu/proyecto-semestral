
- **Fecha:** 2026-11-02
- **Integrante:** Jesús (@ijexu)
- **Herramienta y modelo:** Claude
- **Archivos afectados:** frontend/main.html

## Objetivo
Queria aplicar un script en register.html que me permite poner un limite inferior a la edad a la hora de registrarse, para evitar que personas menores de 18 ingresen a la pagina

## Conversación (texto completo, sin editar)

### Prompt 1
Enseñame como hacer un script que me permita fijar una edad minima


### Respuesta 1
HTML
<form id="registroForm">
    <label for="fechaNacimiento">Fecha de Nacimiento:</label>
    <input type="date" id="fechaNacimiento" required>
    <button type="submit">Registrarse</button>
    <p id="mensajeError" style="color: red;"></p>
</form>
2. Código JavaScript para la validación
JavaScript
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se envíe el formulario por defecto

    const inputFecha = document.getElementById('fechaNacimiento').value;
    const mensajeError = document.getElementById('mensajeError');
    const edadMinima = 18; // Puedes cambiar este valor según tus necesidades

    if (!inputFecha) {
        mensajeError.textContent = "Por favor, ingresa tu fecha de nacimiento.";
        return;
    }

    // Calcular la edad exacta
    const fechaNacimiento = new Date(inputFecha);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }

    // Validar la edad mínima
    if (edad < edadMinima) {
        mensajeError.textContent = `Debes tener al menos ${edadMinima} años para registrarte. (Edad actual: ${edad} años)`;
    } else {
        mensajeError.textContent = "";
        alert("¡Validación exitosa! Edad permitida.");
        // Aquí puedes continuar con el envío del formulario o lógica posterior
    }
});
Opción 2: Script en Python (Backend)
Si estás procesando los datos en el servidor, puedes utilizar la librería estándar datetime para calcular la diferencia de años de manera segura.

Python
from datetime import date

def validar_edad_minima(fecha_nacimiento: date, edad_minima: int = 18) -> bool:
    hoy = date.today()
    
    # Calcular la diferencia de años
    edad = hoy.year - fecha_nacimiento.year
    
    # Comprobar si ya cumplió años este año
    no_ha_cumplido = (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day)
    
    if no_ha_cumplido:
        edad -= 1
        
    return edad >= edad_minima

- Ejemplo de uso: 
- nacimiento = date(2010, 5, 12)
- print(validar_edad_minima(nacimiento, 18))  # Retornará False
💡 Puntos clave a tener en cuenta:
Cálculo preciso: Nunca restes únicamente el año actual menos el año de nacimiento (hoy.getFullYear() - nacimiento.getFullYear()), ya que eso daría por sentado que la persona ya cumplió años, lo cual generaría un fallo lógico si su cumpleaños es más adelante en el año.

Seguridad (Validación Dual): Si implementas esta validación en el frontend (JavaScript), recuerda siempre validarla también en el backend (servidor). Las validaciones del lado del cliente pueden ser manipuladas fácilmente por los usuarios desde la consola del navegador.


### Prompt 2
Enseñame como hacer menus dinamicos en html, asi tambien enseñame a hacer el script correspondiente, un menu lateral con 2 botones, y que cada uno tenga su propio contenido de pagina