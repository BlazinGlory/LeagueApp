const minimize = document.getElementById('minimize');
const maximize = document.getElementById('maximize');
const close_app = document.getElementById('closeapp');

minimize.addEventListener('click', minimizeapp);
maximize.addEventListener('click', maximizeapp);
close_app.addEventListener('click', closeapp);

function minimizeapp () {
    api.window.minimize();
}

function maximizeapp () {
    api.window.maximize();
}

function closeapp () {
    api.window.close();
}

function openNav() {
    document.getElementById("sidebar").style.width = "150px";
    document.getElementById("main").style.marginLeft = "150px";
}
function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}