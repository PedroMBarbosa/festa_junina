const url = 'http://localhost:4000/perguntas'; // ENDPOINT DAS PERGUNTAS

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

                // Ignora a pergunta do tipo "comentário" q vem da api
                if (pergunta.nome.toLowerCase().includes("comentário")) {
                    return; // pula essa pergunta
                }

                const perguntaDiv = document.createElement('div');
                perguntaDiv.classList.add('pergunta');

                const p = document.createElement('p');
                p.textContent = pergunta.nome.toUpperCase();;

                const opcoes = [
                    { imagem: '../img/muitoruim.png', texto: 'Muito Ruim' },
                    { imagem: '../img/ruim.png', texto: 'Ruim' },
                    { imagem: '../img/intermediario.png', texto: 'Intermediário' },
                    { imagem: '../img/bom.png', texto: 'Bom' },
                    { imagem: '../img/muitobom.png', texto: 'Muito Bom' }
                ];

                const avaliacaoDiv = document.createElement('div');
                avaliacaoDiv.classList.add('avaliacao');

                opcoes.forEach((opcao, index) => {
                    const span = document.createElement('span');
                    span.classList.add('emoji');
                    span.dataset.resposta = opcao.texto;

                    const img = document.createElement('img');
                    img.src = opcao.imagem;
                    img.alt = opcao.texto;
                    img.style.width = '80px';
                    img.style.height = '80px';

                    span.appendChild(img);

                    span.addEventListener('click', () => {
                        const todos = avaliacaoDiv.querySelectorAll('.emoji');
                    
                        todos.forEach(e => {
                            e.classList.remove('selecionado');
                            const imgInterno = e.querySelector('img');
                            const baseNome = imgInterno.dataset.base;
                            imgInterno.src = `../img/${baseNome}`; // volta pra imagem original
                        });
                    
                        span.classList.add('selecionado');
                    
                        // trocndo pra imagem colorida qnd clica
                        const baseNome = opcao.imagem.replace('.png', '');
                        img.src = `../img/${baseNome}-colorido.png`;
                    
                        const indiceExistente = respostasUsuario.findIndex(r => r.perguntaId === pergunta.id);
                        if (indiceExistente !== -1) {
                            respostasUsuario.splice(indiceExistente, 1);
                        }
                    
                        respostasUsuario.push({
                            perguntaId: pergunta.id,
                            resposta: span.dataset.resposta
                        });
                    
                        console.log(respostasUsuario);
                    });
                    
                    img.dataset.base = opcao.imagem; // pra saber a imagem original depois

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
document.addEventListener("DOMContentLoaded", function (event) {
    event.preventDefault
    carregarPerguntas();
});

const modal = document.getElementById('confirmationModal');

function showModal() {
    modal.style.display = 'block';
}


//enviar pra api qnd clicar no botao
document.getElementById('enviarRespostas').addEventListener('click', (event) => {
    event.preventDefault();

    fetch(url)
        .then(response => response.json())
        .then(perguntas => {
            const totalPerguntas = perguntas.length;
            const totalRespondidas = respostasUsuario.length;

            const perguntasUnicas = [...new Set(respostasUsuario.map(r => r.perguntaId))];

            // Pega o texto do campo de comentário
            const comentario = document.getElementById('comentario').value.trim();

            // Verifica se todas as perguntas obrigatórias foram respondidas
            // Comentário é opcional, então não entra nessa contagem
            const idPerguntaComentario = perguntas.find(p => p.nome.toLowerCase().includes('comentário'))?.id;
            const totalObrigatorias = idPerguntaComentario ? totalPerguntas - 1 : totalPerguntas;

            if (perguntasUnicas.length < totalObrigatorias) {
                alert("Responda todas as perguntas antes de enviar.");
                return;
            }

            // Se tiver comentário, adiciona como resposta normal
            if (comentario !== "" && idPerguntaComentario) {
                respostasUsuario.push({
                    perguntaId: idPerguntaComentario,
                    resposta: comentario
                });
            }

            const payload = {
                respostas: respostasUsuario
            };

            fetch('http://localhost:4000/respostas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    showModal();
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



document.getElementById('okay').addEventListener('click', () => {
    // fecha o modal
    document.getElementById('confirmationModal').style.display = 'none';

    // opcional: redireciona ou recarrega
    // window.location.reload(); 
    // ou
    // window.location.href = 'pagina-final.html';
});
