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
    // Aqui você pode integrar um DELETE, se sua API permitir exclusão
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
            <div class="dados">
              <p>R$ ${(lote.valor_un).toFixed(2).replace(".", ",")}</p>
              <p>${new Date(lote.data_inicio).toLocaleString()}</p>
              <p>${new Date(lote.data_termino).toLocaleString()}</p>
              <p class="status-text">STATUS: ${ativo ? "ATIVADO" : "DESATIVADO"}</p>
              <p class="info">${ativo ? "Restam 50 ingressos\npara o fim do lote" : "LOTE NÃO INICIADO"}</p>
            </div>
            <div class="switch">
              <label class="switch">
                <input type="checkbox" ${ativo ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>
            <button onclick="abrirModal(this)">Excluir</button>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", elemento);
      });

      ativarSwitches(); // reativa os listeners nos novos switches
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
        // Impede desmarcar
        checkbox.checked = true;
      }
    });
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
    usuario_id: 1, // ou pegue do localStorage
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
