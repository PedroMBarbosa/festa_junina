document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      // Chama a API de login usando POST
      fetch("http://10.90.146.37/api/api/Usuario/LoginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(textoErro => {
              console.error("Erro do servidor:", textoErro);
              throw new Error(`Erro HTTP: ${response.status}`);
            });
          }
          return response.json();
        })
        .then(usuario => {
          if (usuario && usuario.email) {
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
