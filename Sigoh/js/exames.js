
/* =========================================
   SIGOH - PÁGINA DE EXAMES DO PACIENTE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       ELEMENTOS
    ===================================== */

    const listaCatalogo = document.getElementById("listaCatalogoExames");
    const pesquisaExames = document.getElementById("pesquisaExames");
    const catalogoVazio = document.getElementById("catalogoVazio");

    const listaSolicitacoes = document.getElementById("listaSolicitacoes");
    const solicitacoesVazias = document.getElementById("solicitacoesVazias");

    const totalSolicitacoes = document.getElementById("totalSolicitacoes");
    const totalPendentes = document.getElementById("totalPendentes");
    const totalConcluidos = document.getElementById("totalConcluidos");

    const modalExame = document.getElementById("modalExame");
    const tituloModalExame = document.getElementById("tituloModalExame");
    const conteudoModalExame = document.getElementById("conteudoModalExame");
    const btnFecharModalExame = document.getElementById("btnFecharModalExame");

    const modalSolicitacao = document.getElementById("modalSolicitacao");
    const conteudoModalSolicitacao = document.getElementById("conteudoModalSolicitacao");
    const btnFecharSolicitacao = document.getElementById("btnFecharSolicitacao");


    /* =====================================
       CATÁLOGO DE EXAMES
    ===================================== */

    const catalogo = [

        {
            id: 1,
            nome: "Raio-X",
            icone: "🩻",
            descricao: "Exame de imagem utilizado para visualizar ossos e estruturas internas.",
            detalhes: "O raio-X é utilizado principalmente para avaliar fraturas, alterações ósseas e algumas condições articulares."
        },

        {
            id: 2,
            nome: "Ressonância Magnética",
            icone: "🧲",
            descricao: "Exame de imagem detalhado de tecidos, articulações e estruturas internas.",
            detalhes: "A ressonância magnética utiliza campos magnéticos para gerar imagens detalhadas de estruturas internas do corpo."
        },

        {
            id: 3,
            nome: "Tomografia Computadorizada",
            icone: "🖥️",
            descricao: "Exame que produz imagens detalhadas de diferentes partes do corpo.",
            detalhes: "A tomografia utiliza raios-X e processamento computadorizado para produzir imagens em diferentes cortes."
        },

        {
            id: 4,
            nome: "Ultrassonografia",
            icone: "📡",
            descricao: "Exame que utiliza ondas sonoras para visualizar estruturas internas.",
            detalhes: "A ultrassonografia permite avaliar tecidos e órgãos através de ondas sonoras de alta frequência."
        },

        {
            id: 5,
            nome: "Hemograma",
            icone: "🩸",
            descricao: "Exame laboratorial que avalia diferentes componentes do sangue.",
            detalhes: "O hemograma avalia células sanguíneas e auxilia na investigação de diferentes condições clínicas."
        },

        {
            id: 6,
            nome: "Densitometria Óssea",
            icone: "🦴",
            descricao: "Exame utilizado para avaliar a densidade mineral dos ossos.",
            detalhes: "A densitometria óssea auxilia na avaliação da densidade mineral óssea e no acompanhamento de condições relacionadas aos ossos."
        },

        {
            id: 7,
            nome: "Eletrocardiograma",
            icone: "❤️",
            descricao: "Exame que registra a atividade elétrica do coração.",
            detalhes: "O eletrocardiograma registra a atividade elétrica cardíaca e auxilia na avaliação do funcionamento do coração."
        },

        {
            id: 8,
            nome: "Exames Laboratoriais",
            icone: "🧪",
            descricao: "Exames realizados a partir de amostras biológicas.",
            detalhes: "Exames laboratoriais podem analisar sangue, urina e outras amostras para auxiliar na avaliação da saúde."
        }

    ];


    /* =====================================
       UTILITÁRIOS
    ===================================== */

    function escaparHTML(texto) {

        return String(texto ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function obterSolicitacoes() {

        try {

            return JSON.parse(
                localStorage.getItem("sigoh_solicitacoes_exames")
            ) || [];

        } catch (erro) {

            console.error("Erro ao carregar solicitações:", erro);

            return [];

        }

    }


    function formatarData(data) {

        if (!data) {
            return "Não informada";
        }

        const dataObj = new Date(data + "T00:00:00");

        if (isNaN(dataObj.getTime())) {
            return data;
        }

        return dataObj.toLocaleDateString("pt-BR");

    }


    function obterStatus(status) {

        const valor = String(status || "Pendente").toLowerCase();

        if (
            valor.includes("conclu") ||
            valor.includes("realiz")
        ) {

            return {
                texto: "Concluído",
                classe: "status-exame--realizado"
            };

        }

        if (valor.includes("agend")) {

            return {
                texto: "Agendado",
                classe: "status-exame--agendado"
            };

        }

        if (valor.includes("cancel")) {

            return {
                texto: "Cancelado",
                classe: "status-exame--cancelado"
            };

        }

        return {
            texto: "Pendente",
            classe: "status-exame--pendente"
        };

    }


    function obterNomeExames(solicitacao) {

        if (Array.isArray(solicitacao.exames)) {

            return solicitacao.exames.map(exame => {

                if (typeof exame === "string") {
                    return exame;
                }

                return exame.nome || exame.name || "Exame";

            }).join(", ");

        }

        return solicitacao.exames ||
            solicitacao.nomeExame ||
            solicitacao.exame ||
            "Não informado";

    }


    /* =====================================
       RENDERIZAR CATÁLOGO
    ===================================== */

    function renderizarCatalogo(lista = catalogo) {

        listaCatalogo.innerHTML = "";

        if (lista.length === 0) {

            catalogoVazio.hidden = false;
            return;

        }

        catalogoVazio.hidden = true;

        lista.forEach(exame => {

            const card = document.createElement("article");

            card.className = "exame-card";

            card.innerHTML = `

                <span class="exame-card__icone">
                    ${exame.icone}
                </span>

                <h3>${escaparHTML(exame.nome)}</h3>

                <p>
                    ${escaparHTML(exame.descricao)}
                </p>

                <button
                    type="button"
                    class="exame-card__botao"
                    data-exame-id="${exame.id}">
                    Ver informações
                </button>

            `;

            listaCatalogo.appendChild(card);

        });

    }


    /* =====================================
       PESQUISA
    ===================================== */

    pesquisaExames.addEventListener("input", () => {

        const termo = pesquisaExames.value
            .trim()
            .toLowerCase();

        const resultado = catalogo.filter(exame => {

            return exame.nome.toLowerCase().includes(termo) ||
                   exame.descricao.toLowerCase().includes(termo);

        });

        renderizarCatalogo(resultado);

    });


    /* =====================================
       MODAL DE INFORMAÇÕES DO EXAME
    ===================================== */

    listaCatalogo.addEventListener("click", (evento) => {

        const botao = evento.target.closest("[data-exame-id]");

        if (!botao) {
            return;
        }

        const id = Number(botao.dataset.exameId);

        const exame = catalogo.find(item => item.id === id);

        if (!exame) {
            return;
        }

        tituloModalExame.textContent = exame.nome;

        conteudoModalExame.innerHTML = `

            <div class="exame-card__icone">
                ${exame.icone}
            </div>

            <p>
                ${escaparHTML(exame.descricao)}
            </p>

            <p>
                ${escaparHTML(exame.detalhes)}
            </p>

        `;

        modalExame.hidden = false;

    });


    /* =====================================
       RENDERIZAR SOLICITAÇÕES
    ===================================== */

    function renderizarSolicitacoes() {

        const solicitacoes = obterSolicitacoes();

        listaSolicitacoes.innerHTML = "";

        totalSolicitacoes.textContent = solicitacoes.length;

        const pendentes = solicitacoes.filter(solicitacao => {

            const status = obterStatus(solicitacao.status);

            return status.texto === "Pendente" ||
                   status.texto === "Agendado";

        });

        const concluidos = solicitacoes.filter(solicitacao => {

            return obterStatus(solicitacao.status).texto === "Concluído";

        });

        totalPendentes.textContent = pendentes.length;
        totalConcluidos.textContent = concluidos.length;

        solicitacoesVazias.hidden = solicitacoes.length > 0;

        solicitacoes.forEach((solicitacao, index) => {

            const status = obterStatus(solicitacao.status);

            const linha = document.createElement("tr");

            linha.innerHTML = `

                <td>
                    ${escaparHTML(
                        solicitacao.codigo ||
                        solicitacao.id ||
                        `EX-${String(index + 1).padStart(3, "0")}`
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        solicitacao.consulta ||
                        solicitacao.consultaCodigo ||
                        solicitacao.medico ||
                        "Não informada"
                    )}
                </td>

                <td>
                    ${escaparHTML(obterNomeExames(solicitacao))}
                </td>

                <td>
                    ${formatarData(
                        solicitacao.data ||
                        solicitacao.dataSolicitacao
                    )}
                </td>

                <td>
                    <span class="status-exame ${status.classe}">
                        ${status.texto}
                    </span>
                </td>

                <td>
                    <button
                        type="button"
                        class="btn-detalhes-exame"
                        data-solicitacao-index="${index}">
                        Detalhes
                    </button>
                </td>

            `;

            listaSolicitacoes.appendChild(linha);

        });

    }


    /* =====================================
       DETALHES DA SOLICITAÇÃO
    ===================================== */

    listaSolicitacoes.addEventListener("click", (evento) => {

        const botao = evento.target.closest("[data-solicitacao-index]");

        if (!botao) {
            return;
        }

        const index = Number(botao.dataset.solicitacaoIndex);

        const solicitacoes = obterSolicitacoes();

        const solicitacao = solicitacoes[index];

        if (!solicitacao) {
            return;
        }

        const status = obterStatus(solicitacao.status);

        conteudoModalSolicitacao.innerHTML = `

            <p>
                <strong>Código:</strong>
                ${escaparHTML(
                    solicitacao.codigo ||
                    solicitacao.id ||
                    "Não informado"
                )}
            </p>

            <p>
                <strong>Consulta:</strong>
                ${escaparHTML(
                    solicitacao.consulta ||
                    solicitacao.consultaCodigo ||
                    "Não informada"
                )}
            </p>

            <p>
                <strong>Médico responsável:</strong>
                ${escaparHTML(
                    solicitacao.medico ||
                    solicitacao.nomeMedico ||
                    "Não informado"
                )}
            </p>

            <p>
                <strong>Exames:</strong>
                ${escaparHTML(obterNomeExames(solicitacao))}
            </p>

            <p>
                <strong>Data da solicitação:</strong>
                ${formatarData(
                    solicitacao.data ||
                    solicitacao.dataSolicitacao
                )}
            </p>

            <p>
                <strong>Status:</strong>
                <span class="status-exame ${status.classe}">
                    ${status.texto}
                </span>
            </p>

            <p>
                <strong>Observações:</strong>
                ${escaparHTML(
                    solicitacao.observacoes ||
                    solicitacao.observacao ||
                    "Nenhuma observação registrada."
                )}
            </p>

        `;

        modalSolicitacao.hidden = false;

    });


    /* =====================================
       FECHAR MODAIS
    ===================================== */

    function fecharModal(modal) {

        modal.hidden = true;

    }


    btnFecharModalExame.addEventListener("click", () => {

        fecharModal(modalExame);

    });


    btnFecharSolicitacao.addEventListener("click", () => {

        fecharModal(modalSolicitacao);

    });


    modalExame.addEventListener("click", (evento) => {

        if (evento.target === modalExame) {
            fecharModal(modalExame);
        }

    });


    modalSolicitacao.addEventListener("click", (evento) => {

        if (evento.target === modalSolicitacao) {
            fecharModal(modalSolicitacao);
        }

    });


    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {

            fecharModal(modalExame);
            fecharModal(modalSolicitacao);

        }

    });


    /* =====================================
       ATUALIZAÇÃO AUTOMÁTICA
    ===================================== */

    window.addEventListener("storage", (evento) => {

        if (evento.key === "sigoh_solicitacoes_exames") {
            renderizarSolicitacoes();
        }

    });


    /* =====================================
       INICIALIZAÇÃO
    ===================================== */

    renderizarCatalogo();
    renderizarSolicitacoes();

});
