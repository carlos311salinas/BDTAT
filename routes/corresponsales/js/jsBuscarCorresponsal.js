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
    
    if (partes.length === 3) { // Validar formato YYYY-MM-DD
        const anio = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1; // Los meses en JS van de 0 a 11
        const dia = parseInt(partes[2], 10);

        const fechaObjeto = new Date(anio, mes, dia);
        
        // Validar que la fecha generada sea la misma ingresada
        if (fechaObjeto.getFullYear() !== anio || fechaObjeto.getMonth() !== mes || fechaObjeto.getDate() !== dia) {
            return false; // Fecha no válida
        }
    }
    return true;
}

document.getElementById('formCorresponsales').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío por defecto

    const campos = [
        'nombrecorresponsal', 'imeiacercademac', 'codigoseta', 'tecnologia', 'cedula', 'municipio',
        'codigodane', 'codigopostal', 'lider', 'estado', 'nombrecompleto', 'telefono', 'correo',
        'direccion', 'tiponegocio', 'zona', 'categoria', 'siminternet', 'modalidad', 'fecha',
        'longitud', 'latitud', 'activosfijos'
    ];

    let queryParams = [];

    let fecha = document.getElementById('fecha').value.trim();

    const regexAnio = /^\d{4}$/; // Formato aaaa
    const regexMesAnio = /^\d{4}-\d{2}$/; // Formato aaaa-mm
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/; // Formato aaaa-mm-dd

    if (fecha === "") {
        console.log("El campo de fecha está vacío, se omite la validación.");
    } else if (regexFecha.test(fecha)) {
        if (!validarFechaReal(fecha)) {
            Swal.fire({
                icon: 'warning',  //'success', 'warning', 'info', 'question'
                title: 'Fecha inválida',
                text: 'La fecha ingresada no existe. Por favor verifícala e intenta de nuevo.',
                confirmButtonColor: '#dd7f33',
            });            
            return;
        }
        queryParams.push(`fecha=${fecha}`);
    } else if (regexMesAnio.test(fecha)) {
        queryParams.push(`fecha=${fecha}`);
    } else if (regexAnio.test(fecha)) {
        queryParams.push(`fecha=${fecha}`);
    } else {
        Swal.fire({
            icon: 'warning',  //'success', 'warning', 'info', 'question'
            title: 'Fecha inválida',
            text: 'El formato de fecha ingresado no es válido. Debe ser Año-Mes-Día',
            confirmButtonColor: '#dd7f33',
        });         
        return;
    }

    campos.forEach(campo => {
        if (campo !== 'fecha') {
            const valor = document.getElementById(campo)?.value.trim();
            if (valor) {
                queryParams.push(`${encodeURIComponent(campo)}=${encodeURIComponent(valor)}`);
            }
        }
    });

    if (queryParams.length === 0) {
        Swal.fire({
            icon: 'info',  //'success', 'warning', 'info', 'question'
            title: 'Por favor ingrese al menos un criterio de busqueda',
            confirmButtonColor: '#33a7dd',
        });         
        return;
    }

    const urlParams = new URLSearchParams(queryParams.join('&'));
    const url = `http://localhost:3000/api/buscar-corresponsales/buscar-corresponsal?${urlParams.toString()}`;

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
                icon: 'info',  //'success', 'warning', 'info', 'question'
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
    .catch((error) => {
        console.error('Error en la búsqueda:', error);
        alert('Error al buscar corresponsales. Verifica la consola para más detalles.');
    });
});


// ------------------ EDICIÓN DE CORRESPONSAL ------------------

document.getElementById("btnEditar").addEventListener("click", function() {
    let id = document.getElementById("corresponsalId").value;

    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona un corresponsal para actualizar',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    const campos = [
        'nombrecorresponsal', 'imeiacercademac', 'codigoseta', 'tecnologia', 'cedula', 'municipio',
        'codigodane', 'codigopostal', 'lider', 'estado', 'nombrecompleto', 'telefono', 'correo',
        'direccion', 'tiponegocio', 'zona', 'categoria', 'siminternet', 'modalidad', 'fecha',
        'longitud', 'latitud', 'activosfijos'
    ];

    let datos = { id };

    // Validación estricta de la fecha
    let fecha = document.getElementById('fecha').value.trim();
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/; // Formato aaaa-mm-dd

    if (fecha === "" || !regexFecha.test(fecha)) {
        Swal.fire({
            icon: 'warning',
            title: 'La fecha debe estar completa con Año - Mes - Día',
            text: 'Ejemplo: 2025-01-01',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    // Validar si la fecha ingresada es real
    if (!validarFechaReal(fecha)) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha inválida',
            text: 'La fecha ingresada no existe. Por favor verifícala e intenta de nuevo.',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    datos.fecha = fecha;

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

    fetch(`http://localhost:3000/api/editar-corresponsal/${id}`, {
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
            title: 'Corresponsal actualizado correctamente',
            confirmButtonColor: '#60dd33',
        }).then(() => {
            location.reload(); // Recarga la página después de confirmar el éxito
        });
        console.log("Respuesta del servidor:", data);
    })
    .catch(error => {
        console.error("Error al actualizar el corresponsal:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el corresponsal',
            confirmButtonColor: '#d33',
        });
    });
});


//CAMPO DE ACTIVOS FIJOS
document.addEventListener("DOMContentLoaded", function () {
    const comentarioInput = document.getElementById("activosfijos");

    // Establecer el placeholder con saltos de línea
    comentarioInput.placeholder = "Activo fijo: Serial \n\nEjemplo:\nPDA: 0000123";

    // Agregar viñetas automáticamente al presionar "Enter"
    comentarioInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita el salto de línea normal
            comentarioInput.value += "\n➤ "; // Agrega la viñeta automáticamente
        }
    });

    // Agregar la primera viñeta cuando se empieza a escribir
    comentarioInput.addEventListener("focus", function () {
        if (comentarioInput.value.trim() === "") {
            comentarioInput.value = "➤ ";
        }
    });
});

document.getElementById("btnRetirar").addEventListener("click", function () {
    let id = document.getElementById("corresponsalId").value;

    if (!id) {
        Swal.fire({
            icon: "warning",
            title: "Selecciona un corresponsal para retirar",
            confirmButtonColor: "#dd7f33",
        });
        return;
    }

    // Obtener datos del formulario
    let nombrecorresponsal = document.getElementById("nombrecorresponsal").value.trim();
    let imeiacercademac = document.getElementById("imeiacercademac").value.trim();
    let codigoseta = document.getElementById("codigoseta").value.trim();
    let tecnologia = document.getElementById("tecnologia").value.trim();
    let cedula = document.getElementById("cedula").value.trim();
    let municipio = document.getElementById("municipio").value.trim();
    let codigodane = document.getElementById("codigodane").value.trim();
    let codigopostal = document.getElementById("codigopostal").value.trim();
    let lider = document.getElementById("lider").value.trim();
    let nombrecompleto = document.getElementById("nombrecompleto").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let direccion = document.getElementById("direccion").value.trim();
    let tiponegocio = document.getElementById("tiponegocio").value.trim();
    let zona = document.getElementById("zona").value.trim();
    let categoria = document.getElementById("categoria").value.trim();
    let siminternet = document.getElementById("siminternet").value.trim();
    let modalidad = document.getElementById("modalidad").value.trim();
    let fecha = document.getElementById("fecha").value.trim();
    let longitud = document.getElementById("longitud").value.trim();
    let latitud = document.getElementById("latitud").value.trim();
    let activosfijos = document.getElementById("activosfijos").value.trim();

    Swal.fire({
        title: "Retirar Corresponsal",
        width: "40%",
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                <label for="fechaRetiro" style="align-self: flex-start; font-weight: bold;">Fecha de Retiro:</label>
                <input type="date" id="fechaRetiro" class="swal2-input" required>

                <label for="personaRetira" style="align-self: flex-start; font-weight: bold; margin-top: 20px;">Persona que retira:</label>
                <input type="text" id="personaRetira" class="swal2-input" autocomplete="off" placeholder="Ingrese el nombre">

                <label for="comentarioRetiro" style="align-self: flex-start; font-weight: bold; margin-top: 20px;">Comentario:</label>
                <textarea id="comentarioRetiro" class="swal2-textarea" autocomplete="off" placeholder="MOTIVO POR EL CUAL SERA RETIRADO"></textarea>
            </div>
        `,
        confirmButtonText: "Retirar",
        confirmButtonColor: "#d33",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const fechaRetiro = document.getElementById("fechaRetiro").value.trim();
            const personaRetira = document.getElementById("personaRetira").value.trim();
            const comentarioRetiro = document.getElementById("comentarioRetiro").value.trim();

            if (!fechaRetiro) {
                Swal.showValidationMessage("Debe ingresar una fecha de retiro.");
                return false;
            }
            if (!personaRetira) {
                Swal.showValidationMessage("Debe ingresar el nombre de la persona que retira.");
                return false;
            }
            if (!comentarioRetiro) {
                Swal.showValidationMessage("Debe ingresar el motivo por el cual sera retirado");
                return false;
            }
            
            return {
                nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
                codigodane, codigopostal, lider, nombrecompleto, telefono, correo, direccion,
                tiponegocio, zona, categoria, siminternet, modalidad, fecha, longitud, latitud,
                activosfijos, fecharetiro: fechaRetiro, personaretira: personaRetira, comentario: comentarioRetiro
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let datos = result.value;

            fetch(`http://localhost:3000/api/retirar-corresponsal/${id}`, {
                method: "POST",
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
                    icon: "success",
                    title: "Corresponsal retirado exitosamente",
                    confirmButtonColor: "#60dd33",
                }).then(() => {
                    location.reload();
                });
                console.log("Respuesta del servidor:", data);
            })
            .catch(error => {
                console.error("Error al retirar el corresponsal:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error al retirar el corresponsal",
                    confirmButtonColor: "#d33",
                });
            });
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

    // Función para activar o desactivar el modo oscuro
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