document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const btnFiltro = document.getElementById('btn-filtro');
  const dropdownContent = document.getElementById('dropdown-filtro');
  const lista = document.getElementById('lista-pagamentos');
  let usuarios = [];

  btnFiltro.addEventListener('click', () => {
    dropdown.classList.toggle('show');
  });

  window.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target) && e.target !== btnFiltro) {
      dropdown.classList.remove('show');
    }
  });

  function renderLista(filtrados = usuarios) {
    lista.innerHTML = "";
    filtrados.forEach((user) => {
      const li = document.createElement("li");
      li.className = "item-lista";

      li.innerHTML = `
        <span>${user.email}</span>
        <span>${user.ingressos.length} ingressos</span>
        <span class="status-label ${user.statusTexto.toLowerCase()}" style="cursor:pointer;">${user.statusTexto}</span>
      `;

      const statusSpan = li.querySelector(".status-label");
      statusSpan.addEventListener("click", () => {
        const novoStatusId = user.status_id === 0 ? 1 : 0;
        const novoStatusTexto = novoStatusId === 1 ? "Confirmado" : "Pendente";

        const ingresso = user.ingressos[0]; // Pegando o primeiro ingresso do usuário

        const payload = {
          id: ingresso.id,
          qrcode: ingresso.qrcode || "string",
          data: new Date().toISOString(),
          tipo_ingresso_id: ingresso.tipo_ingresso_id,
          usuario_id: ingresso.usuario_id,
          lote_id: ingresso.lote_id,
          status_id: novoStatusId,
          cliente_id: ingresso.cliente_id,
          guid: ingresso.guid
        };

        fetch(`http://10.90.146.37/api/api/Ingresso/AlterarStatus/${ingresso.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(res => res.json())
          .then(() => {
            user.status_id = novoStatusId;
            user.statusTexto = novoStatusTexto;
            renderLista(usuarios);
          })
          .catch(err => {
            console.error("Erro ao atualizar status:", err);
            alert("Erro ao atualizar status.");
          });
      });

      lista.appendChild(li);
    });
  }

  function carregarUsuarios() {
    fetch('http://10.90.146.37/api/api/Ingresso')
      .then(res => res.json())
      .then(data => {
        const agrupados = {};

        data.forEach(ingresso => {
          const idUsuario = ingresso.usuario_id;
          if (!agrupados[idUsuario]) {
            agrupados[idUsuario] = {
              id: idUsuario,
              email: ingresso.usuario?.email || `Usuário ${idUsuario}`,
              ingressos: [],
              status_id: ingresso.status_id,
              statusTexto: ingresso.status_id === 1 ? "Confirmado" : "Pendente"
            };
          }

          agrupados[idUsuario].ingressos.push(ingresso);
        });

        usuarios = Object.values(agrupados);
        renderLista(usuarios);
      })
      .catch(err => {
        console.error("Erro ao buscar dados:", err);
        alert("Erro ao carregar dados.");
      });
  }

  // Filtro funcional
  document.querySelectorAll('.filtro-status').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-status').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const status = btn.dataset.status;
      const filtrados = usuarios.filter(user => user.statusTexto.toLowerCase() === status);
      renderLista(filtrados);
      dropdown.classList.remove('show');
    });
  });

  carregarUsuarios();
});
