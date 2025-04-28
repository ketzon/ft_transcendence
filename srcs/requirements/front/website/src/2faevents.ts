import { router } from "./router";

async function getQrCode(): Promise<void> {
    const qrCodeImg = document.getElementById("qr-code-img") as HTMLImageElement;

    if (qrCodeImg)
        {
            console.log("Found QRCODE IMG : ", qrCodeImg);
            //Ici normalement on appelle une route du back qui nous renvoi le qr code genere.
            qrCodeImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
        }

    //Partie a tester avec la route du back.

    // try
    // {
    //     const res = await fetch("/api/2fa/setup", {
    //         method: "POST",
    //         credentials: "include"
    //     });
    //     const data = res.json();

    //     if (qrCodeImg)
    //     {
    //         qrCodeImg.src = data.qrDataUrl; // Recuperer le lien du qrcode.
    //     }
    // }
    // catch (err)
    // {
    //     console.error("Erreur chargement du QR Code");
    // }
}

async function sendCode(form:HTMLFormElement): Promise<void> {
    console.log("2FA FORM | Code will be sent to back");

//     A Tester avec la route du backend
    const code = document.getElementById("code") as HTMLInputElement;
    const errElement = document.getElementById("error-message") as HTMLElement;

    try
    {
        const res = await fetch("https://reqres.in/api/users", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            // credentials: "include", // A rajouter pour la vraie route.
            body: JSON.stringify({ code }),
        });


        if (!res.ok)
        {
            const error = res.json();
            if (errElement)
            {
                // errElement.innerText = error.message; //Vrai message du back.
                errElement.innerText = "Invalid code";
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

    getQrCode(); // Remove si on utilise pas de qr-code
    verifyCode();
}
