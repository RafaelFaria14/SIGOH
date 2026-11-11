

document.addEventListener('DOMContentLoaded', () => {

    const formLogin = document.getElementById('form-login')
        || document.querySelector('.auth-form');

    const seletor = document.querySelector('.profile-selector');
    const botoesPerfil = document.querySelectorAll('.btn-profile');

    const labelEmail = document.getElementById('label-email');
    const inputEmail = document.getElementById('email');

    const perfis = {
        medico: {
            label: 'E-mail Corporativo',
            placeholder: 'medico@hospital.com.br'
        },

        enfermeiro: {
            label: 'E-mail Corporativo',
            placeholder: 'enfermeiro@hospital.com.br'
        },

        paciente: {
            label: 'E-mail do Paciente',
            placeholder: 'paciente@email.com'
        }
    };

    let perfilSelecionado = 'medico';

    // Seleção e animação dos perfis
    botoesPerfil.forEach((botao, index) => {

        botao.addEventListener('click', () => {

            perfilSelecionado = botao.dataset.perfil;

            // Atualiza o botão ativo
            botoesPerfil.forEach(btn => {
                btn.classList.remove('active');
            });

            botao.classList.add('active');

            // Move o indicador deslizante
            seletor.style.setProperty('--perfil-index', index);

            // Atualiza os campos
            const perfil = perfis[perfilSelecionado];

            if (perfil) {
                labelEmail.textContent = perfil.label;
                inputEmail.placeholder = perfil.placeholder;
            }

        });

    });

    // Configuração inicial
    const perfilInicial = document.querySelector(
        '.btn-profile.active'
    );

    if (perfilInicial) {
        const index = Array.from(botoesPerfil).indexOf(perfilInicial);
        perfilSelecionado = perfilInicial.dataset.perfil;

        seletor.style.setProperty('--perfil-index', index);

        const perfil = perfis[perfilSelecionado];

        if (perfil) {
            labelEmail.textContent = perfil.label;
            inputEmail.placeholder = perfil.placeholder;
        }
    }

    // Envio do formulário
    if (formLogin) {

        formLogin.addEventListener('submit', (event) => {

            event.preventDefault();

            const email = inputEmail.value;

            sessionStorage.setItem('usuarioLogado', email);
            sessionStorage.setItem('perfilUsuario', perfilSelecionado);

            window.location.href = './dashboard.html';

        });

    }

});
