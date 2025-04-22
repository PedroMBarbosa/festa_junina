  let loteParaExcluir = null;

  document.querySelectorAll('.excluir').forEach(botao => {
    botao.addEventListener('click', () => abrirModal(botao));
  });

  function abrirModal(botao) {
    const lote = botao.closest('.lote');
    const titulo = lote.querySelector('h2').textContent;
    document.getElementById('texto-modal').textContent = `TEM CERTEZA QUE DESEJA EXCLUIR ${titulo}?`;
    document.getElementById('modal').style.display = 'flex';
    loteParaExcluir = lote;
  }

  function fecharModal() {
    document.getElementById('modal').style.display = 'none';
    loteParaExcluir = null;
  }

  function confirmarExclusao() {
    if (loteParaExcluir) {
      loteParaExcluir.remove();
    }
    fecharModal();
  }

  document.querySelectorAll('.switch input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const lote = checkbox.closest('.lote');
      const statusText = lote.querySelector('.status-texto');
      const descricao = lote.querySelector('.descricao');
  
      if (checkbox.checked) {
        // Lote ativado
        statusText.textContent = 'STATUS: ATIVADO';
        descricao.innerHTML = 'Restam 50 ingressos<br>para o fim do lote';
      } else {
        // Lote desativado
        statusText.textContent = 'STATUS: DESATIVADO';
        descricao.textContent = 'LOTE NÃO INICIADO';
      }
    });
  });
  