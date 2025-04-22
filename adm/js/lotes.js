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
    const todosLotes = document.querySelectorAll('.lote');

    // Se o usuário ativou este lote
    if (checkbox.checked) {
      todosLotes.forEach(lote => {
        const input = lote.querySelector('.switch input');
        const statusText = lote.querySelector('.status-text');
        const descricao = lote.querySelector('.info');

        if (input !== checkbox) {
          input.checked = false;
          statusText.textContent = 'STATUS: DESATIVADO';
          descricao.textContent = 'LOTE NÃO INICIADO';
          lote.classList.remove('ativo');
          lote.classList.add('inativo');
        } else {
          statusText.textContent = 'STATUS: ATIVADO';
          descricao.innerHTML = 'Restam 50 ingressos<br>para o fim do lote';
          lote.classList.add('ativo');
          lote.classList.remove('inativo');
        }
      });
    } else {
      // Se o usuário desativou o único ativo
      const lote = checkbox.closest('.lote');
      const statusText = lote.querySelector('.status-text');
      const descricao = lote.querySelector('.info');
      statusText.textContent = 'STATUS: DESATIVADO';
      descricao.textContent = 'LOTE NÃO INICIADO';
      lote.classList.remove('ativo');
      lote.classList.add('inativo');
    }
  });
});
