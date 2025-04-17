const menu = document.getElementById('menu');
const opcoes = document.getElementById('menu-options');

function abre_menu() {
    opcoes.style.display = 'flex';
}

function fecha_menu() {
    opcoes.style.display = 'none';
}

function toggle_menu() {
    const estaAberto = opcoes.style.display === 'flex';
    if (estaAberto) {
        fecha_menu();
    } else {
        abre_menu();
    }
}

menu.addEventListener('click', toggle_menu);
