function adicionarLote() {
    const valor = document.getElementById('valor').value;
    const abertura = document.getElementById('abertura').value;
    const fechamento = document.getElementById('fechamento').value;
    const quantidade = document.getElementById('quantidade').value;
  
    if (!valor || !abertura || !fechamento || !quantidade) {
      alert("Preencha todos os campos!");
      return;
    }
  
    const valorInfantil = (parseFloat(valor.replace("R$", "").replace(",", ".")) * 0.5).toFixed(2);
  
    const novaLinha = `
      <tr>
        <td>R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}</td>
        <td>R$ ${valorInfantil.replace(".", ",")}</td>
        <td>${abertura}</td>
        <td>${fechamento}</td>
        <td>${quantidade}</td>
      </tr>
    `;
  
    document.getElementById("tabela-corpo").insertAdjacentHTML("beforeend", novaLinha);
  
    document.getElementById("valor").value = "";
    document.getElementById("abertura").value = "";
    document.getElementById("fechamento").value = "";
    document.getElementById("quantidade").value = "";
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
  