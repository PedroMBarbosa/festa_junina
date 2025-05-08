document.addEventListener("DOMContentLoaded", function () {
  const apiBase = "http://10.90.146.37/api/api/Clientes";
  
  const urlUsuarios = 'http://10.90.146.37/api/api/Clientes/CadastrarCliente';
  const urlLogin = 'http://10.90.146.37/api/api/Clientes/LoginCliente';

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

        // Salva no localStorage
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

        // Salva dados no localStorage
        localStorage.setItem("usuarioNome", data.cliente?.nome || "");
        localStorage.setItem("usuarioEmail", data.cliente?.email || email);
        localStorage.setItem("usuarioTelefone", data.cliente?.telefone || "");
        localStorage.setItem("usuarioSenha", senha); // ⚠️ NÃO use em produção!
        localStorage.setItem("clienteId", data.cliente?.id || "");

        if (lembrar) {
          localStorage.setItem("lembrarUsuario", "true");
        } else {
          localStorage.removeItem("lembrarUsuario");
        }

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
        body: JSON.stringify({ email })
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

  // Preencher login se lembrar estiver ativado
  if (localStorage.getItem("lembrarUsuario") === "true") {
    const emailInput = document.getElementById("loginEmail");
    const senhaInput = document.getElementById("loginSenha");
    const lembrarCheckbox = document.getElementById("lembrarUsuario");

    if (emailInput && senhaInput) {
      emailInput.value = localStorage.getItem("usuarioEmail") || "";
      senhaInput.value = localStorage.getItem("usuarioSenha") || "";
    }
    if (lembrarCheckbox) {
      lembrarCheckbox.checked = true;
    }
  }

  // Redireciona com base no login
  const botaoPerfil = document.getElementById("perfilOuCadastro");
  if (botaoPerfil) {
    botaoPerfil.addEventListener("click", function (event) {
      event.preventDefault();
      const estaLogado = localStorage.getItem("usuarioEmail") && localStorage.getItem("usuarioSenha");

      if (estaLogado) {
        window.location.href = "../pag/perfil.html";
      } else {
        window.location.href = "../pag/cadastro.html";
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

  // Carrega dados no perfil.html
  const perfilPage = window.location.pathname.includes("perfil.html");
  if (perfilPage) {
    const nome = localStorage.getItem("usuarioNome") || "Nome não encontrado";
    const email = localStorage.getItem("usuarioEmail") || "Email não encontrado";
    const telefone = localStorage.getItem("usuarioTelefone") || "Telefone não encontrado";
    const senha = localStorage.getItem("usuarioSenha") || "Senha não encontrada";

    const setValue = (idSpan, idInput, value) => {
      const span = document.getElementById(idSpan);
      const input = document.getElementById(idInput);
      if (span) span.textContent = value;
      if (input) input.value = value;
    };

    setValue("username", null, nome);
    setValue("nome-completo", "input-nome", nome);
    setValue("email", "input-email", email);
    setValue("telefone", "input-telefone", telefone);
    setValue("senha", "input-senha", senha);
  }
});


