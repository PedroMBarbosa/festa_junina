document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('lista-pagamentos');
    const usuarios = [
      { email: "carlos@gmail.com", ingressos: 5, status: "Pendente" },
      { email: "marcia@gmail.com", ingressos: 3, status: "Confirmado" },
      { email: "joão@gmail.com", ingressos: 3, status: "Pendente" },
      { email: "ana@gmail.com", ingressos: 2, status: "Confirmado" },
      { email: "felipe@gmail.com", ingressos: 4, status: "Confirmado" },
      { email: "ricardo@gmail.com", ingressos: 1, status: "Pendente" },
    ];
  
    function renderLista(filtrados = usuarios) {
      lista.innerHTML = "";
      filtrados.forEach(user => {
        const li = document.createElement("li");
        li.className = "item-lista";
  
        li.innerHTML = `
          <span>${user.email}</span>
          <span>${user.ingressos} ingressos</span>
          <span class="${user.status.toLowerCase()}">${user.status}</span>
        `;
        lista.appendChild(li);
      });
    }
  
    renderLista();
  
    document.getElementById('btn-filtro').addEventListener('click', () => {
      const texto = document.getElementById('filtro-input').value.toLowerCase();
      const filtrados = usuarios.filter(user =>
        user.email.toLowerCase().includes(texto) ||
        user.status.toLowerCase().includes(texto)
      );
      renderLista(filtrados);
    });
  
    // Botões laterais de status
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.status;
        const filtrados = usuarios.filter(user =>
          user.status.toLowerCase() === status
        );
        renderLista(filtrados);
      });
    });
  });
  