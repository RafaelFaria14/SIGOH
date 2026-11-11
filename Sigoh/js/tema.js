// Aplicação imediata do tema salvo no localStorage antes de pintar a tela
(function() {
  const temaSalvo = localStorage.getItem('sigo_theme');
  if (temaSalvo === 'light') {
    document.documentElement.classList.add('light-mode');
  } else {
    document.documentElement.classList.remove('light-mode');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const isLight = document.documentElement.classList.contains('light-mode');
  atualizarBotoes(isLight);

  // Vincula evento de alternância a qualquer botão de tema presente na página
  document.querySelectorAll('#themeToggle, .theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const novoEstadoLight = document.documentElement.classList.toggle('light-mode');
      if (document.body) {
        document.body.classList.toggle('light-mode', novoEstadoLight);
      }
      localStorage.setItem('sigo_theme', novoEstadoLight ? 'light' : 'dark');
      atualizarBotoes(novoEstadoLight);
    });
  });

  function atualizarBotoes(light) {
    document.querySelectorAll('#themeToggle, .theme-toggle-btn').forEach(btn => {
      const emojiSpan = btn.querySelector('.theme-emoji');
      const labelSpan = btn.querySelector('.theme-label');
      if (light) {
        if (emojiSpan) emojiSpan.textContent = '🌙';
        if (labelSpan) labelSpan.textContent = 'Modo Noturno';
      } else {
        if (emojiSpan) emojiSpan.textContent = '☀️';
        if (labelSpan) labelSpan.textContent = 'Modo Claro';
      }
    });
  }
});

// Função universal de navegação com transição suave (degradê de troca)
window.irPara = function(url) {
  const wrapper = document.querySelector('.page-wrapper') || document.body;
  wrapper.classList.add('page-fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 220);
};
