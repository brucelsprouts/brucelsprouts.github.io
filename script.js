function lightDark() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    element.classList.toggle("light-mode");
}

function menuSwitch() {
    var element = document.body;
    element.classList.toggle("menu-show");
    element.classList.toggle("menu-hide");
}
function menuHide() {
    var element = document.body;
    element.classList.remove("menu-show");
    element.classList.add("menu-hide");
}
