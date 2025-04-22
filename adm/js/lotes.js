document.querySelectorAll('.excluir').forEach(botao => {
    botao.addEventListener('click', () => {
      const loteCard = botao.closest('.lote-card');
      const nomeLote = loteCard.getAttribute('data-lote');
  
      const modal = document.getElementById('modal-confirmacao');
      const mensagem = document.getElementById('mensagem-modal');
      mensagem.textContent = `TEM CERTEZA QUE DESEJA EXCLUIR O ${nomeLote}?`;
  
      modal.style.display = 'flex';
  
      // Confirmação
      document.getElementById('btn-confirmar').onclick = () => {
        loteCard.remove();
        modal.style.display = 'none';
      };
  
      // Cancelar
      document.getElementById('btn-cancelar').onclick = () => {
        modal.style.display = 'none';
      };
    });
  });
  function abrirModal() {
    document.getElementById("modal").style.display = "flex";
  }
  
  function fecharModal() {
    document.getElementById("modal").style.display = "none";
  }
  
  function confirmarExclusao() {
    alert("Lote excluído com sucesso!");
    fecharModal();
  }
    