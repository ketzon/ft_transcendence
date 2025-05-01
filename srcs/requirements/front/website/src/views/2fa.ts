import { router } from "../router";

async function sendCode(form:HTMLFormElement): Promise<void> {
    console.log("2FA FORM | Code will be sent to back");

//     A Tester avec la route du backend
    const otp = document.getElementById("code") as HTMLInputElement;
    const errElement = document.getElementById("error-message") as HTMLElement;

    try
    {
        const res = await fetch("http://localhost:3000/user/verify-2FA", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include", // A rajouter pour la vraie route.
            body: JSON.stringify({otp}),
        });
        if (!res.ok)
        {
            const error = await res.json();
            if (errElement)
            {
                // errElement.innerText = error.message; //Vrai message du back.
                console.log(error);
                errElement.innerText = "Invalid code";
                return;
            }
        }
        console.log("2FA Successfull , redirecting to dashboard");

        setTimeout(() => {
            window.history.pushState(null, "" , "/dashboard");
            router();
        }, 1500);
    }
    catch(error)
    {
        console.error("Error fectch 2fa");
    }
}

function isValidInput(form: HTMLFormElement): boolean {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);


    //Ici on peut rajouter d'autre verifications avant d'envoyer le code.
    if (data.code === null || data.code === "")
    {
        console.log("2FA FORM ERROR | input value = ", data.code);
        return (false);
    }
    return (true);

}

function verifyCode(): void {
    const form = document.getElementById("twofa-form") as HTMLFormElement;
    const submitBtn = document.getElementById("submit-2fa") as HTMLButtonElement;

    if (submitBtn)
    {
        submitBtn.addEventListener("click", (event: MouseEvent) => {
            console.log("SUBMIT 2FA CLICKED");

            event.preventDefault();
            if (isValidInput(form) === true )
                sendCode(form);
        })
    }
}

export function init2fa(): void {
    const mailDiv = document.getElementById("user-email") as HTMLElement;

    if (mailDiv)
        mailDiv.innerText = "2FA Code has been sent to : " + "dummy@gmail.com"; // Replace with real email.
    verifyCode();
}

export function twofaView():string {
    return /*html*/ `
        <div id="2fa-area" class="w-full h-full flex flex-col justify-center items-center">
            <div class="flex flex-col justify-center items-center h-1/2 w-1/2 border-2 rounded-4xl">
                <h1>2FA AUTH</h1>
                <img id="qr-code-img" class="w-full max-w-64 h-auto" src="">
                <div id="user-email"></div>
                <div id="error-message"></div>
                <form id="twofa-form" class="flex flex-col gap-2.5 items-center">
                    <label for="code">CODE : </label>
                    <input required type="text" name="code" id="code" maxlength="6" class="w-2/3 border-2 rounded-2xl text-center">
                    <button type="submit" id="submit-2fa" class="w-1/2 border-2 border-purple-500 rounded-2xl">SUBMIT</button>
                </form>
            </div>
        </div>
    `
}
