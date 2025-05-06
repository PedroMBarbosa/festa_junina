function adicionarLote() {
  const valor = document.getElementById('valor').value;
  const abertura = document.getElementById('abertura').value;
  const fechamento = document.getElementById('fechamento').value;
  const quantidade = document.getElementById('quantidade').value;

  if (!valor || !abertura || !fechamento || !quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  const valorNumerico = parseFloat(valor.replace("R$", "").replace(",", "."));
  const valorInfantil = (valorNumerico * 0.5).toFixed(2);

  // Corpo da requisição conforme o Swagger da API
  const payload = {
    id: 0,
    qtd_total: parseInt(quantidade),
    data_inicio: new Date(abertura).toISOString(),
    data_termino: new Date(fechamento).toISOString(),
    valor_un: valorNumerico,
    usuario_id: 1, // ajuste conforme seu sistema
    ativo: 1
  };

  // Envia o lote para a API
  fetch("http://10.90.146.37/api/api/Lote/CadastrarLote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao cadastrar lote.");
      return response.json();
    })
    .then(data => {
      // Insere na tabela se sucesso
      const novaLinha = `
        <tr>
          <td>R$ ${valorNumerico.toFixed(2).replace(".", ",")}</td>
          <td>R$ ${valorInfantil.replace(".", ",")}</td>
          <td>${abertura}</td>
          <td>${fechamento}</td>
          <td>${quantidade}</td>
        </tr>
      `;
      document.getElementById("tabela-corpo").insertAdjacentHTML("beforeend", novaLinha);

      // Limpa os campos
      document.getElementById("valor").value = "";
      document.getElementById("abertura").value = "";
      document.getElementById("fechamento").value = "";
      document.getElementById("quantidade").value = "";

      alert("Lote cadastrado com sucesso!");
    })
    .catch(error => {
      console.error(error);
      alert("Falha ao cadastrar o lote.");
    });
}

function concluir() {
  alert("Lote concluído!");
}

function cancelar() {
  document.getElementById("valor").value = "";
  document.getElementById("abertura").value = "";
  document.getElementById("fechamento").value = "";
  document.getElementById("quantidade").value = "";
}
