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
        alert("Lote excluído com sucesso!");
        carregarLotes(); // atualiza a lista
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
    .then(res => res.json())
    .then(lotes => {
      const container = document.getElementById("container-lotes");
      container.innerHTML = "";

      lotes.forEach(lote => {
        const ativo = lote.ativo === 1;
        const elemento = `
          <div class="lote ${ativo ? "ativo" : "inativo"}">
            <strong>${lote.nome || "LOTE SEM NOME"}</strong>
            <div class="acoes">
              <button class="editar">EDITAR</button>
              <button class="excluir" onclick="abrirModal(this)" data-id="${lote.id}">EXCLUIR</button>
              <p class="info">${ativo ? "Restam 50 ingressos para o fim do lote" : "LOTE NÃO INICIADO"}</p>
              <p class="status-text">STATUS: ${ativo ? "ATIVADO" : "DESATIVADO"}</p>
              <label class="switch">
                <input type="checkbox" ${ativo ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", elemento);
      });

      ativarSwitches();
    })
    .catch(erro => {
      console.error("Erro ao carregar lotes:", erro);
    });
}

function ativarSwitches() {
  const switches = document.querySelectorAll(".switch input[type='checkbox']");

  switches.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const loteAtivado = checkbox.checked;
      const loteAtual = checkbox.closest(".lote");

      if (loteAtivado) {
        switches.forEach((outroCheckbox) => {
          const outroLote = outroCheckbox.closest(".lote");

          if (outroCheckbox !== checkbox) {
            outroCheckbox.checked = false;
            outroLote.classList.remove("ativo");
            outroLote.classList.add("inativo");
            outroLote.querySelector(".status-text").textContent = "STATUS: DESATIVADO";
            outroLote.querySelector(".info").textContent = "LOTE NÃO INICIADO";

            const id = outroLote.querySelector("button.excluir").getAttribute("data-id");
            atualizarStatus(id, false);
          }
        });

        loteAtual.classList.remove("inativo");
        loteAtual.classList.add("ativo");
        loteAtual.querySelector(".status-text").textContent = "STATUS: ATIVADO";
        loteAtual.querySelector(".info").textContent = "Restam 50 ingressos para o fim do lote";

        const id = loteAtual.querySelector("button.excluir").getAttribute("data-id");
        atualizarStatus(id, true);
      } else {
        checkbox.checked = true;
      }
    });
  });
}

function atualizarStatus(id, ativar) {
  fetch(`http://10.90.146.37/api/api/Lote/AtivarDesativar/${id}?ativo=${ativar ? 1 : 0}`, {
    method: "PUT"
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao atualizar status do lote");
      return res.json();
    })
    .then(() => {
      console.log(`Lote ${id} ${ativar ? "ativado" : "desativado"}`);
    })
    .catch(err => {
      console.error("Erro ao alterar status do lote:", err);
    });
}

function adicionarLote() {
  const valor = document.getElementById('valor').value;
  const abertura = document.getElementById('abertura').value;
  const fechamento = document.getElementById('fechamento').value;
  const quantidade = document.getElementById('quantidade').value;

  if (!valor || !abertura || !fechamento || !quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  const valorNumerico = parseFloat(valor.replace("R$", "").replace(",", "."));
  const valorInfantil = (valorNumerico * 0.5).toFixed(2);

  const payload = {
    id: 0,
    qtd_total: parseInt(quantidade),
    data_inicio: new Date(abertura).toISOString(),
    data_termino: new Date(fechamento).toISOString(),
    valor_un: valorNumerico,
    usuario_id: 1,
    ativo: 0
  };

  fetch("http://10.90.146.37/api/api/Lote/CadastrarLote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao cadastrar lote.");
      return response.json();
    })
    .then(data => {
      alert("Lote cadastrado com sucesso!");
      carregarLotes();

      document.getElementById("valor").value = "";
      document.getElementById("abertura").value = "";
      document.getElementById("fechamento").value = "";
      document.getElementById("quantidade").value = "";
    })
    .catch(error => {
      console.error(error);
      alert("Falha ao cadastrar o lote.");
    });
}

function cancelar() {
  document.getElementById("valor").value = "";
  document.getElementById("abertura").value = "";
  document.getElementById("fechamento").value = "";
  document.getElementById("quantidade").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  carregarLotes();
});
