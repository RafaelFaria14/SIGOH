document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".split-wrapper");
    if (wrapper) wrapper.classList.add("page-fade-in");

    // Transição Suave
    const transitionLinks = document.querySelectorAll(".transicao-link");
    transitionLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const destino = link.getAttribute("href");
            if (wrapper) {
                wrapper.classList.remove("page-fade-in");
                wrapper.classList.add("page-fade-out");
            }
            setTimeout(() => {
                window.location.href = destino;
            }, 340);
        });
    });

    // Alternador de Modo Noturno
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

    // Seletor de Perfil (Médico / Enfermeiro / Paciente)
    const perfilBtns = document.querySelectorAll(".btn-profile");
    const emailLabel = document.getElementById("label-email");
    const emailInput = document.getElementById("email");

    perfilBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            perfilBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tipoPerfil = btn.getAttribute("data-perfil");
            if (tipoPerfil === "paciente") {
                if (emailLabel) emailLabel.textContent = "E-mail";
                if (emailInput) emailInput.placeholder = "paciente@email.com";
            } else if (tipoPerfil === "enfermeiro") {
                if (emailLabel) emailLabel.textContent = "E-mail Corporativo";
                if (emailInput) emailInput.placeholder = "enfermeiro@hospital.com.br";
            } else {
                if (emailLabel) emailLabel.textContent = "E-mail Corporativo";
                if (emailInput) emailInput.placeholder = "medico@hospital.com.br";
            }
        });
    });
});
