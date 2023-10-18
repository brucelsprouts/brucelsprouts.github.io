function showPage(pageId) {
    const pages = document.querySelectorAll('.content');
    for (const page of pages) {
        page.style.display = 'none';
    }
    document.getElementById(pageId).style.display = 'block';
}

function lightDark() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    element.classList.toggle("light-mode");
}