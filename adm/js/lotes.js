let loteParaExcluir = null;

function abrirModal(botao) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  loteParaExcluir = botao.closest(".lote");
}

function fecharModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  loteParaExcluir = null;
}

function confirmarExclusao() {
  if (loteParaExcluir) {
    loteParaExcluir.remove();
    fecharModal();
  }
}

window.addEventListener("click", function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const switches = document.querySelectorAll(".switch input[type='checkbox']");

  switches.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const loteAtivado = checkbox.checked;
      const loteAtual = checkbox.closest(".lote");

      if (loteAtivado) {
        // Desativa todos os outros
        switches.forEach((outroCheckbox) => {
          const outroLote = outroCheckbox.closest(".lote");

          if (outroCheckbox !== checkbox) {
            outroCheckbox.checked = false;
            outroLote.classList.remove("ativo");
            outroLote.classList.add("inativo");
            outroLote.querySelector(".status-text").textContent = "STATUS: DESATIVADO";
            outroLote.querySelector(".info").textContent = "LOTE NÃO INICIADO";
          }
        });

        // Ativa o atual
        loteAtual.classList.remove("inativo");
        loteAtual.classList.add("ativo");
        loteAtual.querySelector(".status-text").textContent = "STATUS: ATIVADO";
        loteAtual.querySelector(".info").textContent = "Restam 50 ingressos\npara o fim do lote";
      } else {
        // Impede de desmarcar (sempre deve ter um ativo)
        checkbox.checked = true;
      }
    });
  });
});
