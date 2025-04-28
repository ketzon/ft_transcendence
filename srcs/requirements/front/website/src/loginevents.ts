import { router } from "./router.ts";

interface signinformValues {
    email: string,
    password: string,
}

// Cette fonction reset la couleur rouge sur les inputs (class incorrect) lorsque l'user ecrit a nouveau dans un input precedemment faux.
function resetErrors(): void {
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const errElement = document.getElementById("error-message")

    const allInputs = [emailInput, passwordInput];

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
function verifyInputs(data: signinformValues): string[] {
    let errors = [];

    if (data.email === "" || data.email == null)
    {
        const emailInput = document.getElementById("email-input");

        errors.push("Email is required");
        if (emailInput)
            emailInput.parentElement?.classList.add("incorrect");
    }

    if (data.password === "" || data.password == null)
    {
        const passwordInput = document.getElementById("password-input");

        errors.push("Password is required");
        if (passwordInput)
            passwordInput.parentElement?.classList.add("incorrect");
    }
    return (errors);
}

function getFormValues(): signinformValues {
    const emailInput = document.getElementById("email-input") as HTMLInputElement;
    const passwordInput = document.getElementById("password-input") as HTMLInputElement;

    let data: signinformValues = {
        email: emailInput?.value,
        password: passwordInput?.value,
    }
    return (data);
}

async function sendForm(data: signinformValues, errElement: HTMLElement): Promise<void> {
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
        errElement.innerText = "SUCCESSFULL LOGIN";
        // errElement.innerText = responseData.message;

        setTimeout(() => {
            window.history.pushState(null, "", "/twofa");
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

export function loginEvents(): void {
    const form = document.getElementById("login-form");
    const errElement = document.getElementById("error-message") as HTMLElement;

    resetErrors();

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("LOGIN BUTTON CLICKED");

        //On recup les donnees des inputs du form.
        const inputsValues: signinformValues = getFormValues();
        console.log("DATA TO BE SENT : ",inputsValues);


        let errors = verifyInputs(inputsValues);

        //Si il y a des erreurs dans les inputs
        if (errors.length > 0)
        {
            if(errElement)
                errElement.innerText = errors.join(". ");
            console.log("FORM NOT VALID");
        }

        //Si pas d'erreurs on envoie les datas du form au backend
        console.log("FORM IS VALID");
        sendForm(inputsValues, errElement);
    })
}
