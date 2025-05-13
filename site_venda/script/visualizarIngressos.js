function mostrarModal(mensagem, tipo = "info") {
    return new Promise((resolve) => {
        const modal = document.getElementById("myModal");
        const textoModal = document.getElementById("texto_modal");
        const fecharModal = document.getElementById("close_modal");
        const botaoOk = document.querySelector(".botao_ok");

        textoModal.textContent = mensagem;

        modal.classList.remove("modal-success", "modal-error");
        if (tipo === "sucesso") modal.classList.add("modal-success");
        if (tipo === "erro") modal.classList.add("modal-error");

        modal.style.display = "block";

        const fechar = () => {
            modal.style.display = "none";
            fecharModal.onclick = null;
            botaoOk.onclick = null;
            window.onclick = null;
        };

        fecharModal.onclick = () => {
            fechar();
            resolve(false);
        };

        botaoOk.onclick = () => {
            fechar();
            resolve(true); // só resolve true se o botão OK for clicado
        };

        window.onclick = function (event) {
            if (event.target === modal) {
                fechar();
                resolve(false);
            }
        };
    });
}

async function deletarIngresso(id, elementoCard) {
    const confirmacao = await mostrarModal("Tem certeza que deseja deletar este ingresso cancelado?", "info");
    if (!confirmacao) return;

    try {
        const response = await fetch(`http://10.90.146.37/api/api/Ingresso/CancelarIngresso/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            await mostrarModal("Ingresso cancelado com sucesso!", "sucesso");
            elementoCard.remove(); // Remove o card imediatamente após o sucesso
        } else {
            await mostrarModal("Erro ao cancelar ingresso.", "erro");
        }
    } catch (error) {
        console.error(error);
        await mostrarModal("Erro ao conectar com o servidor.", "erro");
    }
}

async function visualizarIngresso() {
    try {
        const idLogado = localStorage.getItem("clienteId");

        const [resIngressos, resUsuarios, resLotes] = await Promise.all([
            fetch(`http://10.90.146.37/api/api/Ingresso/ConsultarIngresso/${idLogado}`),
            fetch(`http://10.90.146.37/api/api/Usuario`),
            fetch(`http://10.90.146.37/api/api/Lote`)
        ]);

        const ingressos = await resIngressos.json();
        const usuarios = await resUsuarios.json();
        const lotes = await resLotes.json();

        if (!resIngressos.ok || !resUsuarios.ok) return;

        const container = document.querySelector(".container");
        container.innerHTML = ""; // Limpa os cards antigos

        ingressos.forEach(ingresso => {
            const usuario = usuarios.find(u => u.id === ingresso.usuario_id);
            const nomeUsuario = usuario ? usuario.nome : "Usuário Desconhecido";
            const lote = lotes.find(l => l.id === ingresso.lote_id);
            const valorUn = lote ? lote.valor_un.toFixed(2) : "10,00";

            let tipo = "";
            let statusClass = "";
            switch (ingresso.status_id) {
                case 1: tipo = "pendente"; statusClass = "pendente"; break;
                case 2: tipo = "pago"; statusClass = "pago"; break;
                case 3:
                default: tipo = "cancelado"; statusClass = "cancelado"; break;
            }

            const card = document.createElement("div");
            card.className = "card-ingresso";

            if (tipo === "pago") {
                card.innerHTML = `
                    <div class="card-topo">Ingressos Adquiridos</div>
                    <div class="card-conteudo">
                        <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                        <img src="http://10.90.146.37/qrcodes/${ingresso.qrcode}.png" alt="QR Code" id="qrcode">
                        <p class="status ${statusClass}">Pedido ${tipo}</p>
                        <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                        <span id="valor">R$${valorUn}</span></p>
                        <div class="btns"></div>
                        <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                    </div>
                `;
            } else if (tipo === "pendente") {
                card.innerHTML = `
                    <div class="card-topo">Ingressos Adquiridos</div>
                    <div class="card-conteudo">
                        <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                        <img src="../img/a64784b6-eb50-4131-a1af-2694027ee471.png" alt="QR Code" id="qrcode">
                        <p class="status ${statusClass}">Pedido ${tipo}</p>
                        <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                        <span id="valor">R$${valorUn}</span></p>
                        <div class="btns">
                            <button onclick="deletarIngresso(${ingresso.id}, this.closest('.card-ingresso'))">Cancelar</button>
                        </div>
                        <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                    </div>
                `;
            } else if (tipo === "cancelado") {
                card.innerHTML = `
                    <div class="card-topo2">Ingressos Adquiridos</div>
                    <div class="card-conteudo2">
                        <p class="status ${statusClass}">Pedido ${tipo}</p>
                    </div>
                `;
            }

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar ingressos:", error);
    }
}

visualizarIngresso();
