document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.querySelector(".styled-button");
    const loginForm = document.querySelector("form");
    
    loginButton.addEventListener("click", function(event) {
        event.preventDefault(); 
        if (loginForm.style.display === "none") {
            loginForm.style.display = "block";
        } else {
            loginForm.style.display = "none";
        }
    });
    document.addEventListener('click', function(event) {
        if (!loginForm.contains(event.target) && event.target !== loginButton) {
            loginForm.style.display = "none";
        }
    });
});
