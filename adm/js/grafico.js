document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Alunos', 'Familiares', 'Infantil', 'Colaboradores', 'Comunidade'],
        datasets: [{
          data: [90, 50, 30, 50, 100],
          backgroundColor: ['#66b3ff', '#ff9999', '#99ff99', '#ffcc99', '#c2c2f0'],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  });
  