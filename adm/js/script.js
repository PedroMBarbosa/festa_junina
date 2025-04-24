document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      // 🔐 Codifica os parâmetros para segurança
      const url = `http://10.90.146.37/api/api/Usuario?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`;

      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
          return response.json();
        })
        .then(data => {
          console.log("Resposta da API:", data); // 👈 debug

          if (data.length > 0) {
            const usuario = data[0];

            // Salva o objeto do usuário no localStorage
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            alert(`Bem-vindo, ${usuario.nome}!`);

            // Redireciona para página principal (para todos os perfis)
            window.location.href = "/views/home.html";

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
