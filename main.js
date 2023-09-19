document.addEventListener("DOMContentLoaded", function () {
    // Get references to the navigation links
    const homeLink = document.querySelector('a[href="index.html"]');
    const codeProjectsLink = document.querySelector('a[href="codepj.html"]');
    const afterEffectsProjectsLink = document.querySelector('a[href="aftereffectpj.html"]');
    const photoshopProjectsLink = document.querySelector('a[href="photoshoppj.html"]');
    const infoLink = document.querySelector('a[href="info.html"]');
    const contactLink = document.querySelector('a[href="contact.html"]');
  
    // Get the main content container
    const contentContainer = document.getElementById("Content");
  
    // Define a function to hide all sections
    function hideAllSections() {
      const sections = document.querySelectorAll(".page");
      sections.forEach((section) => {
        section.style.display = "none";
      });
    }
  
    // Define a function to show a specific section
    function showSection(sectionId) {
      hideAllSections();
      const section = document.querySelector(`[data-page="${sectionId}"]`);
      if (section) {
        section.style.display = "block";
      }
    }
  
    // Add click event listeners to the navigation links
    homeLink.addEventListener("click", () => {
      showSection("home");
    });
  
    codeProjectsLink.addEventListener("click", () => {
      showSection("codeprojects"); // Match the data-page attribute
    });
  
    afterEffectsProjectsLink.addEventListener("click", () => {
      showSection("aftereffectprojects"); // Match the data-page attribute
    });
  
    photoshopProjectsLink.addEventListener("click", () => {
      showSection("photoshopprojects"); // Match the data-page attribute
    });
  
    infoLink.addEventListener("click", () => {
      showSection("info");
    });
  
    contactLink.addEventListener("click", () => {
      showSection("contact");
    });
  
    // Initialize by showing the "home" section
    showSection("home");
  });
  