document.addEventListener("DOMContentLoaded", function () {
  // Endpoint do JSON Server
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
    const lembrar = document.getElementById("lembrarUsuario").checked;

    // Salva dados no localStorage se o usuário marcar "lembrar"
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
            // Redireciona somente se login for válido
            window.location.href = "../index.html";
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

  // Preenche os campos automaticamente se o usuário marcou "lembrar"
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

  // Vincula eventos aos formulários
  const formRegistro = document.getElementById("registerForm");
  if (formRegistro) {
    formRegistro.addEventListener("submit", registrarUsuario);
  } else {
    console.error("Formulário de registro não encontrado!");
  }

  const formLogin = document.getElementById("loginForm");
  if (formLogin) {
    formLogin.addEventListener("submit", loginUsuario);
  } else {
    console.error("Formulário de login não encontrado!");
  }
});
