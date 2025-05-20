import { router } from "../router";
import { toasts } from "../toasts";
import { printResponse, resetAllInputs } from "../utils";

async function sendCode(userEmail: string, code: string): Promise<void> {
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
            resetAllInputs();
            toasts.error("Wrong code");
            return;
        }
        toasts.success("Succesfully logged");
        setTimeout(() => {
            window.history.pushState(null, "" , "/dashboard");
            router();
        }, 1500);
    }
    catch(error)
    {
        toasts.error("Unexpected error");
        console.error("Error fectch 2fa");
    }
}

function getCode(form: HTMLFormElement): string {
    const formData = new FormData(form);
    let code:string = "";

    for (const value of formData.values())
        code += value;
    return (code);
}


function verifyCode(userEmail: string): void {
    const form = document.getElementById("twofa-form") as HTMLFormElement;

    if (form)
    {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const code = getCode(form);
            sendCode(userEmail, code);
        })
    }
}

export function init2fa(userEmail: string): void {
    verifyCode(userEmail);
}

export function twofaView(userEmail: string):string {
    return /*html*/ `
        <div id="2fa-area" class="w-full h-full flex flex-col justify-center items-center">
            <form id="twofa-form" class="flex flex-col items-center justify-center gap-9 rounded-2xl w-[460px] h-[600px] bg-white shadow relative">
               <span class="text-2xl font-bold">Enter OTP</span>
               <p class="text-center text-gray-600">We have sent a verification code to your email address</p>
               <div class="w-full flex gap-2.5 items-center justify-center">
                    <input required maxlength="1" type="text" class="bg-gray-200 w-10 h-10 border-0 rounded-md text-center font-bold outline-0" id="otp-input1" name="otp">
                    <input required maxlength="1" type="text" class="bg-gray-200 w-10 h-10 border-0 rounded-md text-center font-bold outline-0" id="otp-input2" name="otp">
                    <input required maxlength="1" type="text" class="bg-gray-200 w-10 h-10 border-0 rounded-md text-center font-bold outline-0" id="otp-input3" name="otp">
                    <input required maxlength="1" type="text" class="bg-gray-200 w-10 h-10 border-0 rounded-md text-center font-bold outline-0" id="otp-input4" name="otp">
                    <input required maxlength="1" type="text" class="bg-gray-200 w-10 h-10 border-0 rounded-md text-center font-bold outline-0" id="otp-input5" name="otp">
                    <input required maxlength="1" type="text" class="bg-gray-200 w-10 h-10 border-0 rounded-md text-center font-bold outline-0" id="otp-input6" name="otp">
               </div>
               <button class="px-20 py-3 border-0 text-white bg-[var(--accent-color)] font-semibold cursor-pointer rounded-xl hover:bg-[var(--text-color)] transition ease-in" type="submit" id="submit-2fa">Verify</button>
            </form>
        </div>
    `
}
