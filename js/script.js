function lightDark() {
    console.log("Toggling light/dark mode");
    var element = document.body;
    element.classList.toggle("dark-mode");
    element.classList.toggle("light-mode");
    localStorage.setItem('theme', element.className);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    var theme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = theme;
    checkMenu();
});

window.addEventListener('resize', checkMenu);

function checkMenu() {
    console.log("Checking menu visibility");
    var element = document.getElementById("myMenu");
    element.style.transition = "none";
    window.innerWidth <= 750 ? menuHide() : menuShow();
    setTimeout(() => element.style.transition = "", 100);
}

function menuSwitch() {
    console.log("Toggling menu visibility");
    var element = document.getElementById("myMenu");
    element.classList.contains("menu-show") ? menuHide() : menuShow();
}

function menuShow() {
    console.log("Showing menu");
    var element = document.getElementById("myMenu");
    element.classList.remove("menu-hide");
    element.classList.add("menu-show");
}

function menuHide() {
    console.log("Hiding menu");
    var element = document.getElementById("myMenu");
    element.classList.remove("menu-show");
    element.classList.add("menu-hide");
}

function searchThing() {
    console.log("Searching in gallery");
    var input = document.getElementById('myInput').value.toUpperCase();
    var gallery = document.getElementsByClassName("gallery");
    Array.from(gallery).forEach(items => {
        var img = items.getElementsByTagName("img")[0];
        items.style.display = img.getAttribute("alt").toUpperCase().includes(input) ? "" : "none";
    });
}

function fadeInPage() {
    console.log("Fading in page");
    if (!window.AnimationEvent) { return; }
    var fader = document.getElementById('fader');
    fader.classList.add('fade-out');
}

function setupLinkFade() {
    console.log("Setting up link fade");
    if (!window.AnimationEvent) return;
    var fader = document.getElementById('fader');
    Array.from(document.getElementsByTagName('a')).forEach(anchor => {
        // Exclude dark/light mode and menu switch buttons
        if (anchor.classList.contains('darklight-icons') || anchor.classList.contains('menu-icons')) return;
        if (anchor.hostname !== window.location.hostname || anchor.pathname === window.location.pathname) return;
        anchor.addEventListener('click', event => {
            console.log("Link clicked, fading out");
            event.preventDefault();
            fader.classList.add('fade-in');
            fader.addEventListener('animationend', () => window.location = anchor.href, { once: true });
        });
    });
}

window.addEventListener('pageshow', event => {
    console.log("Page show event");
    if (event.persisted) document.getElementById('fader').classList.remove('fade-in');
});

// document.addEventListener('DOMContentLoaded', function() {
//     if (!window.AnimationEvent) { return; }
//     var anchors = document.getElementsByTagName('a');
    
//     for (var idx = 0; idx < anchors.length; idx += 1) {
//         if (anchors[idx].hostname !== window.location.hostname ||
//             anchors[idx].pathname === window.location.pathname) {
//             continue;
//         }

//         anchors[idx].addEventListener('click', function(event) {
//             var fader = document.getElementById('fader'),
//                 anchor = event.currentTarget;
            
//             var listener = function() {
//                 window.location = anchor.href;
//                 fader.removeEventListener('animationend', listener);
//             };
//             fader.addEventListener('animationend', listener);
            
//             event.preventDefault();
//             fader.classList.add('fade-in');
//         });
//     }
// });
