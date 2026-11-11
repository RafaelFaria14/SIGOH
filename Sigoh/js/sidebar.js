
/*
========================================================
 SIGOH - SIDEBAR DINÂMICA
========================================================

 Este arquivo é responsável por montar a sidebar
 automaticamente em todas as páginas do sistema.

 Assim, não precisamos repetir todo o HTML da sidebar
 em dashboard.html, consultas.html, exames.html etc.
*/


// ======================================================
// 1. CRIAÇÃO DA FUNÇÃO
// ======================================================

// Declaramos a função renderSidebar().
// Todo o código responsável por montar a sidebar
// ficará dentro dela.

function renderSidebar() {


    // ==================================================
    // 2. IDENTIFICA A PÁGINA ATUAL
    // ==================================================

    // window.location.pathname retorna o caminho da URL.
    // Exemplo: /pages/exames.html

    // split("/") divide esse caminho em partes.
    // Exemplo: ["", "pages", "exames.html"]

    // pop() retorna o último elemento do array.
    // Resultado: "exames.html"

    const paginaAtual = window.location.pathname
        .split("/")
        .pop();


    // ==================================================
    // 3. ARRAY COM OS ITENS DO MENU
    // ==================================================

    // Criamos um array chamado links.
    // Cada objeto representa uma opção da sidebar.

    // Cada objeto possui:
    // nome: texto que aparecerá no menu.
    // icone: emoji que representa a opção.
    // arquivo: página para a qual o link direciona.

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


    // ==================================================
    // 4. GERA OS LINKS AUTOMATICAMENTE
    // ==================================================

    // map() percorre todos os objetos do array links.
    // Para cada objeto, executa a função que está dentro dele.
    //
    // A variável link representa o objeto da vez.
    // Exemplo: link.nome, link.icone e link.arquivo.

    const linksHTML = links.map(link => {


        // Compara o nome do arquivo atual com o arquivo
        // correspondente ao item do menu.
        //
        // Se forem iguais, adiciona a classe "active".
        // Se forem diferentes, deixa a classe vazia.

        const ativo = paginaAtual === link.arquivo
            ? "active"
            : "";


        // return devolve o HTML criado para cada objeto.
        //
        // Utilizamos crases (`) para escrever HTML
        // dentro de uma template string.
        //
        // ${} permite inserir valores do JavaScript
        // diretamente dentro dessa estrutura.

        return `

            <li class="${ativo}">

                <!-- Link para a página correspondente -->
                <a href="./${link.arquivo}">

                    <!-- Ícone da opção do menu -->
                    <span class="menu-icon">
                        ${link.icone}
                    </span>

                    <!-- Texto da opção do menu -->
                    <span class="menu-text">
                        ${link.nome}
                    </span>

                </a>

            </li>

        `;


    // join("") junta todos os HTMLs retornados pelo map()
    // em uma única string, sem adicionar separadores.
    }).join("");


    // ==================================================
    // 5. MONTA A ESTRUTURA COMPLETA DA SIDEBAR
    // ==================================================

    // Criamos uma template string com o HTML da sidebar.
    //
    // ${linksHTML} insere os itens gerados anteriormente
    // dentro da lista <ul>.

    const sidebarHTML = `

        <!-- Estrutura principal da sidebar -->
        <aside class="sidebar">


            <!-- Cabeçalho da sidebar -->
            <div class="sidebar-header">

                <!-- Nome e identificação do sistema -->
                <div class="sidebar-title-group">

                    <h2>SIGOH</h2>

                    <p>Ortopedia Hospitalar</p>

                </div>

            </div>


            <!-- Lista de opções do menu -->
            <ul class="sidebar-menu">

                <!-- Itens gerados dinamicamente pelo map() -->
                ${linksHTML}

            </ul>


            <!-- Rodapé da sidebar -->
            <div class="sidebar-footer">


                <!-- Botão de alteração do tema -->
                <button
                    id="themeToggle"
                    class="theme-toggle-btn"
                    type="button"
                    style="width: 100%; justify-content: center;"
                >

                    <span class="theme-emoji">🌙</span>

                    <span class="theme-label">
                        Modo Noturno
                    </span>

                </button>


                <!-- Link para sair do sistema -->
                <a href="../index.html" class="btn-sair">

                    <span class="menu-icon">↩</span>

                    <span class="menu-text">
                        Sair
                    </span>

                </a>


            </div>

        </aside>

    `;


    // ==================================================
    // 6. INSERE A SIDEBAR NO DOCUMENTO HTML
    // ==================================================

    // getElementById() procura no HTML um elemento
    // que possua o ID "sidebar-container".
    //
    // Esse elemento funciona como espaço reservado
    // para receber a sidebar.

    const container = document.getElementById("sidebar-container");


    // Verifica se o elemento foi encontrado.
    //
    // Se container existir, executa o código dentro
    // das chaves.
    //
    // Essa verificação evita tentar inserir HTML
    // em um elemento que não existe.

    if (container) {

        // innerHTML insere o conteúdo da variável sidebarHTML
        // dentro do elemento sidebar-container.
        //
        // Assim, toda a estrutura da sidebar aparece na página.

        container.innerHTML = sidebarHTML;

    }

}


// ======================================================
// 7. EXECUTA A FUNÇÃO
// ======================================================

// Até aqui, apenas declaramos a função.
// Esta chamada efetivamente inicia sua execução.
//
// Quando o navegador executa esta linha, a função
// renderSidebar() realiza todas as etapas anteriores.

renderSidebar();
