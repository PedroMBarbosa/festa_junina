let loteParaExcluir = null;
let idParaExcluir = null;
const BASE_URL = "http://10.90.146.37/api/Lote";

function abrirModal(botao) {
  document.getElementById("modal").style.display = "flex";
  loteParaExcluir = botao.closest(".lote");
  idParaExcluir = botao.dataset.id;
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
  loteParaExcluir = null;
  idParaExcluir = null;
}

function confirmarExclusao() {
  if (!idParaExcluir) return;

  fetch(`${BASE_URL}/DeletarLote/${idParaExcluir}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error();
      fecharModal();
      carregarLotes();
    })
    .catch(() => alert("Falha ao excluir lote."));
}

window.addEventListener("click", e => {
  if (e.target.id === "modal") fecharModal();
});

function carregarLotes() {
  fetch(BASE_URL)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(lotes => {
      const container = document.getElementById("container-lotes");
      container.innerHTML = "";              // limpa tudo
      if (lotes.length === 0) {
        // nenhum lote cadastrado ainda → nada é renderizado
        return;
      }

      lotes.forEach(lote => {
        const ativo = lote.ativo === 1;
        const html = `
          <div class="lote ${ativo ? "ativo" : "inativo"}">
            <h2>${lote.nome || "LOTE SEM NOME"}</h2>
            <div class="acoes">
              <a href="../views/editarlote.html?id=${lote.id}" class="editar">EDITAR</a>
              <button class="excluir" onclick="abrirModal(this)" data-id="${lote.id}">
                EXCLUIR
              </button>
              <p class="info">
                ${ativo
                  ? `Restam ${lote.qtd_total - lote.qtd_vendida} ingressos`
                  : "LOTE NÃO INICIADO"}
              </p>
              <p class="status-text">STATUS: ${ativo ? "ATIVADO" : "DESATIVADO"}</p>
              <label class="switch">
                <input type="checkbox" ${ativo ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
      });

      ativarSwitches();
    })
    .catch(console.error);
}

function ativarSwitches() {
  const checkboxes = document.querySelectorAll(".switch input");
  checkboxes.forEach(cb =>
    cb.addEventListener("change", () => {
      if (!cb.checked) return (cb.checked = true);

      // desliga todos os outros
      checkboxes.forEach(other => {
        if (other !== cb) {
          other.checked = false;
          const loteEl = other.closest(".lote");
          loteEl.classList.replace("ativo", "inativo");
          loteEl.querySelector(".status-text").textContent = "STATUS: DESATIVADO";
          loteEl.querySelector(".info").textContent = "LOTE NÃO INICIADO";
          atualizarStatus(loteEl.querySelector("button.excluir").dataset.id, 0);
        }
      });

      // liga este
      const atual = cb.closest(".lote");
      atual.classList.replace("inativo", "ativo");
      atual.querySelector(".status-text").textContent = "STATUS: ATIVADO";
      atual.querySelector(".info").textContent = `Restam ${50} ingressos`; // ou use qtd real
      atualizarStatus(atual.querySelector("button.excluir").dataset.id, 1);
    })
  );
}

function atualizarStatus(id, ativo) {
  fetch(`${BASE_URL}/AtivarDesativar/${id}?ativo=${ativo}`, { method: "PUT" })
    .then(res => {
      if (!res.ok) throw new Error();
    })
    .catch(console.error);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarLotes();

  // Se veio um parâmetro ?created=true após redirecionar da página de cadastro,
  // podemos recarregar automaticamente:
  const params = new URLSearchParams(window.location.search);
  if (params.get("created") === "true") {
    carregarLotes();
    // opcional: limpar o parâmetro da URL para não recarregar de novo
    history.replaceState(null, "", window.location.pathname);
  }
});
