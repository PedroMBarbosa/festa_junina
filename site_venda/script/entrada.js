document.addEventListener("DOMContentLoaded", function () {
  const apiBase = "http://10.90.146.37/api/api/Clientes";
  const urlUsuarios = `${apiBase}/CadastrarCliente`;
  const urlLogin = `${apiBase}/LoginCliente`;

  // REGISTRO
  async function registrarUsuario(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const telefone = document.getElementById("telefone").value;

    try {
      const response = await fetch(urlUsuarios, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, telefone })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        localStorage.setItem("usuarioNome", data.cliente?.nome || nome);
        localStorage.setItem("usuarioEmail", email);
        localStorage.setItem("usuarioTelefone", telefone);
        localStorage.setItem("usuarioSenha", senha);
        localStorage.setItem("clienteId", data.cliente?.id || "");
        window.location.href = "./perfil.html";
      } else {
        alert("Erro ao registrar: " + (data.message || "Verifique os dados."));
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }
  }

  // LOGIN
  async function loginUsuario(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;
    const lembrar = document.getElementById("lembrarUsuario")?.checked;

    try {
      const response = await fetch(urlLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Bem-vindo, ${data.cliente?.nome || "usuário"}!`);
        localStorage.setItem("usuarioNome", data.cliente?.nome || "");
        localStorage.setItem("usuarioEmail", data.cliente?.email || email);
        localStorage.setItem("usuarioTelefone", data.cliente?.telefone || "");
        localStorage.setItem("usuarioSenha", senha);
        localStorage.setItem("clienteId", data.cliente?.id || "");

        if (lembrar) localStorage.setItem("lembrarUsuario", "true");
        else localStorage.removeItem("lembrarUsuario");

        window.location.href = "../pag/perfil.html";
      } else {
        alert("Erro no login: " + (data.message || "Email ou senha incorretos."));
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }
  }

  // ESQUECI MINHA SENHA
  async function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
  
    if (!email) {
      alert("Por favor, insira seu e-mail no campo para enviarmos a nova senha.");
      return;
    }
  
    try {
      const response = await fetch("http://10.90.146.37/api/api/Clientes/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email)
      });
  
      if (response.ok) {
        alert("Nova senha enviada ao seu email.");
        window.location.href = "login.html";
      } else {
        const data = await response.json();
        alert("Erro ao redefinir senha: " + (data.message || "E-mail não encontrado."));
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }
  }
  

  // Preencher login se lembrar estiver ativado
  if (localStorage.getItem("lembrarUsuario") === "true") {
    const emailInput = document.getElementById("loginEmail");
    const senhaInput = document.getElementById("loginSenha");
    const lembrarCheckbox = document.getElementById("lembrarUsuario");

    if (emailInput && senhaInput) {
      emailInput.value = localStorage.getItem("usuarioEmail") || "";
      senhaInput.value = localStorage.getItem("usuarioSenha") || "";
    }
    if (lembrarCheckbox) lembrarCheckbox.checked = true;
  }

  // Eventos dos formulários
  document.getElementById("registerForm")?.addEventListener("submit", registrarUsuario);
  document.getElementById("loginForm")?.addEventListener("submit", loginUsuario);
  document.getElementById("esqueciSenha")?.addEventListener("click", forgotPassword);
});