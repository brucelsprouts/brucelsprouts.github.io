// Store references to navigation items and content sections
const navItems = document.querySelectorAll('.siteHeader_nav a');
const contentSections = document.querySelectorAll('.page');

// Function to update the content based on the selected menu item
function updateContent(targetURL) {
    // Hide all content sections
    contentSections.forEach(section => section.style.display = 'none');

    // Show the content section corresponding to the target URL
    const targetSection = document.querySelector(targetURL);
    if (targetSection) targetSection.style.display = 'block';
}

// Add click event listeners to navigation items
navItems.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();

        // Remove the 'is-selected' class from all items
        navItems.forEach(navItem => navItem.classList.remove('is-selected'));

        // Add the 'is-selected' class to the clicked item
        item.classList.add('is-selected');

        // Get the target URL from the clicked item's href attribute
        const targetURL = item.getAttribute('href');

        // Update the content based on the target URL
        updateContent(targetURL);

        // If you want to close a mobile menu after clicking a link, you can add code here.
    });
});

// Add smooth scrolling behavior for internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Initial page load: Show the Home page by default
updateContent('#home');

// Add the 'is-selected' class to the Home tab by default
document.querySelector('[href="#home"]').classList.add('is-selected');

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the EnterView element
    const enterView = document.getElementById("EnterView");

    // Function to remove the EnterView after fade-out animation
    function removeEnterView() {
        enterView.style.display = "none";
    }

    // Add an event listener to remove EnterView after animation completes
    enterView.addEventListener("animationend", removeEnterView);
});

