document.addEventListener("DOMContentLoaded", function () {
  const apiBase = "http://10.90.146.37/api/api/Clientes";

  // REGISTRO
  async function registrarUsuario(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const telefone = document.getElementById("telefone").value;

    try {
      const response = await fetch(`${apiBase}/CadastrarCliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, telefone })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
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
      const response = await fetch(`${apiBase}/LoginCliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Bem-vindo, ${data.cliente?.nome || "usuário"}!`);

        if (lembrar) {
          localStorage.setItem("usuarioEmail", email);
          localStorage.setItem("usuarioSenha", senha);
        } else {
          localStorage.removeItem("usuarioEmail");
          localStorage.removeItem("usuarioSenha");
        }

        localStorage.setItem("usuarioNome", data.cliente?.nome || "");
        localStorage.setItem("clienteId", data.cliente?.id || "");

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
    const email = document.getElementById("loginEmail").value;

    try {
      const response = await fetch(`${apiBase}/esqueci-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Nova senha enviada ao seu email.");
        window.location.href = "login.html";
      } else {
        alert("Erro ao redefinir senha: " + (data.message || "E-mail não encontrado."));
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }
  }

  // Preenche campos se lembrar estiver ativado
  const emailSalvo = localStorage.getItem("usuarioEmail");
  const senhaSalva = localStorage.getItem("usuarioSenha");

  if (emailSalvo && senhaSalva) {
    const emailInput = document.getElementById("loginEmail");
    const senhaInput = document.getElementById("loginSenha");
    const lembrarCheckbox = document.getElementById("lembrarUsuario");

    if (emailInput && senhaInput) {
      emailInput.value = emailSalvo;
      senhaInput.value = senhaSalva;
    }
    if (lembrarCheckbox) {
      lembrarCheckbox.checked = true;
    }
  }

  // Botão de perfil/cadastro
  const botaoPerfil = document.getElementById("perfilOuCadastro");
  if (botaoPerfil) {
    botaoPerfil.addEventListener("click", function (event) {
      event.preventDefault();
      const estaLogado = localStorage.getItem("usuarioEmail") && localStorage.getItem("usuarioSenha");

      if (estaLogado) {
        window.location.href = "../pag/perfil.html";
      } else {
        window.location.href = "../html/cadastro.html";
      }
    });
  }

  // Eventos dos formulários
  const formRegistro = document.getElementById("registerForm");
  if (formRegistro) {
    formRegistro.addEventListener("submit", registrarUsuario);
  }

  const formLogin = document.getElementById("loginForm");
  if (formLogin) {
    formLogin.addEventListener("submit", loginUsuario);
  }

  const botaoEsqueciSenha = document.getElementById("esqueciSenha");
  if (botaoEsqueciSenha) {
    botaoEsqueciSenha.addEventListener("click", forgotPassword);
  }
});
