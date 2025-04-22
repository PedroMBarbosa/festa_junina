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

