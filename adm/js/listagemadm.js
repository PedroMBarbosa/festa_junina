document.addEventListener("DOMContentLoaded", () => {
  const adminList = document.querySelector(".admin-list");
  const addButton = document.querySelector(".add-button");
  const API_URL = "http://10.90.146.37/api/api/Usuario";

  // Recupera usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || {};
  const currentUserId = Number(usuarioLogado.id);
  const currentPerfil = Number(usuarioLogado.perfil_id);
  const isGestaoProjeto = currentPerfil === 1;

  // DEBUG LOGS
  console.log("→ usuarioLogado:", usuarioLogado);
  console.log("→ currentUserId:", currentUserId);
  console.log("→ currentPerfil:", currentPerfil);
  console.log("→ isGestaoProjeto:", isGestaoProjeto);

  // Exibe botão de adicionar apenas para Gestão de Projeto
  if (addButton) {
    addButton.hidden = !isGestaoProjeto;
    if (isGestaoProjeto) {
      addButton.addEventListener("click", () => {
        window.location.href = "../gerenciamento/cadastroadm.html";
      });
    }
  }

  if (adminList) adminList.textContent = "Carregando administradores...";

  fetch(API_URL)
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(usuarios => renderUsuarios(usuarios))
    .catch(err => {
      console.error("Erro na API:", err);
      if (adminList) adminList.textContent = "Falha ao carregar usuários.";
    });

  function renderUsuarios(usuarios) {
    adminList.innerHTML = "";
    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      adminList.innerHTML = '<p>Nenhum usuário encontrado.</p>';
      return;
    }

    usuarios.forEach(({ id, nome, perfil_id }) => {
      const card = document.createElement("div");
      card.className = "admin-card";

      const info = document.createElement("div");
      info.className = "admin-info";
      const labels = { 1: 'Admin', 2: 'Usuário', 3: 'Portaria' };
      const labelText = labels[perfil_id] || `Perfil ${perfil_id}`;
      info.innerHTML = `<span>👤</span> <span>${nome}</span> <span style='color:red;'>[${labelText}]</span>`;
      card.appendChild(info);

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      // Botão de editar
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-button");
      editBtn.textContent = "✏️";

      const podeEditar = isGestaoProjeto || id === currentUserId;
      if (podeEditar) {
        editBtn.title = "Editar usuário";
        editBtn.onclick = () => editUsuario(id, nome, perfil_id);
      } else {
        editBtn.disabled = true;
        editBtn.title = "Sem permissão";
      }

      // Botão de excluir
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-button");
      deleteBtn.textContent = "🗑️";

      const podeExcluir = isGestaoProjeto && id !== currentUserId;
      if (podeExcluir) {
        deleteBtn.title = "Excluir usuário";
        deleteBtn.onclick = () => deleteUsuario(id, card);
      } else {
        deleteBtn.disabled = true;
        deleteBtn.title = "Sem permissão";
      }

      actions.append(editBtn, deleteBtn);
      card.appendChild(actions);
      adminList.appendChild(card);
    });
  }

  function editUsuario(id, nomeAtual, perfil_id) {
    const novo = prompt("Novo nome:", nomeAtual);
    if (!novo) return;

    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nome: novo, perfil_id })
    })
      .then(r => r.ok ? reloadList() : Promise.reject(r.status))
      .catch(() => alert("Erro ao editar."));
  }

  function deleteUsuario(id, card) {
    if (!confirm("Confirma exclusão?")) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(r => {
        if (r.ok) card.remove();
        else return Promise.reject(r.status);
      })
      .catch(() => alert("Erro ao excluir."));
  }

  function reloadList() {
    if (adminList) adminList.textContent = "Atualizando...";
    fetch(API_URL)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(renderUsuarios)
      .catch(() => {
        if (adminList) adminList.textContent = "Erro ao atualizar lista.";
      });
  }
});
