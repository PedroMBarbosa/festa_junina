// Banco de dados simulado de ingressos
const ingressosDB = {
    "ingresso": [
        { "id": 1, "tipo": "Aluno", "preco": 10 },
        { "id": 2, "tipo": "Comunidade", "preco": 10 },
        { "id": 3, "tipo": "Colaborador", "preco": 10 },
        { "id": 4, "tipo": "Familiar", "preco": 10 },
        { "id": 5, "tipo": "Infantil", "preco": 5 }
    ]
};

// Inicializa o carrinho com dados do localStorage (se houver)
let carrinhoItens = JSON.parse(localStorage.getItem("carrinho")) || {};

// Função para alterar quantidade de ingressos
function alterarQtd(item, incremento) {
    const qtdElement = document.getElementById(`qtd-${item}`);
    let qtd = parseInt(qtdElement.textContent) + incremento;
    
    qtd = Math.max(qtd, 0); // Garante que a quantidade nunca seja negativa
    qtdElement.textContent = String(qtd).padStart(2, '0');
}

// Função para adicionar ingressos ao carrinho
function adicionarCarrinho() {
    ingressosDB.ingresso.forEach(ingresso => {
        const qtd = parseInt(document.getElementById(`qtd-${ingresso.tipo.toLowerCase()}`).textContent);
        atualizarItemCarrinho(ingresso.tipo.toLowerCase(), qtd);
    });

    salvarCarrinho();
    atualizarListaCarrinho();
    atualizarTotal();
}

// Função para atualizar item do carrinho
function atualizarItemCarrinho(item, quantidade) {
    if (quantidade > 0) {
        carrinhoItens[item] = quantidade;
    } else {
        delete carrinhoItens[item];
    }
}

// Função para remover um item do carrinho
function removerItem(item) {
    delete carrinhoItens[item];
    document.getElementById(`qtd-${item}`).textContent = '00';
    salvarCarrinho();
    atualizarListaCarrinho();
    atualizarTotal();
}

// Função para exibir os itens do carrinho
function atualizarListaCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    listaCarrinho.innerHTML = '';
    
    for (const item in carrinhoItens) {
        let ingresso = ingressosDB.ingresso.find(i => i.tipo.toLowerCase() === item);
        
        if (ingresso) {
            const li = document.createElement('li');
            li.innerHTML = `
                ${ingresso.tipo} R$${ingresso.preco.toFixed(2)} <span>${String(carrinhoItens[item]).padStart(2, '0')}</span>
                <button onclick="removerItem('${item}')">
                    <img src="../img/lixeira.png" alt="Remover" class="icone-lixeira">
                </button>
            `;
            listaCarrinho.appendChild(li);
        }
    }
}

// Função para calcular e exibir o total do carrinho
function atualizarTotal() {
    let total = 0;

    for (const item in carrinhoItens) {
        let ingresso = ingressosDB.ingresso.find(i => i.tipo.toLowerCase() === item);
        if (ingresso) {
            total += ingresso.preco * carrinhoItens[item];
        }
    }

    document.getElementById('total').textContent = total.toFixed(2);
}

// Função para salvar o carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinhoItens));
}

// Função para carregar o carrinho ao iniciar a página
function carregarCarrinho() {
    atualizarListaCarrinho();
    atualizarTotal();
}

// Chama a função ao carregar a página
window.onload = carregarCarrinho;
