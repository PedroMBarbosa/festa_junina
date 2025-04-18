const url = 'http://localhost:3000/perguntas'; // ENDPOINT DAS PERGUNTAS

class Perguntas {
    constructor(id, nome, tipo_perguntas_id) {
        this.id = id;
        this.nome = nome;
        this.tipo_perguntas_id = tipo_perguntas_id;
    }    
}

const respostasUsuario = [];


//função que vai trazer as perguntas e carregar os rostos
function carregarPerguntas() {
    const container = document.getElementById('container-perguntas');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const pergunta = new Perguntas(item.id, item.nome, item.tipo_perguntas_id);

                const perguntaDiv = document.createElement('div');
                perguntaDiv.classList.add('pergunta');

                const p = document.createElement('p');
                p.textContent = pergunta.nome;

                const opcoes = [
                    { emoji: '😡', texto: 'Muito Ruim' },
                    { emoji: '😕', texto: 'Ruim' },
                    { emoji: '😐', texto: 'Intermediário' },
                    { emoji: '🙂', texto: 'Bom' },
                    { emoji: '😁', texto: 'Muito Bom' }
                ];

                const avaliacaoDiv = document.createElement('div');
                avaliacaoDiv.classList.add('avaliacao');

                opcoes.forEach((opcao, index) => {
                    const span = document.createElement('span');
                    span.classList.add('emoji');
                    span.textContent = opcao.emoji;
                    span.dataset.resposta = opcao.texto;

                    span.addEventListener('click', () => {

                        const todos = avaliacaoDiv.querySelectorAll('.emoji');
                        todos.forEach(e => e.classList.remove('selecionado'));
                        span.classList.add('selecionado');

                        // Remove resposta anterior da mesma pergunta, se houver
                        const indiceExistente = respostasUsuario.findIndex(r => r.perguntaId === pergunta.id);
                        if (indiceExistente !== -1) {
                            respostasUsuario.splice(indiceExistente, 1);
                        }

                        // Adiciona a nova resposta
                        respostasUsuario.push({
                            perguntaId: pergunta.id,
                            resposta: span.dataset.resposta
                        });

                        console.log(respostasUsuario);

                    });

                    avaliacaoDiv.appendChild(span);
                });

                perguntaDiv.appendChild(p);
                perguntaDiv.appendChild(avaliacaoDiv);
                container.appendChild(perguntaDiv);
            });
        })
        .catch(error => console.error("ERRO NA API:", error));
}



//executando a funçao qnd a pagina carrega
document.addEventListener("DOMContentLoaded", function () {
    carregarPerguntas();
});



//enviar pra api qnd clicar no botao
document.getElementById('enviarRespostas').addEventListener('click', () => {
    fetch(url)
        .then(response => response.json())
        .then(perguntas => {
            const totalPerguntas = perguntas.length;
            const totalRespondidas = respostasUsuario.length;

            const perguntasUnicas = [...new Set(respostasUsuario.map(r => r.perguntaId))];

            if (perguntasUnicas.length < totalPerguntas) {
                alert("Responda todas as perguntas antes de enviar.");
                return;
            }

            fetch('http://localhost:3000/respostas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(respostasUsuario)
            })
            .then(response => {
                if (response.ok) {
                    alert("Respostas enviadas com sucesso! Clique em ok para enviar outra.");
                } else {
                    alert("Erro ao enviar respostas.");
                }
            })
            .catch(error => {
                console.error("Erro ao enviar:", error);
                alert("Erro na conexão com a API.");
            });
        });
});



