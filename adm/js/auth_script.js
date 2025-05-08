document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const mensagemErro = document.getElementById("mensagemErroPopup");

  if (!form) return;

  function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.style.display = "block";
    mensagemErro.style.opacity = "1";

    // Ocultar após 4 segundos
    setTimeout(() => {
      mensagemErro.style.opacity = "0";
      setTimeout(() => {
        mensagemErro.style.display = "none";
      }, 300); // Tempo para transição de fade-out
    }, 4000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch("http://10.90.146.37/api/api/Usuario/LoginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro do servidor:", errorText);
        mostrarErro("Email ou senha incorretos.");
        return;
      }

      const usuario = await response.json();

      if (usuario && usuario.cliente && usuario.cliente.email) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario.cliente));

        // Redireciona dependendo do primeiro acesso
        if (usuario.cliente.primeiroAcesso === true) {
          window.location.href = "./views/criarsenha.html";
        } else {
          window.location.href = "./views/home.html";
        }
      } else {
        mostrarErro("EMAIL OU SENHA INVÁLIDOS!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      mostrarErro("Erro ao se conectar. Tente novamente.");
    }
  });
});
