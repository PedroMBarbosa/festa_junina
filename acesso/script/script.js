// leitura.js

async function verificarQRCode(qrCodeLido) {
    const resultElement = document.getElementById("result");
    const errorElement = document.getElementById("error");
  
    try {
      const response = await fetch(`http://localhost:3000/ingressos`);
      const ingressos = await response.json();
  
      const ingressoEncontrado = ingressos.find(
        ingresso => ingresso["QR Code"] === qrCodeLido
      );
  
      if (ingressoEncontrado) {
        // Atualiza o status para "Entrou"
        await fetch(`http://localhost:3000/ingressos/${ingressoEncontrado.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ Status: "Entrou" })
        });
  
        resultElement.innerHTML = `
          <strong>QR Code:</strong> ${qrCodeLido}<br>
          <strong>Status:</strong> Entrou
        `;
      } else {
        resultElement.innerHTML = "";
        errorElement.textContent = "QR Code não encontrado no banco de dados.";
      }
    } catch (err) {
      console.error(err);
      errorElement.textContent = "Erro ao acessar o banco de dados.";
    }
  }
  