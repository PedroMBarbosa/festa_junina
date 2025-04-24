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

  const novoAdmin = {
    nome,
    email,
    senha,
    telefone
  };

  fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoAdmin)
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao cadastrar administrador.");
      return response.json();
    })
    .then(data => {
      alert("Administrador cadastrado com sucesso!\n" + nome);
      window.location.href = "../views/listagemadm.html";
    })
    .catch(error => {
      console.error(error);
      alert("Erro ao cadastrar administrador.");
    });
});
