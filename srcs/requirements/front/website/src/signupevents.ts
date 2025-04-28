import { router } from "./router.ts";

interface formValues {
    username: string,
    email: string,
    password: string,
    repeatpassword: string
}

// Cette fonction reset la couleur rouge sur les inputs (class incorrect) lorsque l'user ecrit a nouveau dans un input precedemment faux.
function resetErrors(): void {
    const usernameInput = document.getElementById("username-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const errElement = document.getElementById("error-message");

    const allInputs = [usernameInput, emailInput, passwordInput, repeatPasswordInput];

    allInputs.forEach(input => {
        input?.addEventListener("input", () => {
            if (input.parentElement?.classList.contains("incorrect"))
            {
                input.parentElement.classList.remove("incorrect");
                if (errElement)
                    errElement.innerText = "";
            }
        })
    })
}

// Verifie les inputs un par un. Retourne un array de strings qui contient les erreurs a afficher dans le form.
// Ajouter ici pour des verifications plus poussees.
function verifyInputs(data: formValues) {
    let errors = [];

    if (data.username === "" || data.username == null)
    {
        const usernameInput = document.getElementById("username-input");

        errors.push("Username is required");
        usernameInput?.parentElement?.classList.add("incorrect");
    }

    if (data.email === "" || data.email == null)
    {
        const emailInput = document.getElementById("email-input");

        errors.push("Email is required");
        emailInput?.parentElement?.classList.add("incorrect");
    }

    if (data.password === "" || data.password == null)
    {
        const passwordInput = document.getElementById("password-input");

        errors.push("Password is required");
        passwordInput?.parentElement?.classList.add("incorrect");
    }
    if (data.password !== data.repeatpassword)
    {
        const repeatPasswordInput = document.getElementById("repeat-password-input");

        errors.push("Password does not match repeated password");
        repeatPasswordInput?.parentElement?.classList.add("incorrect");
    }

    return (errors);
}

async function sendForm(data: formValues, errElement: HTMLElement): Promise<void> {
    try
    {
        //changer l'url par celle de l'api
        const res = await fetch ("https://reqres.in/api/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // credentials: "include", // Permet de recevoir le cookie d'auth, sera utilise systematiquement dans chaque request apres.
            body: JSON.stringify(data),
        });

        if (!res.ok)
        {
            const errorData = await res.json();

            console.error("Message erreur du back : ", errorData.message);
            errElement.innerText = errorData.message;
            return ;
        }

        const responseData = await res.json();

        console.log("Message success du back : ", responseData.message);
        console.log(responseData);
        errElement.innerText = "SUCCESSFULL REGISTER";
        // errElement.innerText = responseData.message;

        setTimeout(() => {
            // window.history.pushState(null, "", "/twofa"); On peut direct rediriger vers le 2fa ?
            window.history.pushState(null, "", "/login");
            router();
        }, 1500);
    }

    catch(error)
    {
        console.error("Erreur du fetch : ", error);
        if (errElement)
            errElement.innerText = "Unexpected Error";
    }
}

function getFormValues(): formValues {
    const usernameInput = document.getElementById("username-input") as HTMLInputElement;
    const emailInput = document.getElementById("email-input") as HTMLInputElement;
    const passwordInput = document.getElementById("password-input") as HTMLInputElement;
    const repeatPasswordInput = document.getElementById("repeat-password-input") as HTMLInputElement;

    let data: formValues = {
        username: usernameInput?.value,
        email: emailInput?.value,
        password: passwordInput?.value,
        repeatpassword: repeatPasswordInput?.value
    }
    return (data);
}

export function signupEvents(): void {
    const form = document.getElementById("signup-form");
    const errElement = document.getElementById("error-message") as HTMLElement;

    resetErrors();

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("SIGNUP BUTTON CLICKED");

        //On recupere les donnees des inputs du form.
        const inputsValues: formValues = getFormValues();
        console.log("DATA TO BE SENT : ",inputsValues);


        let errors = verifyInputs(inputsValues);

        //Si il y a des erreurs dans les inputs on affiche les erreurs et on stop.
        if (errors.length > 0)
        {
            if (errElement)
                errElement.innerText = errors.join(". ");
            console.log("FORM NOT VALID");

            return ;
        }
        //Sinon on envoie les datas au back et on redirige vers /login en cas de success.
        console.log("FORM IS VALID");
        sendForm(inputsValues, errElement);
    })

}
