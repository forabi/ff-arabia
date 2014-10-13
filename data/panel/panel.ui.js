document.getElementById('refresh').onclick = triggerUpdate;

document.getElementById('home').onclick = function(e) {
    e.preventDefault();
    visitHome();
}