import { dashboardView } from "./views/dashboard";
import { initializeDashboard } from "./dashboardEvents";
import { tournamentsView } from "./views/tournaments";
import { initializeTournaments } from "./tournamentsEvents";

import { initGame, stopGame, setGameMode } from "./ponggame";
import { pongView } from "./views/pong";
import { selectView } from "./views/select";
import { execSelect} from "./selectgames";

import { initLogoutButton, isUserAuth } from "./auth";
import { initSettings, settingsView } from "./views/settings";
import { signupView, signupEvents } from "./views/signup";
import { loginView, loginEvents } from "./views/login";
import { twofaView, init2fa } from "./views/2fa";

import { combatView } from "./views/combat";
import { initVersusFight } from "./versus/initGame";
import { stopVersusGame } from "./versus/cleanUp.js";

import { gameSettingsView, initGameSettings } from "./pongCustomization.js";
import { friendsView, initFriends } from "./views/friends";

const routes = {
    indexhtml : "/index.html/",
    index : "/",
    dashboard : "/dashboard",
    tournaments : "/tournaments",
    play : "/play",
    versus: "/versus",
    login : "/login",
    signup : "/signup",
    twofa: "/twofa",
    settings: "/settings",
    pongSettings: "/pongSettings",
    friends: "/friends"  
}

// Gestion des boutons forward et backward
window.addEventListener("popstate", () => {
    router();
});

function redirectTo(view: string) {
    window.history.pushState(null, "", view);
    router();
}

export let changingArea: HTMLElement | null;

//On injecte le contenu selon le path sur lequel on se trouve.
export async function router(): Promise<void> {
    //On injecte dans changingArea pour garder la navbar sur la gauche dans le body.
    changingArea = document.getElementById("changingArea");
    const isAuth: boolean = await isUserAuth()// Test if user is logged to protect access to views (just testing).

    if(isAuth) {
        initLogoutButton();
        //pour recuperer signal apres l'auth
        initFriends();
        //pour envoyer signal
        setInterval(async () => {
            try {
                await fetch("http://localhost:3000/user/profil", {credentials: "include"});
            } catch (error) {
                console.log("heartbeat failed");
            }
        }, 20000); 
    }
    if (!changingArea)
    {
        console.log("Could not find changingArea");
        return;
    }

    console.log("Current path = " + location.pathname);
    switch (location.pathname) {

        case routes.versus:
            stopVersusGame();
            changingArea.innerHTML = combatView();
            stopGame();
            initVersusFight();
            break ;

        case routes.indexhtml:
            redirectTo("/");
            return;

        case routes.index:
            if (isAuth === true)
            {
                redirectTo("/dashboard");
                return;
            }
            changingArea.innerHTML = loginView();
            loginEvents();
            break;

        case routes.login:
            if (isAuth === true)
            {
                redirectTo("/dashboard");
                return;
            }
            changingArea.innerHTML = loginView();
            loginEvents();
            break;

        case routes.signup:
            if (isAuth === true)
            {
                redirectTo("/dashboard");
                return;
            }
            changingArea.innerHTML = signupView();
            signupEvents();
            break;

        case routes.dashboard:
            if (isAuth === false)
            {
                redirectTo("/");
                return;
            }
            changingArea.innerHTML = dashboardView();
            initializeDashboard();
            stopGame();//reset pong
            break ;

        case routes.tournaments:
            changingArea.innerHTML = tournamentsView();
            initializeTournaments();
            stopGame();
            break ;

        case routes.play:
            if (isAuth === false)
            {
                redirectTo("/");
                return;
            }
            changingArea.innerHTML = gameSettingsView();
            initGameSettings();
            break ;

        case routes.friends:
            if (isAuth === false) {
                redirectTo("/");
                return;
            }
            changingArea.innerHTML = friendsView();
            initFriends();
            stopGame(); 
            break;

        case routes.settings:
            if (isAuth === false)
            {
                redirectTo("/");
                return;
            }
            changingArea.innerHTML = settingsView();
            initSettings();
            stopGame();
            break;

        default:
            break ;
    }
}

export default {
  redirectTo,
}
