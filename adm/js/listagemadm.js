document.addEventListener("DOMContentLoaded", () => {
  const adminList = document.querySelector(".admin-list");
  const addButton = document.querySelector(".add-button");
  const API_URL   = "http://10.90.146.37/api/api/Usuario";
  const usuario   = JSON.parse(localStorage.getItem("usuarioLogado"));

  // somente perfil 1 pode cadastrar novo administrador
  const isAdmin = usuario && Number(usuario.perfil_id) === 1;
  console.log("DEBUG usuario:", usuario, "→ isAdmin:", isAdmin);

  // ocultar botão para quem não é admin; para admin, mantém estilo original
  if (addButton && !isAdmin) {
    addButton.style.display = "none";
  }
  // registra ação de clique só se for admin
  if (addButton && isAdmin) {
    addButton.addEventListener("click", () => {
      window.location.href = "../gerenciamento/cadastroadm.html";
    });
    console.log("DEBUG listener de adicionar ADM registrado");
  }

  function loadAndRenderUsuarios() {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("Usuários carregados da API:", data);
        renderUsuarios(data);
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

    // DEBUG: listar todos os usuários recebidos
    console.log("DEBUG — todos os usuários vindos da API:");
    usuarios.forEach(u => console.log(`→ id=${u.id}, nome=${u.nome}, perfil_id=${u.perfil_id}`));

    usuarios.forEach(({ id, nome, perfil_id }, index) => {
      const card = document.createElement("div");
      card.className = "admin-card";

      const info = document.createElement("div");
      info.className = "admin-info";
      
      let label;
      switch (Number(perfil_id)) {
        case 1:
          label = '[Admin]';
          break;
        case 2:
          label = '[Usuário]';
          break;
        case 3:
          label = '[Portaria]';
          break;
        default:
          label = `[Perfil ${perfil_id}]`;
      }

      info.innerHTML = `
        <span>👤</span>
        <span>${nome}</span>
        <span style="color: red; font-weight: bold;">${label}</span>
      `;
      card.appendChild(info);

      // somente perfil 1 pode editar/excluir
      if (isAdmin) {
        const actions = document.createElement("div");
        actions.className = "admin-actions";

        const editBtn = document.createElement("button");
        editBtn.innerText = "✏️";
        editBtn.onclick = () => editUsuario(id, index, usuarios);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "🗑️";
        deleteBtn.onclick = () => showDeleteConfirmation(id, card, index, usuarios);

        actions.append(editBtn, deleteBtn);
        card.appendChild(actions);
      }

      adminList.appendChild(card);
    });
  }

  function editUsuario(userId, index, usuarios) {
    const currentName = usuarios[index].nome;
    const newName = prompt("Editar nome do usuário:", currentName);
    if (!newName?.trim()) return;

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

  loadAndRenderUsuarios();
});