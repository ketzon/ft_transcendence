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
            return (false);
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

    if (logoutBtn)
        return ;

    logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.type = "button";
    logoutBtn.className = "border-black border text-center p-7 cursor-pointer";
    logoutBtn.innerText = "LOGOUT";

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
