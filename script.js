function lightDark() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    element.classList.toggle("light-mode");

    // Save the theme to localStorage
    var theme = element.className;
    localStorage.setItem('theme', theme);
}

// When the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    // Get the current theme from localStorage
    var theme = localStorage.getItem('theme');

    // If there's no saved theme, use the default
    if (!theme) theme = 'dark-mode';

    // Apply the theme
    var element = document.body;
    element.className = theme;
});

function menuSwitch() {
    var element = document.body;
    element.classList.toggle("menu-show");
    element.classList.toggle("menu-hide");
}
function menuHide() {
    var element = document.body;
    element.classList.remove("menu-show");
    element.classList.add("menu-hide");
}

function searchThing() {
    // Declare variables
    var input, filter, gallery, items, i, img, alt;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    gallery = document.getElementsByClassName("gallery");

    // Loop through all gallery items and hide those that don't match the search query
    for (i = 0; i < gallery.length; i++) {
        items = gallery[i];
        img = items.getElementsByTagName("img")[0];
        alt = img.getAttribute("alt");
        if (alt.toUpperCase().indexOf(filter) > -1) {
            items.style.display = "";
        } else {
            items.style.display = "none";
        }
    }
}

document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', (event) => {
      const tooltip = document.createElement('span');
      tooltip.textContent = event.target.getAttribute('aria-label');
      tooltip.style.position = 'fixed';
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
      tooltip.className = 'tooltip';
      document.body.appendChild(tooltip);
    });
  
    link.addEventListener('mouseleave', () => {
      document.querySelector('.tooltip').remove();
    });
  });
  
