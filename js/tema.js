document.addEventListener("DOMContentLoaded", () => {
    const btnToggle = document.getElementById("toggle-tema");
    const temaSalvo = localStorage.getItem("sigoh-theme") || "light";

    if (temaSalvo === "dark") {
        document.body.classList.add("dark-mode");
        if (btnToggle) btnToggle.textContent = "☀️ Modo Claro";
    }

    if (btnToggle) {
        btnToggle.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("sigoh-theme", isDark ? "dark" : "light");
            btnToggle.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Noturno";
        });
    }
});
