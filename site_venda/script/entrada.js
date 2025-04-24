document.addEventListener("DOMContentLoaded", function () {
  const urlUsuarios = 'http://localhost:1010/usuario';

  // Função para registrar usuário
  function registrarUsuario(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const telefone = document.getElementById("telefone").value;

    fetch(urlUsuarios, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha, telefone })
    })
    .then(response => {
      const statusOk = response.ok;
      return response.json().then(data => ({ data, statusOk }));
    })
    .then(({ data, statusOk }) => {
      if (statusOk) {
        alert("Usuário registrado com sucesso!");
        console.log("Novo usuário:", data);
      } else {
        alert("Erro ao registrar usuário: " + (data.mensagem || "Problema desconhecido."));
      }
    })
    .catch(error => {
      console.error("Erro na requisição:", error);
      alert("Erro na requisição: " + error.message);
    });
  }

  // Função para login de usuário
  function loginUsuario(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;
    const lembrar = document.getElementById("lembrarUsuario")?.checked;

    if (lembrar) {
      localStorage.setItem("usuarioEmail", email);
      localStorage.setItem("usuarioSenha", senha);
    } else {
      localStorage.removeItem("usuarioEmail");
      localStorage.removeItem("usuarioSenha");
    }

    fetch(urlUsuarios, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      const statusOk = response.ok;
      return response.json().then(data => ({ data, statusOk }));
    })
    .then(({ data, statusOk }) => {
      if (statusOk) {
        const usuarioEncontrado = data.find(u => u.email === email && u.senha === senha);
        if (usuarioEncontrado) {
          alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
          window.location.href = "../pag/perfil.html"; // Caminho para a página de perfil
        } else {
          alert("Email ou senha incorretos.");
        }
      } else {
        alert("Ocorreu um problema ao verificar o usuário.");
      }
    })
    .catch(error => {
      console.error("Erro na requisição:", error);
      alert("Erro na requisição: " + error.message);
    });
  }

  // Preenche os campos se lembrar de mim estiver ativado
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

  // Lógica do botão de perfil/cadastro (usuário logado ou não)
  const botaoPerfil = document.getElementById("perfilOuCadastro");
  if (botaoPerfil) {
    botaoPerfil.addEventListener("click", function (event) {
      event.preventDefault();
      const estaLogado = localStorage.getItem("usuarioEmail") && localStorage.getItem("usuarioSenha");

      if (estaLogado) {
        window.location.href = "../pag/perfil.html"; // Caminho do perfil
      } else {
        window.location.href = "../html/cadastro.html"; // Caminho do cadastro/login
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
});
