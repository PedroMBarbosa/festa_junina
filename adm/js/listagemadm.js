const adminList = document.querySelector(".admin-list");
const addButton = document.querySelector(".add-button");

// Renderiza os admins da API
function renderAdmins(admins) {
  adminList.innerHTML = "";
  admins.forEach((admin, index) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    const info = document.createElement("div");
    info.className = "admin-info";
    info.innerHTML = `<span>👤</span><span>${admin.nome}</span>`;

    const actions = document.createElement("div");
    actions.className = "admin-actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.onclick = () => editAdmin(admin, index);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.onclick = () => showDeleteConfirmation(card, admin.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);
    adminList.appendChild(card);
  });
}

// Edita admin (apenas frontend, pode ser adaptado para PUT)
function editAdmin(admin, index) {
  const newName = prompt("Editar nome do administrador:", admin.nome);
  if (newName && newName.trim() !== "") {
    fetch(`http://localhost:3000/administradores/${admin.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: newName.trim() })
    })
      .then(() => loadAdmins())
      .catch(error => console.error("Erro ao editar administrador:", error));
  }
}

// Confirmação de exclusão
function showDeleteConfirmation(card, id) {
  const confirmBox = document.createElement("div");
  confirmBox.className = "confirm-delete";
  confirmBox.innerHTML = `
    TEM CERTEZA QUE DESEJA EXCLUIR?
    <button class="yes">SIM</button>
    <button class="no">NÃO</button>
  `;

  const [yesBtn, noBtn] = confirmBox.querySelectorAll("button");

  yesBtn.onclick = () => {
    fetch(`http://localhost:3000/administradores/${id}`, {
      method: "DELETE"
    })
      .then(() => loadAdmins())
      .catch(error => console.error("Erro ao excluir:", error));
  };

  noBtn.onclick = () => loadAdmins();

  card.innerHTML = "";
  card.appendChild(confirmBox);
}

// Botão de adicionar redireciona para a tela de cadastro
addButton.addEventListener("click", () => {
  window.location.href = "../gerenciamento/cadastroadm.html";
});

// Carrega admins da API
function loadAdmins() {
  fetch("http://localhost:3000/administradores")
    .then(res => res.json())
    .then(data => renderAdmins(data))
    .catch(error => console.error("Erro ao carregar administradores:", error));
}

loadAdmins();
