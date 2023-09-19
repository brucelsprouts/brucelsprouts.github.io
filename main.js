// Store references to navigation items and content sections
const navItems = document.querySelectorAll('.siteHeader_nav a');
const contentSections = document.querySelectorAll('.page');
const enterView = document.getElementById("EnterView");

// Function to update the content based on the selected menu item
function navigateToSection(targetURL) {
    // Remove the 'active' class from all content sections
    contentSections.forEach(section => section.classList.remove('active'));

    // Show the content section corresponding to the target URL
    const targetSection = document.querySelector(targetURL);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Function to handle navigation item clicks
function handleNavigationClick(event) {
    event.preventDefault();

    // Remove the 'is-selected' class from all items
    navItems.forEach(navItem => navItem.classList.remove('is-selected'));

    // Add the 'is-selected' class to the clicked item
    const item = event.target;
    item.classList.add('is-selected');

    // Get the target URL from the clicked item's href attribute
    const targetURL = item.getAttribute('href');

    // Update the content based on the target URL
    navigateToSection(targetURL);
}

// Function to add smooth scrolling to anchor links
function addSmoothScrolling(anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });
}

// Function to change header background color on scroll
function changeHeaderBackgroundColor() {
    const header = document.querySelector('.siteHeader');
    const headerHeight = header.clientHeight;

    contentSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            header.style.backgroundColor = section.getAttribute('data-header-bg-color');
        }
    });
}

// Add click event listeners to navigation items
navItems.forEach(item => {
    item.addEventListener('click', handleNavigationClick);
});

// Add smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(addSmoothScrolling);

// Function to remove the EnterView after fade-out animation
function removeEnterView() {
    enterView.style.display = "none";
}

// Add an event listener to remove EnterView after animation completes
enterView.addEventListener("animationend", removeEnterView);

// Add a scroll event listener for changing header background color
window.addEventListener('scroll', changeHeaderBackgroundColor);

// Initial page load: Show the Home page by default
navigateToSection('#home');

// Add the 'is-selected' class to the Home tab by default
document.querySelector('[href="#home"]').classList.add('is-selected');
