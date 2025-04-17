document.addEventListener("DOMContentLoaded", function () {
    // Endpoint do JSON Server
    const urlUsuarios = 'http://localhost:4000/usuario';
  
    // Função para registrar usuário
    function registrarUsuario(event) {
      event.preventDefault();
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
  
      // POST /usuario cria um novo usuário (id gerado em sequência)
      fetch(urlUsuarios, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha })
      })
        .then(response => {
          const statusOk = response.ok;
          return response.json().then(data => ({ data, statusOk }));
        })
        .then(({ data, statusOk }) => {
          if (statusOk) {
            alert("Usuário registrado com sucesso!");
            console.log("Novo usuário:", data);
            // data deve conter o objeto criado, ex: { id: 3, nome: "...", email: "...", senha: "..." }
          } else {
            alert("Erro ao registrar usuário: " + (data.mensagem || "Problema desconhecido."));
          }
        })
        .catch(error => {
          console.error("Erro na requisição:", error);
          alert("Erro na requisição: " + error.message);
        });
    }
  
    // Função para login de usuário (usando GET)
    function loginUsuario(event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const senha = document.getElementById("loginSenha").value;
  
      // Faz GET /usuario e filtra localmente
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
            // data deve ser um array de usuários
            // Verifica se existe um usuário com email e senha informados
            const usuarioEncontrado = data.find(u => u.email === email && u.senha === senha);
            if (usuarioEncontrado) {
              alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
            } else {
              alert("Email ou senha incorretos.");
            }
          } else {
            // Se deu erro na requisição (ex.: 404, etc.)
            alert("Ocorreu um problema ao verificar o usuário.");
          }
        })
        .catch(error => {
          console.error("Erro na requisição:", error);
          alert("Erro na requisição: " + error.message);
        });
        window.location.href = "index.html";

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
  