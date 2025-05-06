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
      const response = await fetch(`${apiBase}/CadastrarCliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, telefone }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        // Salva dados no localStorage
        localStorage.setItem("usuarioNome", data.nome);
        localStorage.setItem("usuarioEmail", data.email);
        localStorage.setItem("usuarioTelefone", data.telefone);
        window.location.href = "../pag/perfil.html";
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
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        const cliente = data.cliente;

        // Salva no localStorage
        localStorage.setItem("usuarioNome", cliente.nome || "");
        localStorage.setItem("usuarioEmail", cliente.email || "");
        localStorage.setItem("usuarioTelefone", cliente.telefone || "");
        localStorage.setItem("clienteId", cliente.id || "");

        if (lembrar) {
          localStorage.setItem("usuarioSenha", senha);
        } else {
          localStorage.removeItem("usuarioSenha");
        }

        alert(`Bem-vindo, ${cliente.nome}!`);
        window.location.href = "../pag/perfil.html";
      } else {
        alert("Email ou senha incorretos.");
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }
  }

  // ESQUECI SENHA
  async function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;

    try {
      const response = await fetch(`${apiBase}/esqueci-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  // PREENCHER CAMPOS SE LEMBRAR
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

  // EVENTOS
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

  // VERIFICA SE O USUÁRIO ESTÁ LOGADO ANTES DE REDIRECIONAR NO BOTÃO PERFIL/CADASTRO
  const botaoPerfil = document.getElementById("perfilOuCadastro");
  if (botaoPerfil) {
    botaoPerfil.addEventListener("click", function (event) {
      event.preventDefault();
      // Verifica se o email está salvo no localStorage
      const emailLogado = localStorage.getItem("usuarioEmail");

      if (emailLogado) {
        // Se estiver logado, redireciona para a página de perfil
        window.location.href = "../pag/perfil.html";
      } else {
        // Se não estiver logado, redireciona para a tela de cadastro
        window.location.href = "../html/cadastro.html";
      }
    });
  }

  // PERFIL: mostrar dados
  if (window.location.pathname.includes("perfil.html")) {
    document.getElementById("username").textContent = localStorage.getItem("usuarioNome") || "Usuário";
    document.getElementById("nome-completo").textContent = localStorage.getItem("usuarioNome") || "Nome completo";
    document.getElementById("telefone").textContent = localStorage.getItem("usuarioTelefone") || "Telefone";
    document.getElementById("email").textContent = localStorage.getItem("usuarioEmail") || "E-mail";
    document.getElementById("senha").textContent = localStorage.getItem("usuarioSenha") ? "********" : "Senha";
  }
});
