document.addEventListener("DOMContentLoaded", () => {
  const editarBtn = document.getElementById("btn-editar-dados");
  const nomeSpan = document.getElementById("nome-completo");
  const telefoneSpan = document.getElementById("telefone");
  const emailSpan = document.getElementById("email");
  const senhaSpan = document.getElementById("senha");

  const inputNome = document.getElementById("input-nome");
  const inputTelefone = document.getElementById("input-telefone");
  const inputEmail = document.getElementById("input-email");
  const inputSenha = document.getElementById("input-senha");

  const toggleSenhaBtn = document.getElementById("toggle-senha");

  let editando = false;

  editarBtn.addEventListener("click", () => {
    if (!editando) {
      // Modo edição
      inputNome.value = nomeSpan.textContent.replace("Nome completo: ", "");
      inputTelefone.value = telefoneSpan.textContent.replace("Telefone: ", "");
      inputEmail.value = emailSpan.textContent.replace("E-mail: ", "");
      inputSenha.value = "";

      nomeSpan.classList.add("hidden");
      telefoneSpan.classList.add("hidden");
      emailSpan.classList.add("hidden");
      senhaSpan.classList.add("hidden");

      inputNome.classList.remove("hidden");
      inputTelefone.classList.remove("hidden");
      inputEmail.classList.remove("hidden");
      inputSenha.classList.remove("hidden");

      editarBtn.innerHTML = '<img src="../images/save.png" class="edit"/> Salvar';
      editando = true;
    } else {
      // Modo salvar
      nomeSpan.textContent = `Nome completo: ${inputNome.value}`;
      telefoneSpan.textContent = `Telefone: ${inputTelefone.value}`;
      emailSpan.textContent = `E-mail: ${inputEmail.value}`;
      senhaSpan.textContent = `Senha: **********`;

      nomeSpan.classList.remove("hidden");
      telefoneSpan.classList.remove("hidden");
      emailSpan.classList.remove("hidden");
      senhaSpan.classList.remove("hidden");

      inputNome.classList.add("hidden");
      inputTelefone.classList.add("hidden");
      inputEmail.classList.add("hidden");
      inputSenha.classList.add("hidden");

      editarBtn.innerHTML = '<img src="../images/edit (1).png" class="edit"/> Editar';
      editando = false;
    }
  });

  toggleSenhaBtn.addEventListener("click", () => {
    const tipo = inputSenha.getAttribute("type");
    inputSenha.setAttribute("type", tipo === "password" ? "text" : "password");
  });
});
