document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login') || document.querySelector('form');

    if (formLogin) {
        formLogin.addEventListener('submit', (event) => {
            // Evita o recarregamento padrão da página
            event.preventDefault();

            // Captura qualquer valor digitado para teste
            const email = formLogin.querySelector('input[type="email"]')?.value || 'usuario@sigoh.com';
            
            // Salva o login na sessão do navegador
            sessionStorage.setItem('usuarioLogado', email);

            // Redireciona para a página principal / dashboard
            // Se o arquivo estiver na raiz como index.html:
            window.location.href = '../index.html'; 
            // Caso seu dashboard seja dashboard.html na mesma pasta pages:
            // window.location.href = 'dashboard.html';
        });
    }
});
