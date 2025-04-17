
const url = 'http://localhost:3000/Usuario/0' //ENDPOINT ------>>>> DEVE SER TROCADA PELA ORIGINAL

fetch(url)
  .then(res => res.json())
  .then(data => {
    document.getElementById('nome-completo').innerText = data.nome;
    document.getElementById('telefone').innerText = data.telefone;
    document.getElementById('email').innerText = data.email;
    // senha normalmente você não mostra completa
  })
  .catch(err => console.error('Erro ao carregar perfil:', err));
