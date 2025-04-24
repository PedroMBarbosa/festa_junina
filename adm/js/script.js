document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      // Chama a API que retorna todos os usuários
      fetch("http://10.90.146.37/api/api/Usuario")
        .then(response => {
          if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
          return response.json();
        })
        .then(data => {
          console.log("Usuários retornados da API:", data);

          // Filtra o usuário com email e senha corretos
          const usuario = data.find(user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.senha === senha
          );

          if (usuario) {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            alert(`Bem-vindo, ${usuario.nome}!`);
            window.location.href = "./views/home.html";
          } else {
            alert("Email ou senha inválidos!");
          }
        })
        .catch(error => {
          console.error("Erro ao fazer login:", error);
          alert("Erro ao se conectar. Tente novamente.");
        });
    });
  }
});
