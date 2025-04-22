const lista = document.getElementById('lista-pagamentos');
const criarLoteBtn = document.getElementById('criarLoteBtn');

// Carregar do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  const dadosSalvos = JSON.parse(localStorage.getItem('lotes')) || [];
  dadosSalvos.forEach(lote => criarLote(lote.nome, lote.status));
});

// Criar novo lote
function criarLote(nome = "Lote Exemplo", status = "pendente") {
  const li = document.createElement('li');
  li.className = 'item-lista';

  const spanNome = document.createElement('span');
  spanNome.textContent = nome;

  const spanStatus = document.createElement('span');
  spanStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  spanStatus.className = status;

  const botoes = document.createElement('span');
  botoes.innerHTML = `
    <button onclick="editarLote(this)">✏️</button>
    <button onclick="excluirLote(this)">🗑️</button>
    <button onclick="alternarStatus(this)">🔁</button>
  `;
  botoes.style.display = 'flex';
  botoes.style.gap = '5px';

  li.appendChild(spanNome);
  li.appendChild(spanStatus);
  li.appendChild(botoes);
  lista.appendChild(li);

  salvarLocalStorage();
}

function excluirLote(botao) {
  if (confirm("Tem certeza que deseja excluir este lote?")) {
    const li = botao.closest('li');
    li.remove();
    salvarLocalStorage();
  }
}

function editarLote(botao) {
  const li = botao.closest('li');
  const nomeAtual = li.children[0].textContent;
  const novoNome = prompt("Editar nome do lote:", nomeAtual);
  if (novoNome) {
    li.children[0].textContent = novoNome;
    salvarLocalStorage();
  }
}

function alternarStatus(botao) {
  const li = botao.closest('li');
  const spanStatus = li.children[1];
  if (spanStatus.classList.contains('pendente')) {
    spanStatus.className = 'confirmado';
    spanStatus.textContent = 'Confirmado';
  } else {
    spanStatus.className = 'pendente';
    spanStatus.textContent = 'Pendente';
  }
  salvarLocalStorage();
}

criarLoteBtn.addEventListener('click', () => {
  const nome = prompt("Digite o nome do novo lote:");
  if (nome) criarLote(nome);
});

// Salvar todos os lotes no localStorage
function salvarLocalStorage() {
  const lotes = [];
  document.querySelectorAll('#lista-pagamentos li').forEach(li => {
    const nome = li.children[0].textContent;
    const status = li.children[1].className;
    lotes.push({ nome, status });
  });
  localStorage.setItem('lotes', JSON.stringify(lotes));
}
