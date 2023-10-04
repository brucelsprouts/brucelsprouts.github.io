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

            // Toggle the "nav-active" class for all links
            navLinks.forEach(navLink => {
                navLink.classList.toggle("nav-active");

            });
        });
    });

    // Show the default section (e.g., Home) when the page loads
    showSection("home");
});