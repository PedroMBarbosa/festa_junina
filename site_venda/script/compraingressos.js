// Banco de dados de ingressos
const compraingressos = {
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
function adicionarAoCarrinho() {
    compraingressos.ingresso.forEach(ingresso => {
        const qtd = parseInt(document.getElementById(`qtd-${ingresso.tipo.toLowerCase()}`).textContent);
        if (qtd > 0) { // Apenas adiciona itens com quantidade maior que zero
            carrinhoItens[ingresso.tipo.toLowerCase()] = {
                tipo: ingresso.tipo,
                quantidade: qtd,
                preco: ingresso.preco
            };
        }
    });

    salvarCarrinho();
    atualizarListaCarrinho();
    atualizarTotal();
    salvarNoBancoDeDados(); // Envia os dados para o banco
}

// Função para remover um item do carrinho
function removerItem(item) {
    if (carrinhoItens[item]) {
        delete carrinhoItens[item]; // Remove do objeto carrinhoItens
    }

    salvarCarrinho(); // Atualiza o localStorage
    atualizarListaCarrinho(); // Atualiza visualmente a lista
    atualizarTotal(); // Recalcula o total
    salvarNoBancoDeDados(); // Atualiza o banco de dados
}

// Função para salvar os dados no banco de dados via API
async function salvarNoBancoDeDados() {
    try {
        const response = await fetch("http://localhost:3000/api/salvarCarrinho", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ carrinho: carrinhoItens })
        });

        const resultado = await response.json();
        console.log("Banco de dados atualizado:", resultado);
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
    }
}

// Função para atualizar a lista visual do carrinho
function atualizarListaCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    listaCarrinho.innerHTML = '';

    for (const item in carrinhoItens) {
        let ingresso = carrinhoItens[item];

        const li = document.createElement('li');
        li.innerHTML = `
            ${ingresso.tipo} R$${ingresso.preco.toFixed(2)} <span>${String(ingresso.quantidade).padStart(2, '0')}</span>
            <button onclick="removerItem('${item}')">
                <img src="../img/lixeira.png" alt="Remover" class="icone-lixeira">
            </button>
        `;
        listaCarrinho.appendChild(li);
    }
}

// Função para calcular e exibir o total da compra
function atualizarTotal() {
    let total = 0;

    for (const item in carrinhoItens) {
        total += carrinhoItens[item].preco * carrinhoItens[item].quantidade;
    }

    document.getElementById('total').textContent = total.toFixed(2);
}

// Função para salvar o carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinhoItens));
}

// Função para carregar o carrinho ao iniciar a página
window.onload = () => {
    carrinhoItens = JSON.parse(localStorage.getItem("carrinho")) || {};
    atualizarListaCarrinho();
    atualizarTotal();
};
