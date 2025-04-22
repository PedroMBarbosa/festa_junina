function salvarEdicao() {
    const valor = document.getElementById('valor').value;
    const abertura = document.getElementById('abertura').value;
    const fechamento = document.getElementById('fechamento').value;
    const quantidade = document.getElementById('quantidade').value;
  
    if (!valor || !abertura || !fechamento || !quantidade) {
      alert("Preencha todos os campos!");
      return;
    }
  
    const valorInfantil = (parseFloat(valor.replace(",", ".")) * 0.5).toFixed(2);
  
    const novaLinha = `
      <tr>
        <td>R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}</td>
        <td>R$ ${valorInfantil.replace(".", ",")}</td>
        <td>${abertura}</td>
        <td>${fechamento}</td>
        <td>${quantidade}</td>
      </tr>
    `;
  
    document.getElementById("tabela-corpo").innerHTML = novaLinha;
  
    alert("Lote atualizado com sucesso!");
  }
  
  function cancelar() {
    document.getElementById("valor").value = "16.00";
    document.getElementById("abertura").value = "2025-06-01";
    document.getElementById("fechamento").value = "2025-06-07";
    document.getElementById("quantidade").value = "250";
  }
  