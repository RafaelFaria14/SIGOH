
/* =========================================
   SIGOH - CONSULTAS DO PACIENTE
========================================= */

// 1. DADOS DEMONSTRATIVOS

const medicos = {
    Ortopedia: [
        { nome: "Dr. Rafael Faria", crm: "14067-GO" },
        { nome: "Dra. liz macedo", crm: "23456-GO" }
    ],

    Traumatologia: [
        { nome: "Dr. Rennan Fidelis", crm: "34567-GO" }
    ],

    Fisiatria: [
        { nome: "Dra. Sofia Espanha", crm: "45678-GO" }
    ]
};

const horarios = [
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00"
];

const hoje = () => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
};

const dataFutura = dias => {
    const data = new Date();
    data.setDate(data.getDate() + dias);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
};


// 2. ARMAZENAMENTO

const CHAVE = "sigoh_consultas_paciente";

const exemplos = [
    {
        codigo: "CON001",
        especialidade: "Ortopedia",
        medico: "Dr. Rafael Faria",
        crm: "14067-GO",
        data: dataFutura(3),
        horario: "09:00",
        sala: "Sala 02",
        status: "Confirmada"
    },
    {
        codigo: "CON002",
        especialidade: "Traumatologia",
        medico: "Dr. Rennan Fidelis",
        crm: "34567-GO",
        data: dataFutura(7),
        horario: "14:00",
        sala: "Sala 04",
        status: "Pendente"
    },
    {
        codigo: "CON003",
        especialidade: "Ortopedia",
        medico: "Dra. Fernanda Lima",
        crm: "23456-GO",
        data: dataFutura(-10),
        horario: "10:00",
        sala: "Sala 01",
        status: "Realizada"
    }
];


/*
=================================================
 SIGOH - ARMAZENAMENTO DE CONSULTAS
=================================================

 Objetivo:
 Recuperar consultas salvas no navegador
 e salvar alterações realizadas pelo paciente.

*/


// ================================================
// 1. RECUPERAR DADOS DO NAVEGADOR
// ================================================

// localStorage.getItem(CHAVE):
// Procura os dados armazenados usando a chave.
//
// JSON.parse():
// Converte o texto JSON em dados JavaScript.
//
// let:
// Permite alterar o valor da variável posteriormente.

let consultas = JSON.parse(
    localStorage.getItem(CHAVE)
);


// ================================================
// 2. VERIFICAR SE EXISTEM DADOS
// ================================================

// if:
// Executa um bloco quando a condição é verdadeira.
//
// !consultas:
// Significa que não existem dados recuperados.
//
// Se não houver consultas salvas,
// utilizamos os dados demonstrativos.

if (!consultas) {

    // Copia a referência do array de exemplos
    // para a variável consultas.

    consultas = exemplos;

    // Salva os exemplos no navegador.

    salvar();

}


// ================================================
// 3. FUNÇÃO PARA SALVAR CONSULTAS
// ================================================

function salvar() {

    // JSON.stringify():
    // Converte o array de consultas em texto JSON.
    //
    // localStorage.setItem():
    // Salva esse texto no navegador.
    //
    // CHAVE:
    // Identifica o armazenamento.

    localStorage.setItem(
        CHAVE,
        JSON.stringify(consultas)
    );

}


// 3. ELEMENTOS DO HTML

const $ = id => document.getElementById(id);

const formulario = $("formularioConsulta");
const form = $("formNovaConsulta");

const especialidade = $("especialidade");
const medico = $("medico");
const dataConsulta = $("dataConsulta");
const horario = $("horario");

const modal = $("modalDetalhes");

dataConsulta.min = hoje();


// 4. ABRIR E FECHAR FORMULÁRIO

function fecharFormulario() {
    formulario.hidden = true;
    form.reset();

    medico.disabled = true;
    horario.disabled = true;

    medico.innerHTML =
        '<option value="">Selecione primeiro a especialidade</option>';

    horario.innerHTML =
        '<option value="">Selecione médico e data</option>';
}

$("btnNovaConsulta").onclick = () => {
    formulario.hidden = false;
    formulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};

$("btnFecharFormulario").onclick = fecharFormulario;
$("btnCancelarFormulario").onclick = fecharFormulario;


// 5. SELEÇÃO DE MÉDICOS

especialidade.onchange = () => {
    const lista = medicos[especialidade.value] || [];

    medico.innerHTML = '<option value="">Selecione um médico</option>';

    lista.forEach(item => {
        medico.add(new Option(item.nome, item.crm));
    });

    medico.disabled = lista.length === 0;

    atualizarHorarios();
};


// 6. HORÁRIOS DISPONÍVEIS

// Atualiza os horários conforme o médico e a data escolhidos
function atualizarHorarios() {

    // Limpa as opções antigas
    horario.innerHTML = '<option value="">Selecione um horário</option>';

    // Verifica se médico e data foram selecionados
    if (!medico.value || !dataConsulta.value) {
        horario.disabled = true;
        return; // Interrompe a função
    }

    // Encontra consultas do mesmo médico e da mesma data
    // Ignora consultas canceladas ou com cancelamento solicitado
    const ocupados = consultas
        .filter(c =>
            c.crm === medico.value &&
            c.data === dataConsulta.value &&
            !["Cancelada", "Cancelamento solicitado"].includes(c.status)
        )
        .map(c => c.horario); // Extrai somente os horários

    // Retira os horários ocupados da lista geral
    const livres = horarios.filter(h => !ocupados.includes(h));

    // Adiciona os horários livres ao campo de seleção
    livres.forEach(h => horario.add(new Option(h, h)));

    // Informa quando não existem horários disponíveis
    if (livres.length === 0) {
        horario.add(new Option("Nenhum horário disponível", ""));
    }

    // Desabilita o campo se não houver horários livres
    horario.disabled = livres.length === 0;
}

// Atualiza os horários quando o médico ou a data mudarem
medico.onchange = atualizarHorarios;
dataConsulta.onchange = atualizarHorarios;

// 7. SOLICITAR CONSULTA

// Executa quando o formulário é enviado
form.onsubmit = event => {

    // Impede o recarregamento padrão da página
    event.preventDefault();

    // Procura o médico selecionado dentro da especialidade
    const profissional = (medicos[especialidade.value] || [])
        .find(m => m.crm === medico.value);

    // Verifica se o médico e o horário foram selecionados
    if (!profissional || !horario.value) {
        alert("Preencha todos os campos corretamente.");
        return; // Interrompe a execução
    }

    // Verifica se o horário já foi ocupado
    const ocupado = consultas.some(c =>
        c.crm === medico.value &&
        c.data === dataConsulta.value &&
        c.horario === horario.value &&
        !["Cancelada", "Cancelamento solicitado"].includes(c.status)
    );

    // Se estiver ocupado, atualiza os horários e interrompe
    if (ocupado) {
        alert("Esse horário não está mais disponível.");
        atualizarHorarios();
        return;
    }

    // Adiciona a nova consulta ao array
    consultas.push({
        codigo: "CON" + Date.now(),
        especialidade: especialidade.value,
        medico: profissional.nome,
        crm: profissional.crm,
        data: dataConsulta.value,
        horario: horario.value,
        sala: "Sala 03",
        status: "Pendente"
    });

    // Salva os dados no localStorage
    salvar();

    // Atualiza as informações exibidas na tela
    atualizarPagina();

    // Fecha e limpa o formulário
    fecharFormulario();

    // Informa que a solicitação foi realizada
    alert("Solicitação realizada com sucesso!");
};

// 8. FORMATAÇÃO E STATUS

// Formata a data para o padrão brasileiro
const formatarData = data => {

    // Divide a data em ano, mês e dia
    const [ano, mes, dia] = data.split("-");

    // Retorna a data no formato DD/MM/AAAA
    return `${dia}/${mes}/${ano}`;
};


// Relaciona cada status com sua classe CSS
const classesStatus = {
    Confirmada: "status-confirmada",
    Pendente: "status-pendente",
    Realizada: "status-realizada",
    Cancelada: "status-cancelada",
    "Cancelamento solicitado": "status-cancelamento"
};


// Gera o HTML do status com sua classe correspondente
const statusHTML = status => `
    <span class="consulta-status ${classesStatus[status] || ""}">
        ${status}
    </span>
`;


// 9. RENDERIZAR CONSULTAS

// ==========================================
// 8. RENDERIZAR PRÓXIMAS CONSULTAS
// ==========================================

function renderizarProximas() {

    // Filtra as consultas que possuem data de hoje ou futura
    // e que não estejam canceladas ou realizadas
    const lista = consultas
        .filter(c =>
            c.data >= hoje() &&
            !["Cancelada", "Realizada"].includes(c.status)
        )

        // Ordena as consultas pela data e horário
        // As consultas mais próximas aparecem primeiro
        .sort((a, b) =>
            (a.data + a.horario).localeCompare(b.data + b.horario)
        );

    // Se existir alguma consulta, esconde a mensagem de lista vazia
    // Se não existir nenhuma, mostra a mensagem
    $("mensagemVazia").hidden = lista.length > 0;

    // Localiza o elemento onde os cards serão exibidos
    // e insere o HTML gerado para cada consulta
    $("listaProximas").innerHTML = lista.map(c => `

        <!-- Card de uma consulta -->
        <article class="consulta-card">

            <!-- Parte superior do card: código e status -->
            <div class="consulta-card__topo">

                <!-- Código identificador da consulta -->
                <span class="consulta-card__codigo">
                    ${c.codigo}
                </span>

                <!-- Gera o HTML do status com sua classe CSS -->
                ${statusHTML(c.status)}

            </div>

            <!-- Especialidade da consulta -->
            <h3>${c.especialidade}</h3>

            <!-- Nome do médico responsável -->
            <p class="consulta-card__medico">
                ${c.medico}
            </p>

            <!-- Informações detalhadas da consulta -->
            <div class="consulta-card__informacoes">

                <!-- Data formatada para o padrão brasileiro -->
                <div>
                    <span>Data</span>
                    <strong>${formatarData(c.data)}</strong>
                </div>

                <!-- Horário da consulta -->
                <div>
                    <span>Horário</span>
                    <strong>${c.horario}</strong>
                </div>

                <!-- Sala onde ocorrerá o atendimento -->
                <div>
                    <span>Sala</span>
                    <strong>${c.sala}</strong>
                </div>

                <!-- CRM do médico -->
                <div>
                    <span>CRM</span>
                    <strong>${c.crm}</strong>
                </div>

            </div>

            <!-- Botões de ação da consulta -->
            <div class="consulta-card__acoes">

                <!-- Botão para abrir os detalhes da consulta -->
                <!-- data-acao identifica a ação -->
                <!-- data-codigo identifica qual consulta será utilizada -->
                <button
                    data-acao="detalhes"
                    data-codigo="${c.codigo}">

                    Detalhes

                </button>

                <!-- Verifica se o status permite solicitar cancelamento -->
                <!-- O botão só aparece para consultas Confirmadas ou Pendentes -->
                ${["Confirmada", "Pendente"].includes(c.status) ? `

                    <button
                        class="btn-cancelar"
                        data-acao="cancelar"
                        data-codigo="${c.codigo}">

                        Solicitar cancelamento

                    </button>

                ` : ""}

            </div>

        </article>

    `).join(""); // Junta todos os cards em uma única string HTML
}


// ==========================================
// 9. RENDERIZAR HISTÓRICO DE CONSULTAS
// ==========================================

function renderizarHistorico() {

    // Filtra as consultas que já passaram
    // ou que foram canceladas / tiveram cancelamento solicitado
    const historico = consultas
        .filter(c =>
            c.data < hoje() ||
            ["Cancelada", "Cancelamento solicitado"].includes(c.status)
        )

        // Ordena o histórico da consulta mais recente
        // para a mais antiga
        .sort((a, b) =>
            (b.data + b.horario).localeCompare(a.data + a.horario)
        );

    // Se houver consultas no histórico, esconde a mensagem de vazio
    // Se não houver, mostra a mensagem
    $("historicoVazio").hidden = historico.length > 0;

    // Localiza o corpo da tabela do histórico
    // e gera uma linha HTML para cada consulta
    $("historicoConsultas").innerHTML = historico.map(c => `

        <!-- Linha correspondente a uma consulta -->
        <tr>

            <!-- Código da consulta -->
            <td>${c.codigo}</td>

            <!-- Especialidade -->
            <td>${c.especialidade}</td>

            <!-- Médico responsável -->
            <td>${c.medico}</td>

            <!-- Data formatada -->
            <td>${formatarData(c.data)}</td>

            <!-- Horário -->
            <td>${c.horario}</td>

            <!-- Status da consulta -->
            <td>${statusHTML(c.status)}</td>

            <!-- Coluna de ações -->
            <td>

                <!-- Botão para visualizar os detalhes -->
                <button
                    data-acao="detalhes"
                    data-codigo="${c.codigo}">

                    Detalhes

                </button>

            </td>

        </tr>

    `).join(""); // Junta todas as linhas da tabela
}

// 10. INDICADORES

function atualizarIndicadores() {

    // Filtra as consultas futuras ou de hoje,
    // ignorando aquelas que foram canceladas ou realizadas.
    const proximas = consultas.filter(c =>
        c.data >= hoje() &&
        !["Cancelada", "Realizada"].includes(c.status)
    );

    // Mostra a quantidade de próximas consultas.
    $("totalProximas").textContent = proximas.length;

    // Filtra as próximas consultas para contar somente as confirmadas.
    $("totalConfirmadas").textContent =
        proximas.filter(c => c.status === "Confirmada").length;

    // Percorre todas as consultas e conta as que já foram realizadas.
    $("totalRealizadas").textContent =
        consultas.filter(c => c.status === "Realizada").length;
}

// 11. DETALHES DA CONSULTA

// 11. DETALHES DA CONSULTA

// Função responsável por exibir os detalhes de uma consulta específica.
// Recebe o código da consulta como parâmetro.
function mostrarDetalhes(codigo) {

    // Procura no array "consultas" uma consulta
    // cujo código seja igual ao código recebido pela função.
    // O find() retorna o primeiro elemento que corresponde à condição.
    const c = consultas.find(item => item.codigo === codigo);

    // Verifica se a consulta foi encontrada.
    // Caso "c" não exista, encerra a função imediatamente.
    if (!c) return;

    // Seleciona o elemento HTML com ID "conteudoDetalhes"
    // e insere nele o HTML contendo os dados da consulta.
    // O innerHTML permite inserir elementos HTML.
    // As crases permitem utilizar uma template string
    // e inserir valores das variáveis usando ${}.
    $("conteudoDetalhes").innerHTML = `
        <div class="consulta-detalhe">

            <!-- Exibe o código da consulta -->
            <div>
                <span>Código</span>
                <strong>${c.codigo}</strong>
            </div>

            <!-- Exibe o status atual da consulta -->
            <div>
                <span>Status</span>
                <strong>${c.status}</strong>
            </div>

            <!-- Exibe a especialidade da consulta -->
            <div>
                <span>Especialidade</span>
                <strong>${c.especialidade}</strong>
            </div>

            <!-- Exibe o nome do médico -->
            <div>
                <span>Médico</span>
                <strong>${c.medico}</strong>
            </div>

            <!-- Exibe o CRM do médico -->
            <div>
                <span>CRM</span>
                <strong>${c.crm}</strong>
            </div>

            <!-- Exibe a data formatada da consulta -->
            <div>
                <span>Data</span>
                <strong>${formatarData(c.data)}</strong>
            </div>

            <!-- Exibe o horário da consulta -->
            <div>
                <span>Horário</span>
                <strong>${c.horario}</strong>
            </div>

            <!-- Exibe a sala da consulta -->
            <div>
                <span>Sala</span>
                <strong>${c.sala}</strong>
            </div>

        </div>
    `;

    // Torna o modal visível na tela.
    // hidden = false significa que o elemento não está escondido.
    modal.hidden = false;
}


// Função responsável por fechar o modal de detalhes.
function fecharDetalhes() {

    // Esconde o modal.
    // hidden = true faz o elemento ficar oculto.
    modal.hidden = true;
}


// Define que, ao clicar no botão com ID "btnFecharDetalhes",
// a função fecharDetalhes() será executada.
$("btnFecharDetalhes").onclick = fecharDetalhes;


// Define que, ao clicar no botão do rodapé do modal,
// a mesma função de fechamento será executada.
$("btnFecharDetalhesRodape").onclick = fecharDetalhes;


// Define um evento de clique no modal.
modal.onclick = event => {

    // Verifica se o clique aconteceu diretamente no modal,
    // ou seja, na área externa ao conteúdo interno.
    // event.target representa o elemento que recebeu o clique.
    // Se o elemento clicado for o próprio modal,
    // executa a função para fechá-lo.
    if (event.target === modal) fecharDetalhes();
};


// 12. CANCELAMENTO

// Função responsável por solicitar o cancelamento de uma consulta.
// Recebe o código da consulta que o usuário deseja cancelar.
function solicitarCancelamento(codigo) {

    // Procura no array "consultas" a consulta
    // que possui o código recebido como parâmetro.
    // O find() retorna a consulta encontrada.
    const consulta = consultas.find(c => c.codigo === codigo);

    // Se a consulta não for encontrada,
    // encerra a função imediatamente.
    if (!consulta) return;

    // Exibe uma caixa de confirmação para o usuário.
    // O confirm() retorna true se o usuário confirmar
    // ou false se ele cancelar/recusar.
    if (!confirm("Deseja solicitar o cancelamento desta consulta?")) {

        // Se o usuário não confirmar,
        // encerra a função sem alterar a consulta.
        return;
    }

    // Altera o status da consulta encontrada.
    // O status passa a ser "Cancelamento solicitado".
    consulta.status = "Cancelamento solicitado";

    // Salva as alterações no localStorage.
    // A função salvar() persiste os dados atualizados.
    salvar();

    // Atualiza a interface da página,
    // redesenhando consultas, histórico e indicadores.
    atualizarPagina();

    // Exibe uma mensagem informando que
    // a solicitação de cancelamento foi registrada.
    alert("Solicitação de cancelamento registrada!");
}


// 13. EVENTOS DOS BOTÕES DINÂMICOS

// Adiciona um evento de clique ao documento inteiro.
// Assim, conseguimos detectar cliques nos botões
// que foram criados dinamicamente pelo JavaScript.
document.addEventListener("click", event => {

    // Procura o botão relacionado ao clique.
    // closest("[data-acao]") busca o próprio elemento clicado
    // ou algum elemento pai que possua o atributo "data-acao".
    // Isso permite que o clique em elementos internos do botão
    // também seja identificado.
    const botao = event.target.closest("[data-acao]");

    // Verifica se nenhum botão com o atributo "data-acao" foi encontrado.
    // Se não encontrou, encerra a função do evento.
    if (!botao) return;

    // Extrai os valores dos atributos data-acao e data-codigo
    // do botão clicado.
    // dataset permite acessar atributos HTML que começam com "data-".
    // A desestruturação cria as variáveis "acao" e "codigo".
    const { acao, codigo } = botao.dataset;

    // Verifica qual ação está associada ao botão.
    // Se a ação for "detalhes", chama a função mostrarDetalhes()
    // passando o código da consulta.
    if (acao === "detalhes") mostrarDetalhes(codigo);

    // Se a ação for "cancelar", chama a função solicitarCancelamento()
    // passando o código da consulta.
    if (acao === "cancelar") solicitarCancelamento(codigo);
});


// 14. ATUALIZAÇÃO GERAL

// Função responsável por atualizar toda a interface da página.
function atualizarPagina() {

    // Atualiza a lista de próximas consultas.
    renderizarProximas();

    // Atualiza a tabela/lista de histórico de consultas.
    renderizarHistorico();

    // Atualiza os indicadores numéricos da página.
    atualizarIndicadores();
}


// 15. INICIALIZAÇÃO

// Executa a função de atualização geral assim que
// este código é executado, carregando os dados na página.
atualizarPagina();