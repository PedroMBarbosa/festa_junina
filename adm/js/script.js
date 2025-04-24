document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      // Busca usuário no JSON Server
      fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro na requisição");
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 0) {
            alert(`Bem-vindo, ${data[0].nome}!`);
            window.location.href = "/views/home.html";
          } else {
            alert("Email ou senha inválidos!");
          }
        })
        .catch(error => {
          console.error("Erro ao fazer login:", error);
          alert("Erro ao tentar logar. Verifique sua conexão ou o servidor.");
        });
    });
  }
});
