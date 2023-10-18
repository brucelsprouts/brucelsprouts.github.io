document.addEventListener("DOMContentLoaded", function() {
        function openTab(tabName) {
        var i;
        var tabs = document.getElementsByClassName("tab");
        for (i = 0; i < tabs.length; i++) {
            tabs[i].style.display = "none";
        }
        document.getElementById(tabName).style.display = "block";
    }

    function toggleMode() {
        const body = document.body;
        body.classList.toggle("dark-mode");
        body.classList.toggle("light-mode");
    }   
});