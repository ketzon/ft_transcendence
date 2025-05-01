import { router } from "../router.ts";
import { printResponse } from "../utils.ts";
import { toasts } from "../toasts.ts";

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
        const res = await fetch ("http://localhost:3000/user/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include", // Permet de recevoir le cookie d'auth, sera utilise systematiquement dans chaque request apres.
            body: JSON.stringify(data),
        });
        const responseData = await res.json();

        if (!res.ok)
        {
            toasts.error("Register failed");
            printResponse("/signup", responseData);
            errElement.innerText = responseData.message;
            return ;
        }
        toasts.success("Register successfull");
        printResponse("/signup", responseData);
        errElement.innerText = responseData.message;
        setTimeout(() => {
            // window.history.pushState(null, "", "/twofa"); On peut direct rediriger vers le 2fa ?
            window.history.pushState(null, "", "/login");
            router();
        }, 1500);
    }
    catch(error)
    {
        toasts.error("Register failed");
        console.error("Erreur du fetch : ", error);
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

export function signupView(): string {
    return /*html*/`
   <div id="signup-view" class="bg-violet-950">
                    <div class="wrapper h-screen w-[max(40%,600px)] bg-violet-200 flex flex-col justify-center items-center m-auto p-2.5 rounded-2xl">
                        <h1 class="text-5xl text-[var(--text-color)] uppercase">Signup</h1>
                        <p id="error-message" class="text-[var(--error-color)]"></p>
                        <form id="signup-form" class="w-[min(400px,100%)] flex flex-col items-center gap-2.5 mt-5 mb-12">
                            <div class="w-full flex flex-row-reverse justify-center">
                                <input type="text" name="username" id="username-input" placeholder="Username" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-r-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer">
                                <label for="username-input" class="bg-[var(--accent-color)] h-12 w-12 flex justify-center shrink-0 items-center fill-white text-white text-2xl font-medium rounded-l-lg peer-focus:bg-[var(--text-color)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>
                                </label>
                            </div>
                            <div class="w-full flex flex-row-reverse justify-center">
                                <input type="email" name="email" id="email-input" placeholder="Email" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-r-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer">
                                <label for="email-input" class="bg-[var(--accent-color)] h-12 w-12 flex justify-center shrink-0 items-center fill-white text-white text-2xl font-medium rounded-l-lg peer-focus:bg-[var(--text-color)]">
                                    <span>@</span>
                                </label>
                            </div>
                            <div class="w-full flex flex-row-reverse justify-center">
                                <input type="password" name="password" id="password-input" placeholder="Password" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-r-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer">
                                <label for="password-input" class="bg-[var(--accent-color)] h-12 w-12 flex justify-center shrink-0 items-center fill-white text-white text-2xl font-medium rounded-l-lg peer-focus:bg-[var(--text-color)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
                                </label>
                            </div>
                            <div class="w-full flex flex-row-reverse justify-center">
                                <input type="password" name="repeatpassword" id="repeat-password-input" placeholder="Repeat Password" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-r-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer">
                                <label for="repeat-password-input" class="bg-[var(--accent-color)] h-12 w-12 flex justify-center shrink-0 items-center fill-white text-white text-2xl font-medium rounded-l-lg peer-focus:bg-[var(--text-color)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
                                </label>
                            </div>
                            <button type="submit" class="bg-[var(--accent-color)] mt-2.5 px-16 py-3.5 text-white border-0 rounded-[1000px] font-semibold text-[length:inherit] uppercase ease-150 cursor-pointer hover:bg-[var(--text-color)] focus:outline-0 focus:bg-[var(--text-color)]">Signup</button>
                        </form>
                        <p>Already have an Account ? <a href="/login" class="text-[var(--accent-color)]">Login</a></p>
                    </div>
                </div>
`
}
