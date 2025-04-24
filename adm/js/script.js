document.addEventListener("DOMContentLoaded", function () {
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
            const usuario = data[0];

+            // → salva todo o objeto no localStorage
+            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            alert(`Bem-vindo, ${usuario.nome}!`);
            window.location.href = "/views/home.html";
          } else {
            alert("Email ou senha inválidos!");
          }
        })
        .catch(error => {
          console.error("Erro ao fazer login:", error);
        });
    });
  }
});
