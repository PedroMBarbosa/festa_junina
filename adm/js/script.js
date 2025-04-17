// Aguarda o DOM estar carregado antes de rodar qualquer coisa
document.addEventListener("DOMContentLoaded", function () {
  // Login
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      fetch(`http://localhost:3000/usuarios?email=${email}&senha=${senha}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            alert(`Bem-vindo, ${data[0].nome}!`);
            window.location.href = "views/controle.html"; // Redireciona para a página de controle
          } else {
            alert("Email ou senha inválidos!");
          }
        })
        .catch(error => {
          console.error("Erro ao fazer login:", error);
        });
    });
  }

  // Gráfico
  const chartCanvas = document.getElementById('chart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Alunos', 'Familiares', 'Infantil', 'Colaboradores'],
        datasets: [{
          label: 'Ingressos',
          data: [90, 50, 30, 50],
          backgroundColor: [
            '#2e00ff',
            '#d62828',
            '#da70d6',
            '#f4801f'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }
});
