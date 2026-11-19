/*
========================================================
SIGOH - SIDEBAR DINÂMICA
========================================================

Este arquivo monta automaticamente a sidebar
em todas as páginas do sistema.
*/

function renderSidebar() {

    // Identifica a página atual
    const paginaAtual = window.location.pathname
        .split("/")
        .pop();

    // Itens do menu
    const links = [
        {
            nome: "Dashboard",
            icone: "📊",
            arquivo: "dashboard.html"
        },
        {
            nome: "Pacientes",
            icone: "👥",
            arquivo: "pacientes.html"
        },
        {
            nome: "Médicos",
            icone: "🩺",
            arquivo: "#"
        },
        {
            nome: "Consultas",
            icone: "📅",
            arquivo: "consultas.html"
        },
        {
            nome: "Exames",
            icone: "📋",
            arquivo: "exames.html"
        }
    ];

    // Gera os links do menu
    const linksHTML = links.map(link => {

        const ativo = paginaAtual === link.arquivo
            ? "active"
            : "";

        return `
            <li class="${ativo}">
                <a href="./${link.arquivo}">

                    <span class="menu-icon">
                        ${link.icone}
                    </span>

                    <span class="menu-text">
                        ${link.nome}
                    </span>

                </a>
            </li>
        `;

    }).join("");

    // Estrutura da sidebar
    const sidebarHTML = `

        <aside class="sidebar">

            <div class="sidebar-header">

                <div class="sidebar-title-group">

                    <h2>SIGOH</h2>

                    <p>Ortopedia Hospitalar</p>

                </div>

            </div>

            <ul class="sidebar-menu">

                ${linksHTML}

            </ul>

            <div class="sidebar-footer">

                <button
                    id="themeToggle"
                    class="theme-toggle-btn"
                    type="button"
                >

                    <span class="theme-emoji">🌙</span>

                    <span class="theme-label">
                        Modo Noturno
                    </span>

                </button>

                <a href="../index.html" class="btn-sair">

                    <span class="menu-icon">↩</span>

                    <span class="menu-text">
                        Sair
                    </span>

                </a>

            </div>

        </aside>

    `;

    // Insere a sidebar no HTML
    const container = document.getElementById("sidebar-container");

    if (container) {
        container.innerHTML = sidebarHTML;
    }

}

// Executa a função
renderSidebar();