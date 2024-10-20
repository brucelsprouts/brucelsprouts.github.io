function lightDark() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    element.classList.toggle("light-mode");
    localStorage.setItem('theme', element.className);
}

document.addEventListener('DOMContentLoaded', () => {
    var theme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = theme;
    checkMenu();
});

window.addEventListener('resize', checkMenu);

function checkMenu() {
    var element = document.getElementById("myMenu");
    element.style.transition = "none";
    window.innerWidth <= 750 ? menuHide() : menuShow();
    setTimeout(() => element.style.transition = "", 100);
}

function menuSwitch() {
    var element = document.getElementById("myMenu");
    element.classList.contains("menu-show") ? menuHide() : menuShow();
}

function menuShow() {
    var element = document.getElementById("myMenu");
    element.classList.remove("menu-hide");
    element.classList.add("menu-show");
}

function menuHide() {
    var element = document.getElementById("myMenu");
    element.classList.remove("menu-show");
    element.classList.add("menu-hide");
}

function searchThing() {
    var input = document.getElementById('myInput').value.toUpperCase();
    var gallery = document.getElementsByClassName("gallery");
    Array.from(gallery).forEach(items => {
        var img = items.getElementsByTagName("img")[0];
        items.style.display = img.getAttribute("alt").toUpperCase().includes(input) ? "" : "none";
    });
}

function fadeInPage() {
    if (!window.AnimationEvent) { return; }
    var fader = document.getElementById('fader');
    fader.setAttribute('class', 'fade-out');
}
function setupLinkFade() {
    if (!window.AnimationEvent) return;
    var fader = document.getElementById('fader');
    Array.from(document.getElementsByTagName('a')).forEach(anchor => {
        // Exclude dark/light mode and menu switch buttons
        if (anchor.classList.contains('darklight-icons') || anchor.classList.contains('menu-icons')) return;
        if (anchor.hostname !== window.location.hostname || anchor.pathname === window.location.pathname) return;
        anchor.addEventListener('click', event => {
            if (event.metaKey || event.ctrlKey) return; // Allow opening in new tab
            event.preventDefault();
            fader.setAttribute('class', 'fade-in');
            fader.addEventListener('animationend', () => window.location = anchor.href, { once: true });
        });
    });
}
window.addEventListener('pageshow', event => {
    if (event.persisted) {
        var fader = document.getElementById('fader');
        fader.removeAttribute('class', 'fade-in');
        fader.setAttribute('class', 'fade-out');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    if (!window.AnimationEvent) { return; }
    var anchors = document.getElementsByTagName('a');
    
    for (var idx = 0; idx < anchors.length; idx += 2) {
        if (anchors[idx].hostname !== window.location.hostname ||
            anchors[idx].pathname === window.location.pathname) {
            continue;
        }

        anchors[idx].addEventListener('click', function(event) {
            if (event.metaKey || event.ctrlKey) return; // Allow opening in new tab
            var fader = document.getElementById('fader'),
                anchor = event.currentTarget;
            
            var listener = function() {
                window.location = anchor.href;
                fader.removeEventListener('animationend', listener);
            };
            fader.addEventListener('animationend', listener);
            
            event.preventDefault();
            fader.setAttribute('class', 'fade-in');
        });
    }
});
