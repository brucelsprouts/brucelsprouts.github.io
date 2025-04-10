function lightDark() {
    var element = document.body;
    
    // Toggle classes
    element.classList.toggle("dark-mode");
    element.classList.toggle("light-mode");
    
    // Store theme preference
    localStorage.setItem('theme', element.className);
    
    // Update icons to match the current theme
    updateThemeIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    // Set dark mode as default if no theme is stored
    var theme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = theme;
    
    // Ensure theme-related icons are correctly displayed
    setTimeout(updateThemeIcons, 50); // Small delay to ensure DOM is fully loaded
    
    // Initialize menu state based on screen size
    checkMenu();
    
    // Set initial visibility of menu buttons based on screen size
    setMenuButtonVisibility();
    
    // Setup page transitions and animations
    setupLinkFade();
    fadeInPage();
});

// Update icon visibility when theme changes
function updateThemeIcons() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Force update theme icon visibility
    const moonIcon = document.getElementById('moon-image');
    const sunIcon = document.getElementById('sun-image');
    
    if (moonIcon && sunIcon) {
        if (isDarkMode) {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        } else {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        }
    }
    
    // Update social media icons if they exist
    const socialIcons = [
        'github-icon', 'linkedin-icon', 'youtube-icon', 'instagram-icon'
    ];
    
    socialIcons.forEach(iconId => {
        const icon = document.getElementById(iconId);
        if (icon) {
            // Update src attribute based on theme
            const currentSrc = icon.getAttribute('src');
            if (currentSrc) {
                if (isDarkMode && currentSrc.includes('light-')) {
                    icon.src = currentSrc.replace('light-', 'dark-');
                } else if (!isDarkMode && currentSrc.includes('dark-')) {
                    icon.src = currentSrc.replace('dark-', 'light-');
                }
            }
        }
    });
    
    // Update menu icons visibility
    const whiteMenu = document.getElementById('white-menu');
    const blackMenu = document.getElementById('black-menu');
    
    if (whiteMenu && blackMenu) {
        if (isDarkMode) {
            whiteMenu.style.display = 'block';
            blackMenu.style.display = 'none';
        } else {
            whiteMenu.style.display = 'none';
            blackMenu.style.display = 'block';
        }
    }
    
    // Update background images or colors if needed
    const backgroundImage = document.getElementById('background-image');
    if (backgroundImage) {
        // Handle background image changes if necessary
    }
}

window.addEventListener('resize', () => {
    checkMenu();
    setMenuButtonVisibility();
});

function checkMenu() {
    var element = document.getElementById("myMenu");
    if (!element) return; // Safeguard against null reference
    
    element.style.transition = "none";
    
    if (window.innerWidth <= 750) {
        menuHide();
    } else {
        menuShow();
    }
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
        if (element) element.style.transition = "";
    }, 100);
}

function menuSwitch() {
    var element = document.getElementById("myMenu");
    if (!element) return; // Safeguard against null reference
    
    if (element.classList.contains("menu-show")) {
        menuHide();
    } else {
        menuShow();
    }
}

function menuShow() {
    var element = document.getElementById("myMenu");
    if (!element) return; // Safeguard against null reference
    
    element.classList.remove("menu-hide");
    element.classList.add("menu-show");
}

function menuHide() {
    var element = document.getElementById("myMenu");
    if (!element) return; // Safeguard against null reference
    
    element.classList.remove("menu-show");
    element.classList.add("menu-hide");
}

function searchThing() {
    var input = document.getElementById('myInput');
    if (!input) return; // Safeguard against null reference
    
    var searchText = input.value.toUpperCase();
    var gallery = document.getElementsByClassName("gallery");
    
    Array.from(gallery).forEach(items => {
        var img = items.getElementsByTagName("img")[0];
        if (img) {
            var altText = img.getAttribute("alt").toUpperCase();
            items.style.display = altText.includes(searchText) ? "" : "none";
        }
    });
}

function fadeInPage() {
    if (!window.AnimationEvent) { return; }
    
    var fader = document.getElementById('fader');
    if (fader) {
        fader.classList.add('fade-out');
    }
}

function setupLinkFade() {
    if (!window.AnimationEvent) return;
    
    var fader = document.getElementById('fader');
    if (!fader) return;
    
    Array.from(document.getElementsByTagName('a')).forEach(anchor => {
        // Exclude dark/light mode and menu switch buttons
        if (anchor.classList.contains('darklight-icons') || anchor.classList.contains('menu-icons')) return;
        
        // Only apply fade to links to other pages within the site
        if (anchor.hostname !== window.location.hostname || anchor.pathname === window.location.pathname) return;
        
        anchor.addEventListener('click', event => {
            if (event.metaKey || event.ctrlKey) return; // Allow opening in new tab
            
            event.preventDefault();
            fader.classList.add('fade-in');
            
            fader.addEventListener('animationend', () => {
                window.location = anchor.href;
            }, { once: true });
        });
    });
}

window.addEventListener('pageshow', event => {
    if (event.persisted) {
        var fader = document.getElementById('fader');
        if (fader) {
            fader.classList.remove('fade-in');
            fader.classList.add('fade-out');
        }
    }
});

// Set menu button visibility based on screen width
function setMenuButtonVisibility() {
    const menuIcons = document.querySelectorAll('.menu-icons');
    
    if (window.innerWidth <= 750) {
        // Show menu button on mobile
        menuIcons.forEach(icon => {
            icon.style.display = 'flex';
            icon.style.pointerEvents = 'auto';
        });
    } else {
        // Hide menu button on desktop
        menuIcons.forEach(icon => {
            icon.style.display = 'none';
            icon.style.pointerEvents = 'none';
        });
    }
}