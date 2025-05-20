import { router } from "../router";
import { printResponse } from "../utils";

async function sendCode(userEmail: string): Promise<void> {
    const errElement = document.getElementById("error-message") as HTMLElement;
    const otp = document.getElementById("code") as HTMLInputElement;
    const code = otp.value;
    try
    {
        const res = await fetch("http://localhost:3000/user/verify-2FA", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({code, email: userEmail}),
        });
        const resMsg = await res.json();
        printResponse("/verify-2FA", resMsg);
        if (!res.ok)
        {
            if (errElement)
            {
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

function verifyCode(userEmail: string): void {
    const form = document.getElementById("twofa-form") as HTMLFormElement;
    const submitBtn = document.getElementById("submit-2fa") as HTMLButtonElement;

    if (submitBtn)
    {
        submitBtn.addEventListener("click", (event: MouseEvent) => {
            event.preventDefault();
            if (isValidInput(form) === true )
                sendCode(userEmail);
        })
    }
}

export function init2fa(userEmail: string): void {
    verifyCode(userEmail);
}

export function twofaView(userEmail: string):string {
    return /*html*/ `
        <div id="2fa-area" class="w-full h-full flex flex-col justify-center items-center">
            <div class="flex flex-col justify-center items-center h-1/2 w-1/2 border-2 rounded-4xl">
                <h1>2FA AUTH</h1>
                <img id="qr-code-img" class="w-full max-w-64 h-auto" src="">
                <div id="user-email">Code has been sent to : ${userEmail}</div>
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
