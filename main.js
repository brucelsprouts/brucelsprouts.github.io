document.addEventListener("DOMContentLoaded", function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll(".siteHeader_nav a");

    // Get all sections
    const sections = document.querySelectorAll(".page");

    // Function to hide all sections
    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = "none";
        });
    }

    // Function to show a specific section by ID
    function showSection(sectionId) {
        hideAllSections();
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = "block";
        }
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetSectionId = link.getAttribute("href").substring(1); // Remove the '#' symbol
            showSection(targetSectionId);
        });
    });

    // Show the default section (e.g., Home) when the page loads
    showSection("home");
});

// Add event listeners to the navigation links to show the corresponding sections
const navLinks = document.querySelectorAll(".siteHeader_nav a");
navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            // Hide all sections
            const sections = document.querySelectorAll(".page");
            sections.forEach(section => {
                section.style.display = "none";
            });

            // Show the target section
            targetSection.style.display = "block";
        }
    });
});
