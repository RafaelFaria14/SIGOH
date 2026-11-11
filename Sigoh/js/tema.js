
// ==========================================
// CONFIGURAÇÃO INICIAL DO TEMA
// ==========================================

(function () {

    const temaSalvo = localStorage.getItem('sigo_theme');

    // Padrão: modo claro
    const temaInicial = temaSalvo || 'light';

    document.documentElement.classList.toggle(
        'light-mode',
        temaInicial === 'light'
    );

    document.documentElement.classList.toggle(
        'dark-mode',
        temaInicial === 'dark'
    );

    // Salva o tema inicial caso ainda não exista
    if (!temaSalvo) {
        localStorage.setItem('sigo_theme', 'light');
    }

})();


// ==========================================
// FUNCIONAMENTO DO BOTÃO DARK / LIGHT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // Localiza os botões de tema
    const botoesTema = document.querySelectorAll(
        '#toggle-tema, #themeToggle, .btn-tema, .theme-toggle-btn'
    );

    function atualizarTema(temaClaro) {

        // Aplica o tema no HTML e no BODY
        document.documentElement.classList.toggle(
            'light-mode',
            temaClaro
        );

        document.documentElement.classList.toggle(
            'dark-mode',
            !temaClaro
        );

        document.body.classList.toggle(
            'light-mode',
            temaClaro
        );

        document.body.classList.toggle(
            'dark-mode',
            !temaClaro
        );

        // Atualiza o botão
        botoesTema.forEach(botao => {

            botao.textContent = temaClaro
                ? '🌙 Modo Noturno'
                : '☀️ Modo Claro';

        });

        // Salva a preferência
        localStorage.setItem(
            'sigo_theme',
            temaClaro ? 'light' : 'dark'
        );
    }

    // Atualiza o texto inicial dos botões
    const temaAtual = localStorage.getItem('sigo_theme');

    atualizarTema(temaAtual !== 'dark');

    // Evento de clique
    botoesTema.forEach(botao => {

        botao.addEventListener('click', (event) => {

            event.preventDefault();

            const estaClaro = document.documentElement.classList.contains(
                'light-mode'
            );

            atualizarTema(!estaClaro);

        });

    });

});


// ==========================================
// NAVEGAÇÃO COM TRANSIÇÃO SUAVE
// ==========================================

window.irPara = function (url) {

    const wrapper = document.querySelector('.page-wrapper')
        || document.body;

    wrapper.classList.add('page-fade-out');

    setTimeout(() => {

        window.location.href = url;

    }, 220);

};
