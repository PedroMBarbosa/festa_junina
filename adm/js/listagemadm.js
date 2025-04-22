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
  
      // Botão de edição
      const editBtn = document.createElement("button");
      editBtn.innerHTML = "✏️";
      editBtn.onclick = () => editAdmin(index, card);
  
      // Botão de exclusão
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
  
  // Função para editar administrador
  function editAdmin(index, card) {
    const newName = prompt("Editar nome do administrador:", admins[index]);
    if (newName && newName.trim() !== "") {
      admins[index] = newName.trim();
      renderAdmins();
    }
  }
  
  // Função para adicionar novo administrador
  addButton.addEventListener("click", () => {
    const newName = prompt("Digite o nome do novo administrador:");
    if (newName && newName.trim() !== "") {
      admins.push(newName.trim());
      renderAdmins();
    }
  });
  
  renderAdmins();
  