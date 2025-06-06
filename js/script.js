function lightDark() {
    var element = document.body;
    
    // Add the transitioning class to enable smooth transitions
    element.classList.add('theme-transitioning');
    
    // Toggle classes
    element.classList.toggle("dark-mode");
    element.classList.toggle("light-mode");
    
    // Store theme preference
    localStorage.setItem('theme', element.className);
    
    // Update icons to match the current theme
    updateThemeIcons();
    
    // Update theme-aware image containers
    updateThemeAwareImages();
    
    // Remove the transitioning class after the transition is complete
    setTimeout(() => {
        element.classList.remove('theme-transitioning');
    }, 400); // Match this to the transition duration in CSS
}

document.addEventListener('DOMContentLoaded', () => {
    // Set dark mode as default if no theme is stored
    var theme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = theme;
    
    // Ensure theme-related icons are correctly displayed
    setTimeout(() => {
        updateThemeIcons();
        setupThemeAwareImages();
    }, 50); // Small delay to ensure DOM is fully loaded
    
    // Setup page transitions and animations
    setupLinkFade();
    fadeInPage();
    
    // Setup side menu
    setupSideMenu();
    
    // Set active nav link
    setActiveNavLink();
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
    
    // Update all images with dark/light variants
    // First approach: images with -dark and -light in filename
    document.querySelectorAll('img[src*="-dark."], img[src*="-light."]').forEach(img => {
        const currentSrc = img.getAttribute('src');
        if (currentSrc) {
            if (isDarkMode && currentSrc.includes('-light.')) {
                img.src = currentSrc.replace('-light.', '-dark.');
            } else if (!isDarkMode && currentSrc.includes('-dark.')) {
                img.src = currentSrc.replace('-dark.', '-light.');
            }
        }
    });
    
    // Update background images or colors if needed
    const backgroundImage = document.getElementById('background-image');
    if (backgroundImage) {
        // Already handled by CSS filter
    }
}

// Update theme-aware image containers based on current theme
function updateThemeAwareImages() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    document.querySelectorAll('.theme-aware-container').forEach(container => {
        const darkImage = container.querySelector('.dark-mode-image');
        const lightImage = container.querySelector('.light-mode-image');
        
        if (darkImage && lightImage) {
            if (isDarkMode) {
                darkImage.style.opacity = '1';
                darkImage.style.position = 'relative';
                lightImage.style.opacity = '0';
                lightImage.style.position = 'absolute';
            } else {
                darkImage.style.opacity = '0';
                darkImage.style.position = 'absolute';
                lightImage.style.opacity = '1';
                lightImage.style.position = 'relative';
            }
        }
    });
}

// Function to set up theme-aware image pairs initially
function setupThemeAwareImages() {
    document.querySelectorAll('.theme-aware-container').forEach(container => {
        const darkImage = container.querySelector('.dark-mode-image');
        const lightImage = container.querySelector('.light-mode-image');
        
        if (darkImage && lightImage) {
            // Ensure images have the same dimensions and styles
            darkImage.style.width = '100%';
            lightImage.style.width = '100%';
            lightImage.style.top = '0';
            lightImage.style.left = '0';
            
            // Set initial positions
            lightImage.style.position = 'absolute';
            darkImage.style.position = 'relative';
            
            // Apply initial visibility based on current theme
            updateThemeAwareImages();
        }
    });
}

// Setup side menu functionality
function setupSideMenu() {
    const menuButton = document.querySelector('.menu-icons');
    const sideMenu = document.querySelector('.side-menu-container');
    const overlay = document.querySelector('.menu-overlay');
    const closeButton = document.querySelector('.side-menu-close');
    
    if (menuButton && sideMenu && overlay) {
        // Open menu when menu button is clicked
        menuButton.addEventListener('click', (e) => {
            e.preventDefault();
            sideMenu.classList.add('menu-show');
            overlay.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
        
        // Close menu when overlay is clicked
        overlay.addEventListener('click', () => {
            closeMenu();
        });
        
        // Close menu when close button is clicked
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                closeMenu();
            });
        }
        
        // Close menu when ESC key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sideMenu.classList.contains('menu-show')) {
                closeMenu();
            }
        });
        
        // Close menu when any menu item is clicked
        const menuLinks = sideMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only close if it's an internal link and not control buttons
                if (!link.classList.contains('control-button')) {
                    closeMenu();
                }
            });
        });
    }
}

// Function to close the side menu
function closeMenu() {
    const sideMenu = document.querySelector('.side-menu-container');
    const overlay = document.querySelector('.menu-overlay');
    
    if (sideMenu && overlay) {
        sideMenu.classList.remove('menu-show');
        overlay.classList.remove('visible');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function menuSwitch() {
    const sideMenu = document.querySelector('.side-menu-container');
    const overlay = document.querySelector('.menu-overlay');
    
    if (sideMenu && overlay) {
        if (sideMenu.classList.contains('menu-show')) {
            closeMenu();
        } else {
            sideMenu.classList.add('menu-show');
            overlay.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
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

// Function to search gallery items
function searchThing() {
    var input = document.getElementById('myInput');
    if (!input) return;
    
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

// Handle skill section animations on scroll
document.addEventListener('DOMContentLoaded', function() {
  // Call fadeInPage to handle initial page load fade effect
  fadeInPage();
  
  // Setup fade transitions for links
  setupLinkFade();
  
  // Check if we're on a skill page
  const skillSections = document.querySelectorAll('.skill-page-content');
  if (skillSections.length > 0) {
    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    
    // Function to handle fade in animation
    function handleScrollAnimation() {
      const skillContent = document.querySelector('.skill-page-content');
      if (skillContent && isInViewport(skillContent)) {
        skillContent.style.opacity = '1';
        skillContent.style.transform = 'translateY(0)';
        // Once we've triggered the animation, remove the scroll listener
        window.removeEventListener('scroll', handleScrollAnimation);
      }
    }
    
    // Run on scroll
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Run on page load
    handleScrollAnimation();
  }
});

// Function to set active class on current page's navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.middle-section a, .side-menu-content a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath) {
            // Check if the current path ends with the link's href
            if (currentPath.endsWith(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}