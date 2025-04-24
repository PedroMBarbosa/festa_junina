// js/listagemadm.js

// Verificação de acesso: só admins autorizados podem entrar
(function() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const listaBranca = [
    { id: 1, email: "admin@senai.com",     senha: "123456"    },
    { id: 2, email: "juanito@admsenai.com", senha: "diadorock" }
  ];

  const autorizado = usuario && listaBranca.some(adm =>
    adm.email === usuario.email &&
    adm.senha  === usuario.senha
  );

  if (!autorizado) {
    localStorage.removeItem("usuarioLogado");
    alert("Acesso negado: você não é administrador.");
    window.location.href = "/views/login.html";
    return;
  }
})();

// Lista de administradores (apenas para exibição)
const admins = [
  "Roberto Mitsuo Inoue",
  "Carlos Alexandre Cavalheiro",
  "Ana Júlia Silva",
  "Maria Isabela Pires"
];

const adminList = document.querySelector(".admin-list");
const addButton = document.querySelector(".add-button");

function renderAdmins() {
  adminList.innerHTML = "";
  admins.forEach((name, index) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    const info = document.createElement("div");
    info.className = "admin-info";
    info.innerHTML = `<span>👤</span><span>${name}</span>`;

    const actions = document.createElement("div");
    actions.className = "admin-actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.onclick = () => editAdmin(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.onclick = () => showDeleteConfirmation(card, index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);
    adminList.appendChild(card);
  });
}

function editAdmin(index) {
  const newName = prompt("Editar nome do administrador:", admins[index]);
  if (newName && newName.trim() !== "") {
    admins[index] = newName.trim();
    renderAdmins();
  }
}

function showDeleteConfirmation(card, index) {
  const confirmBox = document.createElement("div");
  confirmBox.className = "confirm-delete";
  confirmBox.innerHTML = `
    TEM CERTEZA QUE DESEJA EXCLUIR?
    <button class="yes">SIM</button>
    <button class="no">NÃO</button>
  `;

  const [yesBtn, noBtn] = confirmBox.querySelectorAll("button");

  yesBtn.onclick = () => {
    admins.splice(index, 1);
    renderAdmins();
  };

  noBtn.onclick = () => {
    renderAdmins();
  };

  card.innerHTML = "";
  card.appendChild(confirmBox);
}

addButton.addEventListener("click", () => {
  window.location.href = "../views/cadastroadm.html";
});

// Renderiza após autorização
renderAdmins();
