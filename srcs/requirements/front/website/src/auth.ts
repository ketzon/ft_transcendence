import { router } from "./router";
import { printResponse } from "./utils";

export async function isUserAuth():Promise<boolean> {
    try
    {
        const res = await fetch("http://localhost:3000/user/profil", {
            method: "GET",
            headers: {},
            credentials: "include"
        });
        const user = await res.json();

        if (!res.ok)
        {
            console.log("User is NOT LOGGED");
            printResponse("/profil", user);
            return (true);
        }
        console.log("USER IS LOGGED");
        printResponse("/profil", user);
        checkLocalStorage(user);
        initLogoutButton();
        return (true);
    }
    catch(error)
    {
        console.error("Error while Auth fecthing API");
        // localStorage.clear();
        return (false);
    }
}

function checkLocalStorage(user)
{
    if (!localStorage.getItem("email") || !localStorage.getItem("nickname") || !localStorage.getItem("avatar"))
    {
        localStorage.setItem("email", user.email);
        localStorage.setItem("nickname", user.username);
        localStorage.setItem("avatar", user.avatar);
    }
}


export async function initLogoutButton(): Promise<void> {

    let logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
    let selectLanguage = document.getElementById("selector") as HTMLButtonElement;
    selectLanguage.style.display = 'block';//add bouton pour select language

    if (logoutBtn)
        return ;

    //basic boutton logout
    logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.type = "button";
    logoutBtn.className = "w-full flex items-center justify-center p-3 bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-100 transition-all";
    // ajoute font awesome icon
    const logoutIcon = document.createElement("i");
    logoutIcon.className = "fas fa-sign-out-alt mr-2"; 
    const logoutText = document.createElement("span");
    logoutText.className = "i18n"; 
    logoutText.textContent = "LOGOUT"; 
    logoutText.setAttribute('data-original-text', 'LOGOUT'); // pour i18n
    //insere balise dans logout btn
    logoutBtn.appendChild(logoutIcon);
    logoutBtn.appendChild(logoutText);
    const navbarElem = document.getElementById("navbar-box");
    navbarElem?.appendChild(logoutBtn);


    logoutBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        //Ici faire le call a l'API pour vraiment deconnecter et clear les cookies.
        try
        {
            const res = await fetch("http://localhost:3000/user/logout", {
                method: "POST",
                headers: {},
                credentials: "include" // Rajouter pour le vrai call.
            });
            const user = await res.json();

            if (!res.ok)
            {
                printResponse("/logout", user);
                console.error("API Returned with 500 status code, error");
                return ;
            }
            printResponse("/logout", user);
            localStorage.clear(); //Clear all infos from the client that was stored in localStorage.
            navbarElem?.removeChild(logoutBtn);
            window.history.pushState(null, "", "/");
            router();
        }
        catch(error)
        {
            console.error("Logout API call failed");
            return ;
        }
    })
}
