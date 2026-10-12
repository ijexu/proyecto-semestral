const mainmenubutton = document.getElementById('mainmenubutton');
const closemenu
 = document.getElementById('closemenu');
const menu = document.getElementById('menu');

mainmenubutton.addEventListener('click', () => {
    menu.style.display= 'flex';
})

closemenu.addEventListener('click', () => {
    menu.style.display= 'none';
})

window.addEventListener('click', (evento) => {
    if(evento.target === menu) {
        menu.style.display = 'none';
    }
});