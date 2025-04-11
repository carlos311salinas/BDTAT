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