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

  // Filtro funcional
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

  // Clique nas opções do dropdown
  document.querySelectorAll('.filtro-status').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.dataset.status;
      const filtrados = usuarios.filter(user =>
        user.status.toLowerCase() === status
      );
      renderLista(filtrados);
      dropdown.classList.remove('show');
    });
  });
});
