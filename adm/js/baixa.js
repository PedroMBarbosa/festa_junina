document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const btnFiltro = document.getElementById('btn-filtro');
  const dropdownContent = document.getElementById('dropdown-filtro');

  btnFiltro.addEventListener('click', () => {
    dropdown.classList.toggle('show');
  });

  // Fechar o dropdown se clicar fora
  window.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // Dados de exemplo
  const usuarios = [
    { email: "carlos@gmail.com", ingressos: 5, status: "Pendente" },
    { email: "marcia@gmail.com", ingressos: 3, status: "Confirmado" },
    { email: "joão@gmail.com", ingressos: 3, status: "Pendente" },
    { email: "ana@gmail.com", ingressos: 2, status: "Confirmado" },
    { email: "felipe@gmail.com", ingressos: 4, status: "Confirmado" },
    { email: "ricardo@gmail.com", ingressos: 1, status: "Pendente" },
  ];

  const lista = document.getElementById('lista-pagamentos');

  function renderLista(filtrados = usuarios) {
    lista.innerHTML = "";
    filtrados.forEach((user, index) => {
      const li = document.createElement("li");
      li.className = "item-lista";

      li.innerHTML = `
        <span>${user.email}</span>
        <span>${user.ingressos} ingressos</span>
        <span class="status-label ${user.status.toLowerCase()}" style="cursor:pointer;">${user.status}</span>
      `;

      const statusSpan = li.querySelector(".status-label");
      statusSpan.addEventListener("click", () => {
        // Alterna o status
        user.status = user.status === "Pendente" ? "Confirmado" : "Pendente";

        // Reaplica o filtro se necessário
        const filtroAtivo = document.querySelector(".dropdown-content button.active");
        if (filtroAtivo) {
          const statusFiltro = filtroAtivo.dataset.status;
          const filtrados = usuarios.filter(u => u.status.toLowerCase() === statusFiltro);
          renderLista(filtrados);
        } else {
          renderLista(usuarios);
        }
      });

      lista.appendChild(li);
    });
  }

  renderLista();

  // Filtro funcional
  document.querySelectorAll('.filtro-status').forEach(btn => {
    btn.addEventListener('click', () => {
      // Destaca botão ativo
      document.querySelectorAll('.filtro-status').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const status = btn.dataset.status;
      const filtrados = usuarios.filter(user => user.status.toLowerCase() === status);
      renderLista(filtrados);
      dropdown.classList.remove('show');
    });
  });
});
