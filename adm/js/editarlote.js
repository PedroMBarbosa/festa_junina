

const url = 'http://10.90.146.37/api/api/Lote/CadastrarLote'


let lotePronto = null;

const usuario_id = //FAZER O LOCALSTORAGE (ou outro tipo de armazenamento do id do usuario ao fazer login)  

function salvarEdicao() {
  const valor = document.getElementById('valor').value;
  const abertura = document.getElementById('abertura').value;
  const fechamento = document.getElementById('fechamento').value;
  const quantidade = document.getElementById('quantidade').value;

  if (!valor || !abertura || !fechamento || !quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  const valorNumerico = parseFloat(valor.replace(",", "."));
  const valorInfantil = (valorNumerico / 2).toFixed(2);

  const novaLinha = `
    <tr>
      <td>R$ ${valorNumerico.toFixed(2).replace(".", ",")}</td>
      <td>R$ ${valorInfantil.replace(".", ",")}</td>
      <td>${abertura}</td>
      <td>${fechamento}</td>
      <td>${quantidade}</td>
    </tr>
  `;

  document.getElementById("tabela-corpo").innerHTML = novaLinha;

  // const usuarioId = parseInt(localStorage.getItem('usuario_id')); // pega o ID do usuário logado
  // if (!usuarioId) {
  //   alert("Usuário não está logado.");
  //   return;
  // }


  lotePronto = {
    id: 0,
    qtd_total: parseInt(quantidade),
    data_inicio: new Date(abertura).toISOString(),
    data_termino: new Date(fechamento).toISOString(),
    valor_un: parseFloat(valor.replace(",", ".")),
    usuario_id: usuario_id,
    ativo: 0
  };

  console.log("lote pronto: ", lotePronto)

} 

function cancelar() {
  document.getElementById("valor").value = "16.00";
  document.getElementById("abertura").value = "2025-06-01";
  document.getElementById("fechamento").value = "2025-06-07";
  document.getElementById("quantidade").value = "250";
}

function salvar() {
  // if (lotePronto == null) {
  //   alert("Você precisa concluir a edição antes de salvar.");
  //   return;
  // }
  console.log("Dados a serem enviados:", JSON.stringify(lotePronto));
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lotePronto)
  })
  .then(async response => {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text); 
    }
    const data = JSON.parse(text);
    console.log('Lote criado:', data);
  })
  .catch(error => {
    console.error('Erro ao criar lote:', error);
    alert('Erro ao criar lote: ' + error.message);
  });
}