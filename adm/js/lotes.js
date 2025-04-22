let loteParaExcluir = null;

function abrirModal(botao) {
  const lote = botao.closest('.lote');
  loteParaExcluir = lote;

  const titulo = lote.querySelector('.titulo-lote').textContent;
  const textoModal = document.getElementById('texto-modal');
  textoModal.textContent = `TEM CERTEZA QUE DESEJA EXCLUIR O ${titulo.toUpperCase()}?`;

  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
  loteParaExcluir = null;
}

function confirmarExclusao() {
  if (loteParaExcluir) {
    loteParaExcluir.remove();
    fecharModal();
  }
}
// Aqui você pode adicionar funcionalidade para os botões futuramente, por exemplo:
document.querySelectorAll('.excluir').forEach(botao => {
  botao.addEventListener('click', () => {
    alert('Função de exclusão aqui...');
  });
});
