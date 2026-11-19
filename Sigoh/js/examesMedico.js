document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DADOS DEMONSTRATIVOS DO MÉDICO E PACIENTE
    // ==========================================

    const medico = {
        nome: "Dr. Carlos Ribeiro",
        crm: "54321",
        especialidade: "Ortopedista"
    };

    const paciente = {
        nome: "Ana Paula Mendonça",
        idade: 42,
        sexo: "Feminino",
        convenio: "Unimed Nacional",
        consulta: "#2024-08-0047"
    };

    // ==========================================
    // CHAVES DO LOCALSTORAGE
    // ==========================================

    const CHAVE_SOLICITACOES = "sigoh_solicitacoes_exames";
    const CHAVE_EXAMES_FISICOS = "sigoh_exames_fisicos";

    // ==========================================
    // CATÁLOGO
    // ==========================================

    const exames = [
        {
            nome: "Raio-X",
            descricao: "Radiografia para avaliação óssea e articular."
        },
        {
            nome: "Ressonância Magnética",
            descricao: "Avaliação detalhada de tecidos e articulações."
        },
        {
            nome: "Tomografia Computadorizada",
            descricao: "Imagens detalhadas das estruturas anatômicas."
        },
        {
            nome: "Ultrassonografia",
            descricao: "Avaliação de tecidos moles e estruturas."
        },
        {
            nome: "Hemograma",
            descricao: "Avaliação geral das células sanguíneas."
        },
        {
            nome: "Densitometria Óssea",
            descricao: "Avaliação da densidade mineral óssea."
        },
        {
            nome: "Eletrocardiograma",
            descricao: "Registro da atividade elétrica cardíaca."
        },
        {
            nome: "Exames Laboratoriais",
            descricao: "Exames laboratoriais complementares."
        }
    ];

    let examesSelecionados = [];

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const peso = document.getElementById("peso");
    const altura = document.getElementById("altura");
    const imc = document.getElementById("imc");

    const pressao = document.getElementById("pressao");
    const frequencia = document.getElementById("frequencia");

    const segmento = document.getElementById("segmento");
    const mobilidade = document.getElementById("mobilidade");
    const inspecao = document.getElementById("inspecao");
    const testes = document.getElementById("testes");
    const forca = document.getElementById("forca");

    const buscarExame = document.getElementById("buscarExame");
    const catalogoExames = document.getElementById("catalogoExames");
    const contadorExames = document.getElementById("contadorExames");

    const justificativa = document.getElementById("justificativa");
    const observacoesExames = document.getElementById("observacoesExames");

    const listaSolicitacoes =
        document.getElementById("listaSolicitacoesMedico");

    const solicitacoesVazias =
        document.getElementById("solicitacoesVazias");

    // ==========================================
    // LOCALSTORAGE
    // ==========================================

    function obterDados(chave) {

        try {
            return JSON.parse(localStorage.getItem(chave)) || [];
        } catch (erro) {
            console.error("Erro ao ler dados:", erro);
            return [];
        }

    }

    function salvarDados(chave, dados) {

        localStorage.setItem(
            chave,
            JSON.stringify(dados)
        );

    }

    // ==========================================
    // CALCULAR IMC
    // ==========================================

    function calcularIMC() {

        const pesoValor = Number(peso.value);
        const alturaValor = Number(altura.value);

        if (pesoValor > 0 && alturaValor > 0) {

            imc.value = (
                pesoValor / (alturaValor * alturaValor)
            ).toFixed(2);

        } else {

            imc.value = "";

        }

    }

    peso.addEventListener("input", calcularIMC);
    altura.addEventListener("input", calcularIMC);

    // ==========================================
    // RENDERIZAR CATÁLOGO
    // ==========================================

    function renderizarCatalogo(filtro = "") {

        catalogoExames.innerHTML = "";

        const encontrados = exames.filter(exame =>
            exame.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        if (encontrados.length === 0) {

            catalogoExames.innerHTML = `
                <p class="mensagem-vazia">
                    Nenhum exame encontrado.
                </p>
            `;

            return;

        }

        encontrados.forEach(exame => {

            const selecionado =
                examesSelecionados.includes(exame.nome);

            const item = document.createElement("label");

            item.className =
                "exame-opcao" +
                (selecionado ? " selecionado" : "");

            item.innerHTML = `
                <input
                    type="checkbox"
                    ${selecionado ? "checked" : ""}
                >

                <div>
                    <strong>${exame.nome}</strong>
                    <small>${exame.descricao}</small>
                </div>
            `;

            const checkbox = item.querySelector("input");

            checkbox.addEventListener("change", () => {

                if (checkbox.checked) {

                    if (!examesSelecionados.includes(exame.nome)) {
                        examesSelecionados.push(exame.nome);
                    }

                } else {

                    examesSelecionados =
                        examesSelecionados.filter(
                            nome => nome !== exame.nome
                        );

                }

                item.classList.toggle(
                    "selecionado",
                    checkbox.checked
                );

                atualizarContador();

            });

            catalogoExames.appendChild(item);

        });

        atualizarContador();

    }

    // ==========================================
    // CONTADOR
    // ==========================================

    function atualizarContador() {

        contadorExames.textContent =
            examesSelecionados.length;

    }

    // ==========================================
    // BUSCAR EXAMES
    // ==========================================

    buscarExame.addEventListener("input", () => {

        renderizarCatalogo(buscarExame.value);

    });

    // ==========================================
    // LIMPAR SELEÇÃO
    // ==========================================

    document
        .getElementById("limparSolicitacao")
        .addEventListener("click", () => {

            examesSelecionados = [];

            justificativa.value = "";
            observacoesExames.value = "";
            buscarExame.value = "";

            renderizarCatalogo();

        });

    // ==========================================
    // ENVIAR SOLICITAÇÃO
    // ==========================================

    document
        .getElementById("solicitarExames")
        .addEventListener("click", () => {

            if (examesSelecionados.length === 0) {

                alert("Selecione pelo menos um exame.");

                return;

            }

            if (!justificativa.value.trim()) {

                alert("Informe a justificativa clínica.");

                justificativa.focus();

                return;

            }

            const agora = new Date();

            const codigo =
                "EX-" +
                agora.getFullYear() +
                "-" +
                String(agora.getTime()).slice(-6);

            const solicitacao = {

                codigo: codigo,
                id: codigo,

                paciente: paciente.nome,
                pacienteNome: paciente.nome,

                consulta: paciente.consulta,
                consultaCodigo: paciente.consulta,

                medico: medico.nome,
                crm: medico.crm,
                especialidade: medico.especialidade,

                exames: [...examesSelecionados],

                data: agora.toISOString().split("T")[0],

                dataSolicitacao: agora.toISOString().split("T")[0],

                status: "Pendente",

                justificativa: justificativa.value.trim(),

                observacoes: observacoesExames.value.trim()

            };

            const lista = obterDados(CHAVE_SOLICITACOES);

            lista.unshift(solicitacao);

            salvarDados(CHAVE_SOLICITACOES, lista);

            alert(
                "Solicitação enviada com sucesso!\n\n" +
                "Código: " + codigo
            );

            examesSelecionados = [];

            justificativa.value = "";
            observacoesExames.value = "";
            buscarExame.value = "";

            renderizarCatalogo();
            renderizarSolicitacoes();

        });

    // ==========================================
    // LISTAR SOLICITAÇÕES
    // ==========================================

    function renderizarSolicitacoes() {

        const lista = obterDados(CHAVE_SOLICITACOES);

        listaSolicitacoes.innerHTML = "";

        if (lista.length === 0) {

            solicitacoesVazias.style.display = "block";

            return;

        }

        solicitacoesVazias.style.display = "none";

        lista.forEach(solicitacao => {

            const tr = document.createElement("tr");

            const examesTexto = Array.isArray(solicitacao.exames)
                ? solicitacao.exames.join(", ")
                : solicitacao.exames || "—";

            const data =
                solicitacao.data ||
                solicitacao.dataSolicitacao ||
                "";

            tr.innerHTML = `
                <td>
                    ${solicitacao.codigo || solicitacao.id || "—"}
                </td>

                <td>
                    ${solicitacao.paciente || solicitacao.pacienteNome || "—"}
                </td>

                <td>
                    ${examesTexto}
                </td>

                <td>
                    ${formatarData(data)}
                </td>

                <td>
                    <span class="status-badge ${
                        normalizarStatus(solicitacao.status)
                    }">
                        ${solicitacao.status || "Pendente"}
                    </span>
                </td>
            `;

            listaSolicitacoes.appendChild(tr);

        });

    }

    // ==========================================
    // FORMATAR DATA
    // ==========================================

    function formatarData(data) {

        if (!data) return "—";

        const partes = data.split("-");

        if (partes.length === 3) {

            return `${partes[2]}/${partes[1]}/${partes[0]}`;

        }

        return data;

    }

    // ==========================================
    // STATUS
    // ==========================================

    function normalizarStatus(status) {

        if (!status) return "";

        const texto = status.toLowerCase();

        if (
            texto.includes("conclu") ||
            texto.includes("realizado")
        ) {
            return "concluido";
        }

        return "";

    }

    // ==========================================
    // SALVAR EXAME FÍSICO
    // ==========================================

    document
        .getElementById("salvarExameFisico")
        .addEventListener("click", () => {

            const registro = {

                id: "EF-" + Date.now(),

                paciente: paciente.nome,

                consulta: paciente.consulta,

                medico: medico.nome,

                crm: medico.crm,

                data: new Date().toISOString().split("T")[0],

                sinaisVitais: {

                    peso: peso.value || null,

                    altura: altura.value || null,

                    imc: imc.value || null,

                    pressao: pressao.value || null,

                    frequenciaCardiaca: frequencia.value || null

                },

                avaliacao: {

                    segmento: segmento.value,

                    mobilidade: mobilidade.value,

                    inspecao: inspecao.value,

                    testes: testes.value,

                    forca: forca.value

                }

            };

            const lista = obterDados(CHAVE_EXAMES_FISICOS);

            lista.unshift(registro);

            salvarDados(CHAVE_EXAMES_FISICOS, lista);

            alert("Exame físico salvo com sucesso!");

        });

    // ==========================================
    // LIMPAR EXAME FÍSICO
    // ==========================================

    document
        .getElementById("limparExameFisico")
        .addEventListener("click", () => {

            peso.value = "";
            altura.value = "";
            imc.value = "";

            pressao.value = "";
            frequencia.value = "";

            segmento.value = "";
            mobilidade.value = "";
            inspecao.value = "";
            testes.value = "";
            forca.value = "";

        });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    renderizarCatalogo();

    renderizarSolicitacoes();

});