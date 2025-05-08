document.addEventListener("DOMContentLoaded", function () {
    const apiBase = "http://10.90.146.37/api/api/Clientes";
    const urlUsuarios = 'http://10.90.146.37/api/api/Clientes/CadastrarCliente';
    const urlLogin = 'http://10.90.146.37/api/api/Clientes/LoginCliente';
  
    // Utilitários
    function estaLogado() {
      return localStorage.getItem("usuarioEmail") && localStorage.getItem("usuarioSenha");
    }
  
    function obterIdLogado() {
      return localStorage.getItem("idLogado") || localStorage.getItem("clienteId");
    }
  
    const estaNaPastaPag = window.location.pathname.includes("/pag/");
    const caminhoPerfil = estaNaPastaPag ? "./perfil.html" : "./pag/perfil.html";
    const caminhoCadastro = estaNaPastaPag ? "./cadastro.html" : "./pag/cadastro.html";
  
    // Registro
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
          localStorage.setItem("idLogado", data.cliente?.id || "");
  
          window.location.href = "./perfil.html";
        } else {
          alert("Erro ao registrar: " + (data.message || "Verifique os dados."));
        }
      } catch (error) {
        alert("Erro na requisição: " + error.message);
      }
    }
  
    // Login
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
  
    // Esqueci minha senha
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
  
    // Botões garanta/ver e perfil
    function validarLoginOuRedirecionar(event) {
      if (!estaLogado()) {
        event.preventDefault();
        window.location.href = caminhoCadastro;
      }
    }
  
    const garanta = document.getElementById("garanta");
    const ver = document.getElementById("ver");
    const garanta2 = document.getElementById("garanta2");
    const ver2 = document.getElementById("ver2");
    const botaoPerfil = document.getElementById("botao_perfil");
  
    if (garanta) garanta.addEventListener("click", validarLoginOuRedirecionar);
    if (ver) ver.addEventListener("click", validarLoginOuRedirecionar);
    if (garanta2) garanta2.addEventListener("click", validarLoginOuRedirecionar);
    if (ver2) ver2.addEventListener("click", validarLoginOuRedirecionar);
  
    if (botaoPerfil) {
      botaoPerfil.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = estaLogado() ? caminhoPerfil : caminhoCadastro;
      });
    }
  
    // Preencher login salvo
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
  
    // Carregar perfil
    if (window.location.pathname.includes("perfil.html")) {
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
  
    // Logout
    const botao_logout = document.getElementById("botao_logout");
    if (botao_logout) {
      botao_logout.addEventListener("click", function () {
        localStorage.removeItem("idLogado");
        localStorage.removeItem("clienteId");
        localStorage.removeItem("usuarioNome");
        localStorage.removeItem("usuarioTelefone");
        localStorage.removeItem("usuarioSenha");
        localStorage.removeItem("usuarioEmail");
        window.location.href = "../index.html";
      });
    }
  
    // Formulários
    const formRegistro = document.getElementById("registerForm");
    if (formRegistro) formRegistro.addEventListener("submit", registrarUsuario);
  
    const formLogin = document.getElementById("loginForm");
    if (formLogin) formLogin.addEventListener("submit", loginUsuario);
  
    const botaoEsqueciSenha = document.getElementById("esqueciSenha");
    if (botaoEsqueciSenha) botaoEsqueciSenha.addEventListener("click", forgotPassword);
  
    // Visualizar ingresso
    async function visualizarIngresso() {
      const idLogado = obterIdLogado();
  
      if (!idLogado) {
        alert("Você precisa estar logado para ver seus ingressos.");
        window.location.href = "./login.html";
        return;
      }
  
      try {
        const [resIngressos, resUsuarios, resLotes] = await Promise.all([
          fetch(`http://10.90.146.37/api/api/Ingresso/ConsultarIngresso/${idLogado}`),
          fetch(`http://10.90.146.37/api/api/Usuario`),
          fetch(`http://10.90.146.37/api/api/Lote`)
        ]);
  
        const ingressos = await resIngressos.json();
        const usuarios = await resUsuarios.json();
        const lotes = await resLotes.json();
  
        if (resIngressos.ok && resUsuarios.ok) {
          const container = document.querySelector(".container");
          container.innerHTML = "";
  
          ingressos.forEach(ingresso => {
            const usuario = usuarios.find(u => u.id === ingresso.usuario_id);
            const nomeUsuario = usuario ? usuario.nome : "Usuário Desconhecido";
  
            const lote = lotes.find(l => l.id === ingresso.lote_id);
            const valorUn = lote ? lote.valor_un.toFixed(2) : "10,00";
  
            let tipo = "";
            let statusClass = "";
            switch (ingresso.status_id) {
              case 1:
                tipo = "pendente"; statusClass = "pendente"; break;
              case 2:
                tipo = "pago"; statusClass = "pago"; break;
              case 3:
              default:
                tipo = "cancelado"; statusClass = "cancelado"; break;
            }
  
            const qrCodeSrc = tipo === "pago"
              ? `http://10.90.146.37/qrcodes/${ingresso.qrcode}.png`
              : `https://media.licdn.com/dms/image/v2/D5603AQH9C63cE7LO0A/profile-displayphoto-shrink_800_800/B56ZUkICDuGQAg-/0/1740067841523?e=1752105600&v=beta&t=wRpF51VnKY2-y-ia2--CPYNIj8wVYOb2mm9F-HF-C3A`;
  
            const card = document.createElement("div");
            card.className = "card-ingresso";
            card.innerHTML = `
              <div class="card-topo">Ingressos Adquiridos</div>
              <div class="card-conteudo">
                <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                <img src="${qrCodeSrc}" alt="QR Code" id="qrcode">
                <p class="status ${statusClass}">Pedido ${tipo}</p>
                <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                <span id="valor">R$${valorUn}</span></p>
                <div class="btns">
                  <button onclick="cancelarIngresso(${ingresso.id})">Cancelar</button>
                  <button onclick="confirmarIngresso(${ingresso.id})">Confirmar Compra</button>
                </div>
                <p class="aviso">*Trazer documento com foto no dia da festa*</p>
              </div>
            `;
            container.appendChild(card);
          });
        } else {
          alert("Erro ao buscar dados.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na requisição: " + error.message);
      }
    }
  
    if (window.location.pathname.includes("visualizar-ingresso.html")) {
      visualizarIngresso();
    }
  });
  