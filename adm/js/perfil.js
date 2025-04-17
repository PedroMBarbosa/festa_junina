document.getElementById("btn-editar-dados").addEventListener("click", function () {
    toggleEdit("nome-completo", "input-nome");
    toggleEdit("telefone", "input-telefone");
    toggleEdit("email", "input-email");
    toggleEdit("senha", "input-senha");
  });
  
  function toggleEdit(spanId, inputId) {
    const span = document.getElementById(spanId);
    const input = document.getElementById(inputId);
    if (input.style.display === "none" || input.classList.contains("hidden")) {
      input.style.display = "inline-block";
      input.classList.remove("hidden");
      input.value = span.innerText.split(": ")[1];
      span.style.display = "none";
    } else {
      span.innerText = `${span.innerText.split(":")[0]}: ${input.value}`;
      input.style.display = "none";
      span.style.display = "inline-block";
    }
  }
  
  document.getElementById("toggle-senha").addEventListener("click", function () {
    const inputSenha = document.getElementById("input-senha");
    if (inputSenha.type === "password") {
      inputSenha.type = "text";
    } else {
      inputSenha.type = "password";
    }
  });
  