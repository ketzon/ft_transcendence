import { dashboardView } from "./views/dashboard.ts";
import { initializeDashboard } from "./dashboardEvents.ts";
import { tournamentsView } from "./views/tournaments.ts";
import { initializeTournaments } from "./tournamentsEvents.ts";

import { initGame, stopGame, setGameMode } from "./ponggame.ts";
import { pongView } from "./views/pong.ts";
import { selectView } from "./views/select.ts";
import { execSelect} from "./selectgames.ts";


import { isUserAuth } from "./auth.ts";
import { initSettings, settingsView } from "./views/settings.ts";
import { signupView, signupEvents } from "./views/signup.ts";
import { loginView, loginEvents } from "./views/login.ts";
import { twofaView, init2fa } from "./views/2fa.ts";

import { combatView } from "./views/combat";
import { initVersusFight } from "./versus/initGame";
import { stopVersusGame } from "./versus/cleanUp.js";

import { gameSettingsView, initGameSettings } from "./test.js";


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
    pongSettings: "/pongSettings"
}

// Gestion des boutons forward et backward
window.addEventListener("popstate", () => {
    router();
});

function redirectTo(view: string) {
    window.history.pushState(null, "", view);
    router();
}
export let changingArea:HTMLElement;
//On injecte le contenu selon le path sur lequel on se trouve.
export async function router(): Promise<void> {
    //On injecte dans changingArea pour garder la navbar sur la gauche dans le body.
    changingArea = document.getElementById("changingArea");
    const isAuth: boolean = await isUserAuth()// Test if user is logged to protect access to views (just testing).

    if (!changingArea)
    {
        console.log("Could not find changingArea");
        return;
    }

    console.log("Current path = " + location.pathname);
    switch (location.pathname) {

        case routes.pongSettings:
            changingArea.innerHTML = gameSettingsView();
            initGameSettings();
            break ;
        case routes.versus:
            stopVersusGame();
            changingArea.innerHTML = combatView();
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
            stopPong();
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
            // changingArea.innerHTML = pongView();
            changingArea.innerHTML = selectView();
            execSelect();
            // setGameMode(true);
            // initGame();
            break ;

        case routes.twofa:
            changingArea.innerHTML = twofaView();
            init2fa();
            break ;

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
