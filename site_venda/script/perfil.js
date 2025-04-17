// Alternar visualização da senha
document.addEventListener("DOMContentLoaded", () => {
    const senhaBloco = document.querySelector(".bloco:nth-child(5) span:nth-child(2)");
    const olhoIcone = document.querySelector(".icone-olho");
  
    let senhaVisivel = false;
    const senhaOriginal = "************";
    const senhaReal = "minhaSenha123"; // Simulação
  
    olhoIcone.addEventListener("click", () => {
      senhaVisivel = !senhaVisivel;
      senhaBloco.textContent = senhaVisivel ? `Senha: ${senhaReal}` : `Senha: ${senhaOriginal}`;
      olhoIcone.textContent = senhaVisivel ? "🙈" : "👁️";
    });
  
    // Evento ao clicar em qualquer botão de editar
    const botoesEditar = document.querySelectorAll(".btn-editar");
    botoesEditar.forEach(btn => {
      btn.addEventListener("click", () => {
        alert("Função de edição ainda não implementada. Em breve você poderá editar seus dados aqui!");
      });
    });
  });
  