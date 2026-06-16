// Se obtiene el botón que permite cambiar entre modo claro y modo oscuro.
const themeToggle = document.getElementById("themeToggle");

// Se obtiene el body porque ahí se agregará o quitará la clase dark-mode.
const body = document.body;

// Se revisa si ya existe una preferencia guardada en localStorage.
const savedTheme = localStorage.getItem("theme");

// Si la preferencia guardada es "dark", se aplica el modo oscuro al cargar la página.
if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.textContent = "Modo claro";
}

// Cuando el usuario hace clic en el botón, se cambia el tema visual.
themeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    // Si el body tiene la clase dark-mode, se guarda la preferencia como "dark".
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "Modo claro";
    } else {
        // Si no tiene la clase dark-mode, se guarda la preferencia como "light".
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "Modo oscuro";
    }
});