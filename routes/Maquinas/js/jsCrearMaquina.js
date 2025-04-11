/// Función para filtrar las opciones de una lista desplegable
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



document.getElementById('formMaquinas').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío por defecto

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Enviar los datos usando fetch
fetch('http://localhost:3000/api/maquinas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
    if (data.error) {  // 🔴 Verifica si el servidor envió un error
        console.error('Error:', data.detalle);
        alert('Error: ' + data.detalle); // Muestra el error real
    } else {
        console.log('Éxito:', data);
        Swal.fire({
            icon: 'success',
            title: 'Maquina Creada con Éxito',
            confirmButtonColor: '#60dd33',
        });
        document.getElementById('formMaquinas').reset();
    }
})
.catch(error => {
    console.error('Error en la solicitud:', error);
    alert('Error en la conexión con el servidor');
});
});

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