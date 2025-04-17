const url = 'http://localhost:3000/usuario?id=1'; // ENDPOINT ------>>>> DEVE SER TROCADA PELA ORIGINAL
let usuarioId = null;


class Usuario {
    constructor(id, nome, telefone, email, senha) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
    }    
}

document.addEventListener("DOMContentLoaded", function () {
    criarInputs(); 


    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const usuario = data[0];
                
                usuarioId = usuario.id;
                console.log("ID do usuário:", usuarioId);

                document.getElementById('nome-completo').innerText = usuario.nome;
                document.getElementById('email').innerText = usuario.email;
                document.getElementById('telefone').innerText = usuario.telefone;
                document.getElementById('senha').innerText = usuario.senha;

                document.getElementById('username').innerText = usuario.nome

                document.getElementById('input-nome').value = usuario.nome;
                document.getElementById('input-telefone').value = usuario.telefone;
                document.getElementById('input-email').value = usuario.email;
                document.getElementById('input-senha').value = usuario.senha;
            }
        })
        .catch(err => console.error('Erro ao carregar perfil:', err));
});


function criarInputs() {
    const campos = [
        { id: 'nome-completo', inputId: 'input-nome', tipo: 'text' },
        { id: 'telefone', inputId: 'input-telefone', tipo: 'text' },
        { id: 'email', inputId: 'input-email', tipo: 'email' },
        { id: 'senha', inputId: 'input-senha', tipo: 'password' }
    ];

    campos.forEach(campo => {
        const span = document.getElementById(campo.id);
        const jaTemInput = document.getElementById(campo.inputId);
        if (!jaTemInput && span) {
            const input = document.createElement('input');
            input.type = campo.tipo;
            input.id = campo.inputId;
            input.classList.add('input-editar');
            input.style.display = 'none';
            span.parentNode.insertBefore(input, span.nextSibling);
        }
    });
}

const senhaSpan = document.getElementById("senha")
const senhaInput = document.getElementById("input-senha");
const botaoOlho = document.getElementById("toggle-senha");

let visivel = true;

botaoOlho.addEventListener("click", () => {
    if (senhaSpan !== ""){ /////MERDA BOSTA
        if (senhaInput.type === "password") {
        senhaInput.type = "text";
        botaoOlho.src = "../img/eye-open.png";
        } else {
        senhaInput.type = "password";
        botaoOlho.src = "../img/eye-close.png";
        }
    }
    else{
        senhaSpan.classList.add("blur");
    }
    

    console.log("teste, clicado")
});



document.getElementById('btn-editar-dados').addEventListener('click', function editarCampos() {
    const spans = document.querySelectorAll('#nome-completo, #telefone, #email, #senha');
    const inputs = document.querySelectorAll('#input-nome, #input-telefone, #input-email, #input-senha');

    spans.forEach(span => span.style.display = 'none');
    inputs.forEach(input => input.style.display = 'inline');

    const btnEditar = document.getElementById('btn-editar-dados');
    btnEditar.innerHTML = '<img src="../img/save.png" class="edit"> Salvar';
    btnEditar.removeEventListener('click', editarCampos);
    btnEditar.addEventListener('click', salvarEdicao);

    document.getElementById('toggle-senha').style.display = 'inline';

});

async function salvarEdicao(){
    const inputs = document.querySelectorAll('.info-item input, .info-item1 input');
    const nomeCompleto = document.getElementById('input-nome').value;
    const telefone = document.getElementById('input-telefone').value;
    const email = document.getElementById('input-email').value;
    const senha = document.getElementById('input-senha').value;

    // Recuperando  o id
    const btnEditar = document.getElementById('btn-editar-dados');

    let dados = JSON.stringify({ id: usuarioId,
            nome_completo: nomeCompleto,
            telefone: telefone,
            email: email,
            senha: senha
        }) 
    
     console.log(dados)
    let resposta = await fetch(`http://localhost:3000/usuario?id=1`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dados
    })

    
    
    
    

    //http://localhost:3000/Usuario?id=1
    // fetch(`http://localhost:3000/Usuario/1`, { 
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         id: usuarioId,
    //         nome_completo: nomeCompleto,
    //         telefone: telefone,
    //         email: email,
    //         senha: senha
    //     })
    // })
    // .then(response => {
    //     console.log(response.data)
    //     if (!response.ok) {
    //         throw new Error("Erro ao atualizar usuário");
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     document.getElementById('nome-completo').innerText = nomeCompleto;
    //     document.getElementById('telefone').innerText = telefone;
    //     document.getElementById('email').innerText = email;
    //     document.getElementById('senha').innerText = senha;

    //     const infoItems = document.querySelectorAll('.info-item span, .info-item1 span');
    //     const inputs = document.querySelectorAll('.info-item input, .info-item1 input');
    //     infoItems.forEach((span, index) => {
    //         span.style.display = 'inline';
    //         inputs[index].style.display = 'none';
    //     });

    //     btnEditar.innerHTML = '<img src="imagens/edit.png" class="edit"> Editar';
    //     btnEditar.removeEventListener('click', salvarEdicao);
    //     btnEditar.addEventListener('click', editarCampos);
    // })
    // .catch(error => {
    //     console.error('Erro ao salvar os dados:', error);
    //     alert('Erro ao salvar as alterações');
    // });
}

back = document.getElementById('back')

function voltar(){
    location.href= 'index.html'
}

back.addEventListener("click", function () {  
    voltar()
});


document.getElementById('editar-imagem').addEventListener('click', function() {
    
});