function signupPopup() {
    let signupBtn = document.querySelector("nav a");
    let popupBox = document.querySelector(".sign-up-popup");
    console.log(signupBtn);
    console.log(popupBox);

    signupBtn.addEventListener("click", (event) => {
        event.preventDefault();

        popupBox.classList.add("active");
    })

    popupBox.addEventListener("click", (event) => {

        if (event.target === popupBox)
                popupBox.classList.remove("active");
    })
}

function submitRegister() {
    let registerForm = document.querySelector(".sign-up-popup form");

    console.log(registerForm);
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Form submitted");

        const name = document.getElementById("name");
        const password = document.getElementById("password");

        console.log(name.value);
        console.log(password.value);

        // fetch('/api/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application.json',
        //     },
        //     body: JSON.stringify({name, password}),
        // })
    })
}

signupPopup();
submitRegister();
