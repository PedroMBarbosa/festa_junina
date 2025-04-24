// admin.js
const API_URL = "http://10.90.146.37/api/api/Usuario";

document.addEventListener("DOMContentLoaded", () => {
  const adminList = document.querySelector(".admin-list");
  const addButton = document.querySelector(".add-button");
  const form = document.getElementById("loginForm");

  // Verificação de acesso
  (function checkAdminAccess() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || usuario.perfil_id !== 1) {
      localStorage.removeItem("usuarioLogado");
      alert("Acesso negado: você não é administrador.");
      window.location.href = "/views/gerenciamento.html";
      return;
    }

    const nomeNormalizado = usuario.nome?.toLowerCase().trim();
    if (!nomeNormalizado.includes("roberto")) {
      alert("Acesso restrito apenas ao administrador Roberto.");
      window.location.href = "/views/gerenciamento.html";
    }
  })();

  let admins = [];

  function loadAndRenderAdmins() {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        admins = data
          .filter(user => user.perfil_id === 1)
          .map(user => ({ id: user.id, nome: user.nome }));
        renderAdmins();
      })
      .catch(error => {
        console.error("Erro ao buscar administradores:", error);
        alert("Não foi possível carregar a lista de administradores.");
      });
  }

  function renderAdmins() {
    if (!adminList) return;
    adminList.innerHTML = "";

    if (admins.length === 0) {
      adminList.innerHTML = '<p>Nenhum administrador encontrado.</p>';
      return;
    }

    admins.forEach(({ id, nome }, index) => {
      const card = document.createElement("div");
      card.className = "admin-card";

      const info = document.createElement("div");
      info.className = "admin-info";
      info.innerHTML = `<span>👤</span><span>${nome}</span>`;

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const editBtn = document.createElement("button");
      editBtn.innerText = "✏️";
      editBtn.onclick = () => editAdmin(id, index);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "🗑️";
      deleteBtn.onclick = () => showDeleteConfirmation(id, card, index);

      actions.append(editBtn, deleteBtn);
      card.append(info, actions);
      adminList.appendChild(card);
    });
  }

  function editAdmin(userId, index) {
    const currentName = admins[index].nome;
    const newName = prompt("Editar nome do administrador:", currentName);
    if (newName && newName.trim()) {
      fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: newName.trim() })
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          admins[index].nome = newName.trim();
          renderAdmins();
        })
        .catch(err => {
          console.error('Erro ao atualizar:', err);
          alert('Falha ao atualizar administrador.');
        });
    }
  }

  function showDeleteConfirmation(userId, card, index) {
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
          admins.splice(index, 1);
          renderAdmins();
        })
        .catch(err => {
          console.error('Erro ao excluir:', err);
          alert('Falha ao excluir administrador.');
        });
    };

    noBtn.onclick = () => renderAdmins();

    card.innerHTML = "";
    card.appendChild(confirmBox);
  }

  if (addButton) {
    addButton.addEventListener("click", () => {
      window.location.href = "cadastroadm.html";
    });
  }

  // Carrega os administradores da API
  loadAndRenderAdmins();

  // Caso tenha um formulário de login na mesma página
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      fetch(`${API_URL}?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then(data => {
          if (data.length) {
            const usuario = data[0];
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            alert(`Bem-vindo, ${usuario.nome}!`);
            window.location.href = "/views/home.html";
          } else {
            alert("Email ou senha inválidos!");
          }
        })
        .catch(error => {
          console.error("Erro ao fazer login:", error);
          alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
        });
    });
  }
});
