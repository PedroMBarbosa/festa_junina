document.addEventListener("DOMContentLoaded", () => {
  // ——— estado de edição ———
  let isEditMode = false;

  // 1. carrega usuário do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    alert("Você precisa fazer login primeiro.");
    window.location.href = "/views/login.html";
    return;
  }

  // referências aos elementos
  const btnEditar = document.getElementById("btn-editar-dados");
  const spanNome   = document.getElementById("nome-completo");
  const inputNome  = document.getElementById("input-nome");
  const spanTel    = document.getElementById("telefone");
  const inputTel   = document.getElementById("input-telefone");
  const spanEmail  = document.getElementById("email");
  const inputEmail = document.getElementById("input-email");
  const spanSenha  = document.getElementById("senha");
  const inputSenha = document.getElementById("input-senha");

  // 2. preenche campos iniciais
  document.getElementById("username").innerText = usuario.nome;
  spanNome.innerText  = `Nome completo: ${usuario.nome}`;
  inputNome.value     = usuario.nome;
  if (usuario.telefone) {
    spanTel.innerText  = `Telefone: ${usuario.telefone}`;
    inputTel.value     = usuario.telefone;
  } else {
    spanTel.closest(".info-item1").style.display = "none";
  }
  spanEmail.innerText = `E-mail: ${usuario.email}`;
  inputEmail.value    = usuario.email;
  spanSenha.innerText = "Senha: **********";
  inputSenha.value    = "";

  // 3. alterna entre EDITAR ⇄ SALVAR
  btnEditar.addEventListener("click", async () => {
    if (!isEditMode) {
      // entra em modo edição
      toggleField(spanNome, inputNome);
      toggleField(spanTel,  inputTel);
      toggleField(spanEmail,inputEmail);
      toggleField(spanSenha,inputSenha);
      btnEditar.innerText = "Salvar";
      isEditMode = true;
    } else {
      // pega novos valores
      const novoNome  = inputNome.value.trim();
      const novoTel   = inputTel.value.trim();
      const novoEmail = inputEmail.value.trim();

      // envia PATCH para o servidor
      try {
        const resp = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: novoNome,
            telefone: novoTel,
            email: novoEmail
          })
        });
        if (!resp.ok) throw new Error("Falha no servidor");
        const updated = await resp.json();

        // atualiza o localStorage e UI
        localStorage.setItem("usuarioLogado", JSON.stringify(updated));
        spanNome.innerText  = `Nome completo: ${updated.nome}`;
        spanTel.innerText   = `Telefone: ${updated.telefone || ""}`;
        spanEmail.innerText = `E-mail: ${updated.email}`;

        // volta ao modo leitura
        toggleField(spanNome, inputNome);
        toggleField(spanTel,  inputTel);
        toggleField(spanEmail,inputEmail);
        toggleField(spanSenha,inputSenha);
        btnEditar.innerText = "Editar";
        isEditMode = false;
        alert("Dados atualizados com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao salvar: " + err.message);
      }
    }
  });

  // 4. botão de mostrar/ocultar senha
  document.getElementById("toggle-senha").addEventListener("click", () => {
    inputSenha.type = inputSenha.type === "password" ? "text" : "password";
  });

  // ——— helpers ———
  function toggleField(spanEl, inputEl) {
    const showing = !inputEl.classList.contains("hidden");
    if (showing) {
      // esconde input, mostra span
      inputEl.style.display = "none";
      inputEl.classList.add("hidden");
      spanEl.style.display  = "inline-block";
    } else {
      // mostra input, esconde span
      inputEl.style.display = "inline-block";
      inputEl.classList.remove("hidden");
      spanEl.style.display  = "none";
    }
  }
});
