// Aguarda o DOM estar carregado antes de rodar qualquer coisa
document.addEventListener("DOMContentLoaded", function () {
  // Login
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      fetch(`http://localhost:3000/usuarios?email=${email}&senha=${senha}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            alert(`Bem-vindo, ${data[0].nome}!`);
            window.location.href = "/views/baixa.html"; // Redireciona para a página de controle
          } else {
            alert("Email ou senha inválidos!");
          }
        })
        .catch(error => {
          console.error("Erro ao fazer login:", error);
        });
    });
  }

  // Gráfico
  
});
