let loteParaExcluir = null;
let idParaExcluir = null;

function abrirModal(botao) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  loteParaExcluir = botao.closest(".lote");
  idParaExcluir = botao.getAttribute("data-id");
}

function fecharModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  loteParaExcluir = null;
  idParaExcluir = null;
}

function confirmarExclusao() {
  if (idParaExcluir) {
    fetch(`http://10.90.146.37/api/api/Lote/ExcluirLote/${idParaExcluir}`, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) throw new Error("Erro ao excluir lote.");
        carregarLotes(); // Atualiza a lista
        fecharModal();
      })
      .catch(error => {
        console.error("Erro ao excluir lote:", error);
        alert("Erro ao excluir lote.");
      });
  }
}

window.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
});

function carregarLotes() {
  fetch("http://10.90.146.37/api/api/Lote")
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar lotes");
      return res.json();
    })
    .then(lotes => {
      const container = document.getElementById("container-lotes");
      container.innerHTML = ""; // Limpa o conteúdo do container

      if (lotes.length === 0) {
        container.innerHTML = "<p>Não há lotes disponíveis.</p>";
      }

      lotes.forEach((lote, index) => {
        const ativo = lote.ativo === 1;
        const qtdTotal = lote.qtd_total || 0;
        const dataInicio = new Date(lote.data_inicio).toLocaleDateString("pt-BR");
        const dataTermino = new Date(lote.data_termino).toLocaleDateString("pt-BR");

        const elemento = `
          <div class="lote ${ativo ? "ativo" : "inativo"}" data-id="${lote.id}">
            <strong style="font-size: 35px; font-style: italic;">Lote ${index + 1}</strong>
            <div class="acoes">
              <a href="../views/editarlote.html?id=${lote.id}" class="editar" style="margin-left: 15px;">EDITAR</a>
              <button class="excluir" onclick="abrirModal(this)" data-id="${lote.id}">EXCLUIR</button>
              <p class="info" style="font-size: 20px; font-style: italic;">Quantidade Total: <b>${qtdTotal}</b></p>
              <p class="info" style="font-size: 20px; font-style: italic;">Data de Início: <b>${dataInicio}</b></p>
              <p class="info" style="font-size: 20px; font-style: italic;">Data de Término: <b>${dataTermino}</b></p>
              <p class="status-text" style="font-size: 25px; font-family: consolas;">STATUS: ${ativo ? "ATIVADO" : "DESATIVADO"}</p>
              <label class="switch">
                <input type="checkbox" ${ativo ? "checked" : ""} onchange="atualizarStatus(${lote.id}, this.checked)">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <br>
        `;
        container.insertAdjacentHTML("beforeend", elemento);
      });
    })
    .catch(erro => {
      console.error("Erro ao carregar lotes:", erro);
      alert("Erro ao carregar lotes.");
    });
}

function atualizarStatus(id, ativar) {
  // Buscar os dados do lote pelo ID
  fetch(`http://10.90.146.37/api/api/Lote/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados do lote");
      return res.json();
    })
    .then(lote => {
      // Atualiza apenas o campo 'ativo'
      lote.ativo = ativar ? 1 : 0;

      // Envia os dados completos do lote para atualização
      return fetch(`http://10.90.146.37/api/api/Lote/EditarLote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(lote)
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao atualizar status do lote");
      return res.json();
    })
    .then(() => {
      // Atualiza o status do lote no DOM
      const loteElement = document.querySelector(`.lote[data-id="${id}"]`);
      if (loteElement) {
        const statusText = loteElement.querySelector(".status-text");
        const checkbox = loteElement.querySelector("input[type='checkbox']");

        // Atualiza o status no DOM
        if (checkbox) checkbox.checked = ativar;
        if (statusText) statusText.textContent = `STATUS: ${ativar ? "ATIVADO" : "DESATIVADO"}`;
      }
    })
    .catch(err => {
      console.error("Erro ao alterar status do lote:", err);
      alert("Erro ao alterar status do lote.");
    });
}

function confirmarExclusao() {
  if (idParaExcluir) {
    fetch(`http://10.90.146.37/api/api/Lote/DeletarLote/${idParaExcluir}`, {  // Corrigido aqui
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) throw new Error("Erro ao excluir lote.");
        alert("Lote excluído com sucesso!");
        carregarLotes(); // Atualiza a lista
        fecharModal();
      })
      .catch(error => {
        console.error("Erro ao excluir lote:", error);
        alert("Erro ao excluir lote.");
      });
  }
}


// Carregar os lotes ao carregar a página
window.onload = carregarLotes;
