// Store references to navigation items and content sections
const navItems = document.querySelectorAll('.siteHeader_nav li');
const contentSections = document.querySelectorAll('.page');

// Add click event listeners to navigation items
navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        // Prevent default link behavior
        event.preventDefault();

        // Remove the 'is-selected' class from all items
        navItems.forEach((navItem) => {
            navItem.classList.remove('is-selected');
        });

        // Add the 'is-selected' class to the clicked item
        item.classList.add('is-selected');

        // Get the target URL from the clicked item's href attribute
        const targetURL = item.querySelector('a').getAttribute('href');

        // Update the content based on the target URL
        updateContent(targetURL);
    });
});

// Function to update the content based on the selected menu item
function updateContent(targetURL) {
    // Hide all content sections
    contentSections.forEach((section) => {
        section.style.display = 'none';
    });

    // Show the content section corresponding to the target URL
    const targetSection = document.querySelector(targetURL);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// Initial page load: Show the Home page by default
updateContent('#home');
