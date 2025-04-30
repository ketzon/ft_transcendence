import { router } from "./router";

export type userInfos = {
    nickname: string,
    email: string,
    avatar: string
};


export function getUserData(): userInfos {
    // Call API here.

    let userData: userInfos = {
        nickname: "Ykaercs",
        email: "yka@mail.com",
        avatar: "../images/alien_avatar.png"
    };
    return userData;
}

export async function isUserAuth():Promise<boolean> {
    return false; // tmp
    try
    {
        const res = await fetch("https://reqres.in/api/users", {
            method: "GET",
            headers: {},
            // credentials: "include"
        });

        if (!res.ok)
        {
            console.log("User is NOT LOGGED");
            return (false);
        }
        console.log("User is LOGGED");
        // const user = await res.json();
        initLogoutButton();
        checkStorageInfos();
        return (true);
    }
    catch(error)
    {
        console.error("Error while Auth fecthing API");
        // localStorage.clear();
        return (false);
    }
}

function checkStorageInfos()
{
    let userData: userInfos;
    if (!localStorage.getItem("email") || !localStorage.getItem("nickname") || !localStorage.getItem("avatar"))
    {
        userData = getUserData();
        localStorage.setItem("email", userData.email);
        localStorage.setItem("nickname", userData.nickname);
        localStorage.setItem("avatar", userData.avatar);
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
            const res = await fetch("https://reqres.in/api/users", {
                method: "POST",
                headers: {},
                // credentials: "include" // Rajouter pour le vrai call.
            });

            if (!res.ok)
            {
                console.error("API Returned with 500 status code, error");
                return ;
            }
        }
        catch(error)
        {
            console.error("Logout API call failed");
            return ;
        }

        localStorage.clear(); //Clear all infos from the client that was stored in localStorage.
        navbarElem?.removeChild(logoutBtn);
        window.history.pushState(null, "", "/");
        router();
    })
}
