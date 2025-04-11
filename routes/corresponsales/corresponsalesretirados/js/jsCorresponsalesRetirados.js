// Función para filtrar las opciones de una lista desplegable
function filterOptions(event, inputId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toUpperCase();
    const optionsContainer = document.getElementById(`${inputId}Options`);
    const options = optionsContainer.getElementsByClassName("option");

    for (let option of options) {
        const text = option.textContent || option.innerText;
        option.style.display = text.toUpperCase().includes(filter) ? "" : "none";
    }
}

// Función para seleccionar una opción
function selectOption(event, inputId) {
    const input = document.getElementById(inputId);
    input.value = event.target.textContent; // Asigna el valor seleccionado al input

    const optionsContainer = document.getElementById(`${inputId}Options`);
    optionsContainer.style.display = "none"; // Oculta las opciones después de seleccionar

    // Limpia cualquier estilo de error anterior
    input.style.borderColor = "";
    const errorMessage = input.parentElement.querySelector(".error-message");
    if (errorMessage) errorMessage.textContent = "";
}

// Función para validar si el valor ingresado está en la lista
function validateInput(inputId) {
    const input = document.getElementById(inputId);
    const optionsContainer = document.getElementById(`${inputId}Options`);
    const options = optionsContainer.getElementsByClassName("option");
    const errorMessage = input.parentElement.querySelector(".error-message");

    if (input.value.trim() === "") {
        // Si el campo está vacío, no lo marcamos como obligatorio
        input.style.borderColor = ""; // Restablece el borde
        if (errorMessage) errorMessage.textContent = ""; // Limpia el mensaje de error
        return;
    }

    let isValid = false;

    // Verifica si el valor del input coincide con alguna opción
    for (let option of options) {
        if (input.value.trim() === option.textContent) {
            isValid = true;
            break;
        }
    }

    // Si el valor no es válido
    if (!isValid) {
        input.style.borderColor = "red"; // Estilo del borde rojo
        if (errorMessage) errorMessage.textContent = "Por favor ingresa un elemento que esté en la lista"; // Mensaje de error
        input.value = ""; // Limpia el campo
    } else {
        input.style.borderColor = ""; // Restablece el borde
        if (errorMessage) errorMessage.textContent = ""; // Limpia el mensaje de error
    }
}

// Detectar cuando el input gana o pierde foco para mostrar/ocultar las opciones
document.querySelectorAll(".dropdown input").forEach(input => {
    const optionsContainer = document.getElementById(`${input.id}Options`);
    let activeIndex = -1; // Índice de la opción activa para navegación con teclado

    // Mostrar las opciones al enfocar
    input.addEventListener("focus", () => {
        optionsContainer.style.display = "block";
    });

    // Validar el valor al salir de foco
    input.addEventListener("blur", () => {
        // Usa un temporizador para permitir la selección antes de ocultar
        setTimeout(() => {
            optionsContainer.style.display = "none";
            validateInput(input.id); // Validar el valor ingresado
        }, 100);
    });

    // Detectar cambios en el input para filtrar las opciones
    input.addEventListener("input", (event) => {
        filterOptions(event, input.id);
        activeIndex = -1; // Reinicia la selección al filtrar
    });

    // Manejar navegación con teclado
    input.addEventListener("keydown", (event) => {
        const options = Array.from(optionsContainer.getElementsByClassName("option"))
            .filter(option => option.style.display !== "none");

        if (event.key === "ArrowDown") {
            event.preventDefault();
            activeIndex = (activeIndex + 1) % options.length;
            updateActiveOption(options, activeIndex);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            activeIndex = (activeIndex - 1 + options.length) % options.length;
            updateActiveOption(options, activeIndex);
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (options[activeIndex]) {
                options[activeIndex].click(); // Selecciona la opción activa
            }
        }
    });
});

// Función para resaltar la opción activa
function updateActiveOption(options, activeIndex) {
    options.forEach(option => option.classList.remove("active"));
    if (options[activeIndex]) {
        options[activeIndex].classList.add("active");
        options[activeIndex].scrollIntoView({ block: "nearest" }); // Asegura que la opción sea visible
    }
}

// Función para validar si una fecha existe
function validarFechaReal(fecha) {
    const partes = fecha.split('-');

    if (partes.length === 3) {
        const anio = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10);
        const dia = parseInt(partes[2], 10);

        if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
            return false; // Mes o día fuera de rango
        }

        const fechaObjeto = new Date(anio, mes - 1, dia);
        return fechaObjeto.getFullYear() === anio && 
               fechaObjeto.getMonth() === mes - 1 && 
               fechaObjeto.getDate() === dia;
    }
    return false;
}

// Función para validar y agregar fecha a queryParams
function validarCampoFecha(idCampo, queryParams) {
    let fecha = document.getElementById(idCampo)?.value.trim();
    
    if (!fecha) return true; // Si está vacío, no bloquea la validación

    const regexFechaCompleta = /^\d{4}-\d{2}-\d{2}$/; // Formato aaaa-mm-dd
    const regexMesAnio = /^\d{4}-\d{2}$/; // Formato aaaa-mm
    const regexAnio = /^\d{4}$/; // Formato aaaa

    if (regexFechaCompleta.test(fecha) && !validarFechaReal(fecha)) {
        Swal.fire({
            icon: 'warning',  //'success', 'warning', 'info', 'question'
            title: 'Fecha inválida',
            text: 'La fecha ingresada no existe. Por favor verifícala e intenta de nuevo.',
            confirmButtonColor: '#dd7f33',
        });            
        return;
    }
    
    if (!regexFechaCompleta.test(fecha) && !regexMesAnio.test(fecha) && !regexAnio.test(fecha)) {
        Swal.fire({
            icon: 'warning',  //'success', 'warning', 'info', 'question'
            title: 'Fecha inválida',
            text: 'El formato de fecha ingresado no es válido. Debe ser Año-Mes-Día',
            confirmButtonColor: '#dd7f33',
        });         
        return;
    }

    queryParams.push(`${idCampo}=${encodeURIComponent(fecha)}`);
    return true;
}

document.getElementById('formCorresponsales').addEventListener('submit', function(event) {
    event.preventDefault();

    const campos = [
        'nombrecorresponsal', 'imeiacercademac', 'codigoseta', 'tecnologia', 'cedula', 'municipio',
        'codigodane', 'codigopostal', 'lider', 'estado', 'nombrecompleto', 'telefono', 'correo',
        'direccion', 'tiponegocio', 'zona', 'categoria', 'siminternet', 'modalidad', 'fecha',
        'longitud', 'latitud', 'activosfijos', 'fecharetiro', 'personaretira', 'comentario'
    ];

    let queryParams = [];

    // Validar fechas
    if (!validarCampoFecha('fecha', queryParams) || !validarCampoFecha('fecharetiro', queryParams)) {
        return;
    }

    // Procesar otros campos
    campos.forEach(campo => {
        if (!['fecha', 'fecharetiro'].includes(campo)) {
            const valor = document.getElementById(campo)?.value.trim();
            if (valor) queryParams.push(`${encodeURIComponent(campo)}=${encodeURIComponent(valor)}`);
        }
    });

    if (queryParams.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Ingrese al menos un criterio de búsqueda',
            confirmButtonColor: '#33a7dd',
        });
        return;
    }

    const url = `http://localhost:3000/api/buscar-corresponsales-retirados/buscar-corresponsal-retirado?${queryParams.join('&')}`;
    console.log("URL completa:", url);

    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Resultados de la búsqueda:', data);

        if (data.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No se encontraron resultados',
                confirmButtonColor: '#33a7dd',
            });
            return;
        }

        if (typeof actualizarTabla === "function") {
            actualizarTabla(data);
        } else {
            console.error("Error: actualizarTabla no está definida.");
        }
    })
    .catch(error => {
        console.error('Error en la búsqueda:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error en la búsqueda',
            text: 'Hubo un problema al buscar los corresponsales retirados.',
            confirmButtonColor: '#d33',
        });
    });
});


// ------------------ EDICIÓN DE CORRESPONSAL RETIRADO ------------------

document.getElementById("btnEditar").addEventListener("click", function() {
    let id = document.getElementById("corresponsalId").value;

    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona un corresponsal retirado para actualizar',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    const campos = [
        'nombrecorresponsal', 'imeiacercademac', 'codigoseta', 'tecnologia', 'cedula', 'municipio',
        'codigodane', 'codigopostal', 'lider', 'estado', 'nombrecompleto', 'telefono', 'correo',
        'direccion', 'tiponegocio', 'zona', 'categoria', 'siminternet', 'modalidad', 'fecha',
        'longitud', 'latitud', 'activosfijos', 'fecharetiro', 'personaretira', 'comentario'
    ];

    let datos = { id };

    // Validaciones de fecha para "fecha" y "fecharetiro"
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/; // Formato aaaa-mm-dd
    let fecha = document.getElementById('fecha').value.trim();
    let fecharetiro = document.getElementById('fecharetiro').value.trim();

    if (fecha === "" || !regexFecha.test(fecha)) {
        Swal.fire({
            icon: 'warning',
            title: 'La fecha debe estar completa con Año - Mes - Día',
            text: 'Ejemplo: 2025-01-01',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    if (fecharetiro === "" || !regexFecha.test(fecharetiro)) {
        Swal.fire({
            icon: 'warning',
            title: 'La fecha de retiro debe estar completa con Año - Mes - Día',
            text: 'Ejemplo: 2025-01-01',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    // Validar si las fechas ingresadas son reales
    if (!validarFechaReal(fecha) || !validarFechaReal(fecharetiro)) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha inválida',
            text: 'Una de las fechas ingresadas no existe. Por favor verifícalas e intenta de nuevo.',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    datos.fecha = fecha;
    datos.fecharetiro = fecharetiro;

    // Validar que todos los campos estén llenos
    for (let campo of campos) {
        let valor = document.getElementById(campo)?.value.trim();
        if (!valor) {
            Swal.fire({
                icon: 'warning',
                title: 'Todos los campos deben estar llenos para realizar la actualización',
                confirmButtonColor: '#dd7f33',
            });
            return;
        }
        datos[campo] = valor;
    }

    console.log("Datos a enviar:", datos);

    fetch(`http://localhost:3000/api/editar-corresponsal-retirado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Corresponsal retirado actualizado correctamente',
            confirmButtonColor: '#60dd33',
        }).then(() => {
            location.reload(); // Recarga la página después de confirmar el éxito
        });
        console.log("Respuesta del servidor:", data);
    })
    .catch(error => {
        console.error("Error al actualizar el corresponsal retirado:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el corresponsal retirado',
            confirmButtonColor: '#d33',
        });
    });
});

// Función para validar si una fecha es real
function validarFechaReal(fecha) {
    let partes = fecha.split("-");
    let anio = parseInt(partes[0], 10);
    let mes = parseInt(partes[1], 10) - 1; // Mes en JS es 0-based
    let dia = parseInt(partes[2], 10);
    let fechaObj = new Date(anio, mes, dia);

    return (
        fechaObj.getFullYear() === anio &&
        fechaObj.getMonth() === mes &&
        fechaObj.getDate() === dia
    );
}


//CAMPO DE ACTIVOS FIJOS
document.addEventListener("DOMContentLoaded", function () {
    const activosfijosInput = document.getElementById("activosfijos");
    const comentarioInput = document.getElementById("comentario");
    //Ajustar altura de los campos
    const ajustarAltura = () => {
        activosfijosInput.style.height = "auto"; // Restablece la altura
        activosfijosInput.style.height = activosfijosInput.scrollHeight + "px"; // Ajusta según el contenido
    };
    // Establecer el placeholder con saltos de línea
    activosfijosInput.placeholder = "Activo fijo: Serial \n\nEjemplo:\nPDA: 0000123";
    ajustarAltura();
    comentarioInput.style.height = activosfijosInput.style.height;
    // Agregar viñetas automáticamente al presionar "Enter"
    activosfijosInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita el salto de línea normal
            activosfijosInput.value += "\n➤ "; // Agrega la viñeta automáticamente
        }
    });

    // Agregar la primera viñeta cuando se empieza a escribir
    comentarioInput.addEventListener("focus", function () {
        if (comentarioInput.value.trim() === "") {
            comentarioInput.value = "➤ ";
        }
    });
});


// Función para validar si la fecha ingresada es real
function validarFechaReal(fecha) {
    const partes = fecha.split("-");
    const anio = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);

    const fechaValidacion = new Date(anio, mes, dia);

    return (
        fechaValidacion.getFullYear() === anio &&
        fechaValidacion.getMonth() === mes &&
        fechaValidacion.getDate() === dia
    );
}


/*Modo Oscuro*/

document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const cards = document.querySelectorAll(".card");
    const banner = document.querySelector(".banner");

    function aplicarModoOscuro() {
        if (localStorage.getItem("darkMode") === "enabled") {
            body.classList.add("dark-mode");
            if (banner) banner.classList.add("dark-mode");
            cards.forEach(card => card.classList.add("dark-mode"));
            if (darkModeToggle) darkModeToggle.textContent = "☀️";
        } else {
            body.classList.remove("dark-mode");
            if (banner) banner.classList.remove("dark-mode");
            cards.forEach(card => card.classList.remove("dark-mode"));
            if (darkModeToggle) darkModeToggle.textContent = "🌙";
        }
    }

    // Aplicar el modo oscuro al cargar la página
    aplicarModoOscuro();

    // Verificar que el botón existe antes de agregar el evento
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("darkMode", "disabled");
            } else {
                localStorage.setItem("darkMode", "enabled");
            }
            aplicarModoOscuro(); // Vuelve a aplicar el modo oscuro según el estado guardado
        });
    }
});

/*VOLVER*/
function goBack() {
    window.location.href = "http://localhost:3000/corresponsales";
}