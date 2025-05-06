document.addEventListener("DOMContentLoaded", () => {
  const adminList = document.querySelector(".admin-list");
  const addButton = document.querySelector(".add-button");

  const API_URL = "http://10.90.146.37/api/api/Usuario";
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  // 🔐 Verifica se está logado e se é administrador
  if (!usuario || usuario.perfil_id !== 1) {
    localStorage.removeItem("usuarioLogado");
    alert("Acesso negado: você não é administrador.");
    window.location.href = "../views/gerenciamento.html";
    return;
  }

  // ✅ Acesso à tela só se for Roberto
  const nomeNormalizado = usuario.nome?.toLowerCase().trim();
  if (!nomeNormalizado.includes("roberto")) {
    alert("Acesso restrito apenas ao administrador Roberto.");
    window.location.href = "views/gerenciamento.html";
    return;
  }

  // ✅ Se chegou até aqui, é o Roberto -> pode ver todos os usuários
  function loadAndRenderUsuarios() {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("Usuários carregados da API:", data);
        renderUsuarios(data); // Renderiza TODOS os usuários
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        alert("Não foi possível carregar a lista de usuários.");
      });
  }

  function renderUsuarios(usuarios) {
    if (!adminList) return;
    adminList.innerHTML = "";

    if (usuarios.length === 0) {
      adminList.innerHTML = '<p>Nenhum usuário encontrado.</p>';
      return;
    }

    usuarios.forEach(({ id, nome, perfil_id }, index) => {
      const card = document.createElement("div");
      card.className = "admin-card";

      const info = document.createElement("div");
      info.className = "admin-info";
      info.innerHTML = `
        <span>👤</span>
        <span>${nome}</span>
        ${perfil_id === 1 ? '<span style="color: red; font-weight: bold;">[Admin]</span>' : ''}
      `;

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const editBtn = document.createElement("button");
      editBtn.innerText = "✏️";
      editBtn.onclick = () => editUsuario(id, index, usuarios);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "🗑️";
      deleteBtn.onclick = () => showDeleteConfirmation(id, card, index, usuarios);

      actions.append(editBtn, deleteBtn);
      card.append(info, actions);
      adminList.appendChild(card);
    });
  }

  function editUsuario(userId, index, usuarios) {
    const currentName = usuarios[index].nome;
    const newName = prompt("Editar nome do usuário:", currentName);
    if (newName && newName.trim()) {
      fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: newName.trim() })
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          usuarios[index].nome = newName.trim();
          renderUsuarios(usuarios);
        })
        .catch(err => {
          console.error('Erro ao atualizar:', err);
          alert('Falha ao atualizar usuário.');
        });
    }
  }

  function showDeleteConfirmation(userId, card, index, usuarios) {
    const confirmBox = document.createElement("div");
    confirmBox.className = "confirm-delete";
    confirmBox.innerHTML = `
      TEM CERTEZA QUE DESEJA EXCLUIR?
      <button class="yes">SIM</button>
      <button class="no">NÃO</button>
    `;

    const [yesBtn, noBtn] = confirmBox.querySelectorAll("button");

    yesBtn.onclick = () => {
      fetch(`${API_URL}/${userId}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          usuarios.splice(index, 1);
          renderUsuarios(usuarios);
        })
        .catch(err => {
          console.error('Erro ao excluir:', err);
          alert('Falha ao excluir usuário.');
        });
    };

    noBtn.onclick = () => renderUsuarios(usuarios);

    card.innerHTML = "";
    card.appendChild(confirmBox);
  }

  if (addButton) {
    addButton.addEventListener("click", () => {
      window.location.href = "../gerenciamento/cadastroadm.html";
    });
  }

  loadAndRenderUsuarios();
});
