document.getElementById("adminForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const nome = e.target.nome.value.trim();
    const email = e.target.email.value.trim();
    const senha = e.target.senha.value;
    const confirmaSenha = e.target.confirmaSenha.value;
    const telefone = e.target.telefone.value.trim();
  
    if (senha !== confirmaSenha) {
      alert("As senhas não coincidem.");
      return;
    }
  
    // Aqui você pode salvar no localStorage, enviar para API, etc
    alert("Administrador cadastrado com sucesso!\n" + nome);
  
    // Redirecionar para listagem
    window.location.href = "../views/listagemadm.html";
  });
  