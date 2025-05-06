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

  // Dados de exemplo com IDs e status_id
  const usuarios = [
    
  ];

  const lista = document.getElementById('lista-pagamentos');

  function renderLista(filtrados = usuarios) {
    lista.innerHTML = "";
    filtrados.forEach((user) => {
      const li = document.createElement("li");
      li.className = "item-lista";

      li.innerHTML = `
        <span>${user.email}</span>
        <span>${user.ingressos} ingressos</span>
        <span class="status-label ${user.status.toLowerCase()}" style="cursor:pointer;">${user.status}</span>
      `;

      const statusSpan = li.querySelector(".status-label");
      statusSpan.addEventListener("click", () => {
        const novoStatus = user.status === "Pendente" ? "Confirmado" : "Pendente";
        const novoStatusId = novoStatus === "Confirmado" ? 1 : 0;

        const bodyPayload = {
          id: user.id,
          qrcode: "string",
          data: new Date().toISOString(),
          tipo_ingresso_id: 0,
          usuario_id: 0,
          lote_id: 0,
          status_id: novoStatusId,
          cliente_id: 0,
          guid: "00000000-0000-0000-0000-000000000000"
        };

        fetch(`http://10.90.146.37/api/api/Ingresso/AlterarStatus/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyPayload)
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(txt => {
                console.error("Erro ao atualizar status:", txt);
                throw new Error("Erro ao atualizar status");
              });
            }
            return response.json();
          })
          .then(data => {
            user.status = novoStatus;
            user.status_id = novoStatusId;

            const filtroAtivo = document.querySelector(".dropdown-content button.active");
            if (filtroAtivo) {
              const statusFiltro = filtroAtivo.dataset.status;
              const filtrados = usuarios.filter(u => u.status.toLowerCase() === statusFiltro);
              renderLista(filtrados);
            } else {
              renderLista(usuarios);
            }
          })
          .catch(error => {
            alert("Erro ao atualizar o status no servidor.");
            console.error(error);
          });
      });

      lista.appendChild(li);
    });
  }

  renderLista();

  // Filtro funcional
  document.querySelectorAll('.filtro-status').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-status').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const status = btn.dataset.status;
      const filtrados = usuarios.filter(user => user.status.toLowerCase() === status);
      renderLista(filtrados);
      dropdown.classList.remove('show');
    });
  });
});
