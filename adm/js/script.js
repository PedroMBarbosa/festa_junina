document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) return;

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
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const usuario = await response.json();

      if (usuario && usuario.email) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        alert(`Bem-vindo, ${usuario.nome || usuario.email}!`);
        window.location.href = "./views/home.html";
      } else {
        alert("Email ou senha inválidos!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao se conectar. Tente novamente.");
    }
  });
});
