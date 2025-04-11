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

document.getElementById('formMaquinasMantenimiento').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío por defecto

    const campos = [
            'tecnologia', 'imeiacercademac', 'placa', 'serial', 'lider', 'siminternet',
            'cedula', 'nombrecorresponsal', 'codigoseta', 'estado', 'fecha', 'conteoenvio', 'ubicacion'
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
    const url = `http://localhost:3000/api/buscar-maquinas-mantenimiento/buscar-maquina-mantenimiento?${urlParams.toString()}`;

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
        alert('Error al buscar maquinas. Verifica la consola para más detalles.');
    });
});

// ------------------ EDICIÓN DE MAQUINAS ------------------
document.getElementById("btnEditar").addEventListener("click", async function () {
    let id = document.getElementById("maquinaId").value;

    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona una máquina para actualizar',
            confirmButtonColor: '#dd7f33',
        });
        return;
    }

    // 📌 Obtener los valores del formulario de la máquina con los campos correctos
    const datosMaquinaMantenimiento = {
        id: id, // Se mantiene el mismo nombre de variable
        tecnologia: document.getElementById("tecnologia").value,
        imeiacercademac: document.getElementById("imeiacercademac").value,
        placa: document.getElementById("placa").value,
        serial: document.getElementById("serial").value,
        lider: document.getElementById("lider").value,
        siminternet: document.getElementById("siminternet").value,
        cedula: document.getElementById("cedula").value,
        nombrecorresponsal: document.getElementById("nombrecorresponsal").value,
        codigoseta: document.getElementById("codigoseta").value,
        estado: document.getElementById("estado").value,
        fecha: document.getElementById("fecha").value,
        conteoenvio: document.getElementById("conteoenvio").value,
        ubicacion: document.getElementById("ubicacion").value
    };

    // 📌 Obtener todas las filas de la tabla historialenvios
    const filasHistorialMantenimiento = document.querySelectorAll("#tablahistorialmantenimiento tbody tr");
    let historialEnviosMantenimientoData = [];

    filasHistorialMantenimiento.forEach(fila => {
        // ⚠️ Asegurar que estamos capturando correctamente el data-id
        let idEnvio = fila.getAttribute("data-id")?.trim();

        if (!idEnvio) {
            console.warn("⚠️ Advertencia: No se encontró ID para una fila del historial.");
        }

        historialEnviosMantenimientoData.push({
            id: idEnvio, // Agregar el ID capturado
            id_maquina: document.getElementById("maquinaId").value, // ID de la máquina
            motivoenvio: fila.querySelector("select[name^='motivoenvio']").value,
            observacion: fila.querySelector("textarea[name^='observacion']").value,
            personaenvia: fila.querySelector("select[name^='personaenvia']").value,
            fechaenvio: fila.querySelector("input[name^='fechaenvio']").value,
            fecharegreso: fila.querySelector("input[name^='fecharegreso']").value
        });
    });


    // 📌 Enviar la solicitud al backend para actualizar la máquina y el historial de envíos
    fetch(`/api/editar-maquina-mantenimiento/${id}`, { // Se pasa el ID en la URL como en el backend
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...datosMaquinaMantenimiento,
            historialmantenimiento: historialEnviosMantenimientoData
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                Swal.fire({
                    icon: 'success',
                    title: 'Máquina e historial actualizados correctamente',
                    confirmButtonColor: '#60dd33',
                }).then(() => {
                    location.reload(); // Recargar la página después de confirmar
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    text: data.error || 'Ocurrió un problema',
                    confirmButtonColor: '#ff0000',
                });
            }
        })
        .catch(error => {
            console.error("Error en la actualización:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error en la actualización',
                text: 'Revisa la consola para más detalles.',
                confirmButtonColor: '#ff0000',
            });
        });
});


 /* ******************** CONTEOENVIO ************************** */
document.getElementById("conteoenvio").addEventListener("input", function (e) {
    this.value = this.value.replace(/\D/g, ""); // Elimina cualquier carácter que no sea número
});

document.addEventListener("DOMContentLoaded", function () {
    const conteoenvio = document.getElementById("conteoenvio");
    const tablaHistorialMantenimiento = document.getElementById("tablahistorialmantenimiento").querySelector("tbody");

    function actualizarTablaHistorial(numFilas, data = []) {
        const filasActuales = tablaHistorialMantenimiento.querySelectorAll("tr").length;
    
        for (let i = filasActuales; i < numFilas; i++) {
            let envio = data[i] || {}; // Obtener datos si existen
            let fila = document.createElement("tr");
    
            // 🔹 Agregar el atributo `data-id` con el ID real del envío (si existe)
            fila.setAttribute("data-id", envio.id || '');
    
            fila.innerHTML = `
                <td style="text-align: center;">${i + 1}</td>
                <td>
                    <select name="motivoenvio${i + 1}" style="width: 100%; min-width: 112px; padding: 4px;">
                        <option value="Reparación" ${envio.motivoenvio === 'Reparación' ? 'selected' : ''}>Reparación</option>
                        <option value="Garantía" ${envio.motivoenvio === 'Garantía' ? 'selected' : ''}>Garantía</option>
                    </select>
                </td>
                <td><textarea name="observacion${i + 1}" rows="2" placeholder="Observación / Falla" style="width:100%; resize:vertical;">${envio.observacion || ''}</textarea></td>
                <td>
                    <select name="personaenvia${i + 1}" style="width: 100%; min-width: 112px; padding: 4px;">
                        <option value="Carlos Salinas" ${envio.personaenvia === 'Carlos Salinas' ? 'selected' : ''}>Carlos Salinas</option>
                        <option value="Luis Leon" ${envio.personaenvia === 'Luis Leon' ? 'selected' : ''}>Luis Leon</option>
                    </select>
                </td>
                <td><input type="date" name="fechaenvio${i + 1}" value="${envio.fechaenvio ? new Date(envio.fechaenvio).toISOString().split('T')[0] : ''}"></td>
                <td><input type="date" name="fecharegreso${i + 1}" value="${envio.fecharegreso ? new Date(envio.fecharegreso).toISOString().split('T')[0] : ''}"></td>
            `;
    
            // Aplicar clase para modo oscuro si está activado
            if (document.body.classList.contains("dark-mode")) {
                fila.classList.add("fila-dark");
            }
    
            tablaHistorialMantenimiento.appendChild(fila);
        }
    }
    

    function cargarHistorialEnvios(maquinaId, callback) {
        fetch(`/api/historialenviosmantenimiento?maquina_mantenimiento_id=${maquinaId}`)
            .then(response => response.json())
            .then(data => {
                // Primero, limpiar la tabla
                while (tablaHistorialMantenimiento.firstChild) {
                    tablaHistorialMantenimiento.removeChild(tablaHistorialMantenimiento.firstChild);
                }

                // Llenar la tabla con el historial de envíos
                actualizarTablaHistorial(data.length, data);

                // Ejecutar callback si se necesita agregar más filas
                if (callback) callback();
            })
            .catch(error => {
                console.error("Error al cargar historial de envíos:", error);
            });
    }

    function selectOption(event, inputId) {
        const input = document.getElementById(inputId);
        if (!input) {
            console.error(`Elemento con ID '${inputId}' no encontrado.`);
            return;
        }

        input.value = event.target.textContent;

        const maquinaSeleccionada = document.getElementById("id_maquina")?.value; // Evita error si es null
        const conteo = parseInt(input.value, 10);

        if (inputId === "conteoenvio" && maquinaSeleccionada) {
            cargarHistorialEnvios(maquinaSeleccionada, function () {
                // Después de cargar el historial, agregar las filas faltantes
                actualizarTablaHistorial(conteo);
            });
        } else {
            actualizarTablaHistorial(conteo);
        }
    }

    // Agregar eventos a las opciones del dropdown
    document.querySelectorAll("#conteoenvioOptions .option").forEach(option => {
        option.addEventListener("click", function (event) {
            selectOption(event, "conteoenvio");
        });
    });

    // Detectar cambios en el modo oscuro
    const modoOscuroObserver = new MutationObserver(() => {
        document.querySelectorAll("#tablahistorialmantenimiento tr").forEach(fila => {
            if (document.body.classList.contains("dark-mode")) {
                fila.classList.add("fila-dark");
            } else {
                fila.classList.remove("fila-dark");
            }
        });
    });

    // Observar cambios en la clase de `body`
    modoOscuroObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // Exponer la función para cargar historial desde otros eventos
    window.cargarHistorialEnvios = cargarHistorialEnvios;
});


// ******************* BOTON DE ENVIAR A MANTENIMIENTO  ************************

document.getElementById("btnRegresar").addEventListener("click", function () {
    let id = document.getElementById("maquinaId").value;

    if (!id) {
        Swal.fire({
            icon: "warning",
            title: "Selecciona una máquina para regresar",
            confirmButtonColor: "#dd7f33",
        });
        return;
    }

    // Obtener datos del formulario
    let tecnologia = document.getElementById("tecnologia").value.trim();
    let imeiacercademac = document.getElementById("imeiacercademac").value.trim();
    let placa = document.getElementById("placa").value.trim();
    let serial = document.getElementById("serial").value.trim();
    let lider = document.getElementById("lider").value.trim();
    let siminternet = document.getElementById("siminternet").value.trim();
    let cedula = document.getElementById("cedula").value.trim();
    let nombrecorresponsal = document.getElementById("nombrecorresponsal").value.trim();
    let codigoseta = document.getElementById("codigoseta").value.trim();
    let ubicacion = document.getElementById("ubicacion").value.trim();
    let estado = document.getElementById("estado").value.trim();
    let fecha = document.getElementById("fecha").value.trim();
    let conteoenvio = document.getElementById("conteoenvio").value.trim();

    Swal.fire({
        title: "Regresar Máquina de Mantenimiento",
        width: "40%",
        html: `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <label for="fecharegreso" style="align-self: flex-start; font-weight: bold; margin-top: 20px;">Fecha de Regreso:</label>
            <input type="date" id="fecharegreso" class="swal2-input" style="width: 100%;">
        </div>
        `,
        confirmButtonText: "Regresar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const fecharegreso = document.getElementById("fecharegreso").value.trim();

            if (!fecharegreso) {
                Swal.showValidationMessage("Debe ingresar una fecha de regreso.");
                return false;
            }

            return {
                tecnologia, imeiacercademac, placa, serial, lider, siminternet,
                cedula, nombrecorresponsal, codigoseta, estado, fecha, conteoenvio, ubicacion,
                fecharegreso
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let datos = result.value;

            fetch(`http://localhost:3000/api/regresar-maquina/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        console.log(`Error en el regreso: ${data.error || response.statusText}`);
                        Swal.fire({
                            icon: "error",
                            title: `Error: ${data.error || response.statusText}`,
                            confirmButtonColor: "#d33",
                        });
                        return Promise.reject(data.error || response.statusText);
                    });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: "success",
                    title: "Máquina regresada exitosamente",
                    confirmButtonColor: "#60dd33",
                }).then(() => {
                    location.reload();
                });
            })
            .catch(error => {
                console.log("Error al regresar la máquina:", error);
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
    window.location.href = "http://localhost:3000/maquinas";
}