function alterarQtd(item, incremento) {
    const qtdElement = document.getElementById(`qtd-${item}`);
    let qtdAtual = parseInt(qtdElement.textContent);
    let novaQtd = qtdAtual + incremento;

    if (novaQtd < 0) {
        novaQtd = 0;
    }

    // Soma total de ingressos já selecionados (antes de alterar o atual)
    let totalSelecionado = 0;
    const tipos = ['aluno', 'comunidade', 'colaborador', 'familiar', 'infantil'];

    tipos.forEach(tipo => {
        if (tipo === item) {
            totalSelecionado += novaQtd; // Considera a nova quantidade
        } else {
            const qtdTipo = parseInt(document.getElementById(`qtd-${tipo}`).textContent);
            totalSelecionado += qtdTipo;
        }
    });

    if (totalSelecionado > 5) {
        alert("Você só pode selecionar no máximo 5 ingressos no total. Quando efetuado o pagamento será liberado a compra de mais");
        return; // cancela se passar do limite
    }

    qtdElement.textContent = String(novaQtd).padStart(2, '0');
}

let carrinhoItens = {};

function adicionarCarrinho() {
    const alunoQtd = parseInt(document.getElementById('qtd-aluno').textContent);
    const comunidadeQtd = parseInt(document.getElementById('qtd-comunidade').textContent);
    const colaboradorQtd = parseInt(document.getElementById('qtd-colaborador').textContent);
    const familiarQtd = parseInt(document.getElementById('qtd-familiar').textContent);
    const infantilQtd = parseInt(document.getElementById('qtd-infantil').textContent);

    atualizarItemCarrinho('aluno', alunoQtd);
    atualizarItemCarrinho('comunidade', comunidadeQtd);
    atualizarItemCarrinho('colaborador', colaboradorQtd);
    atualizarItemCarrinho('familiar', familiarQtd);
    atualizarItemCarrinho('infantil', infantilQtd);

    atualizarListaCarrinho();
    atualizarTotal();
}

function atualizarItemCarrinho(item, quantidade) {
    if (quantidade > 0) {
        carrinhoItens[item] = quantidade;
    } else if (carrinhoItens[item]) {
        delete carrinhoItens[item];
    }
}

function removerItem(item) {
    delete carrinhoItens[item];
    const qtdElement = document.getElementById(`qtd-${item}`);
    qtdElement.textContent = '00';
    atualizarListaCarrinho();
    atualizarTotal();
}

function atualizarListaCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    listaCarrinho.innerHTML = '';
    for (const item in carrinhoItens) {
        let nomeItem;
        let preco;
        switch (item) {
            case 'aluno':
                nomeItem = 'Aluno';
                preco = 10.00;
                break;
            case 'comunidade':
                nomeItem = 'Comunidade';
                preco = 10.00;
                break;
            case 'colaborador':
                nomeItem = 'Colaborador';
                preco = 10.00;
                break;
            case 'familiar':
                nomeItem = 'Familiar';
                preco = 10.00;
                break;
            case 'infantil':
                nomeItem = 'Infantil (até 10 anos)';
                preco = 5.00;
                break;
        }
        const li = document.createElement('li');
        li.innerHTML = `
            ${nomeItem} R$${preco.toFixed(2)} <span>${String(carrinhoItens[item]).padStart(2, '0')}</span>
            <button onclick="removerItem('${item}')">
                <img src="../img/lixeira.png" alt="Remover" class="icone-lixeira">
            </button>
        `;
        listaCarrinho.appendChild(li);
    }
}

function atualizarTotal() {
    let total = 0;
    for (const item in carrinhoItens) {
        let preco;
        switch (item) {
            case 'aluno':
            case 'comunidade':
            case 'colaborador':
            case 'familiar':
                preco = 10.00;
                break;
            case 'infantil':
                preco = 5.00;
                break;
        }
        total += preco * carrinhoItens[item];
    }
    document.getElementById('total').textContent = total.toFixed(2);
}
window.onload = adicionarCarrinho;


