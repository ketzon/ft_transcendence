import { signupEvents } from "./signupevents.ts";
import { dashboardView } from "./views/dashboard.ts";
import { tournamentsView } from "./views/tournaments.ts";
import { pongView } from "./views/pong.ts";
import { playView } from "./views/play.ts";
import { initProfile, profileView } from "./views/profile.ts";
import { signupView } from "./views/signup.ts";
import { loginView } from "./views/login.ts";
import { loginEvents } from "./loginevents.ts";
import { initializeDashboard } from "./dashboardEvents.ts";
import { initializeTournaments } from "./tournamentsEvents.ts";
import { initPong, stopGame, stopPong } from "./ponggame.ts";
import { twofaView } from "./views/2fa.ts";
import { init2fa } from "./2faevents.ts";
import { isUserAuth } from "./auth.ts";
import { initSettings, settingsView } from "./views/settings.ts";

const routes = {
    indexhtml : "/index.html/",
    index : "/",
    dashboard : "/dashboard",
    tournaments : "/tournaments",
    play : "/play",
    login : "/login",
    signup : "/signup",
    twofa: "/twofa",
    settings: "/settings"
}

// Gestion des boutons forward et backward
window.addEventListener("popstate", () => {
    router();
});

function redirectTo(view: string) {
    window.history.pushState(null, "", view);
    router();
}

//On injecte le contenu selon le path sur lequel on se trouve.
export async function router(): Promise<void> {
    //On injecte dans changingArea pour garder la navbar sur la gauche dans le body.
    const changingArea = document.getElementById("changingArea");
    const isAuth: boolean = await isUserAuth()// Test if user is logged to protect access to views (just testing).

    if (!changingArea)
    {
        console.log("Could not find changingArea");
        return;
    }

    console.log("Current path = " + location.pathname);
    switch (location.pathname) {

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
            stopPong();//reset pong
            break ;

        case routes.tournaments:
            changingArea.innerHTML = tournamentsView();
            initializeTournaments();
            break ;

        case routes.play:
            if (isAuth === false)
            {
                redirectTo("/");
                return;
            }

            changingArea.innerHTML = pongView();
            initPong();
            break ;

        case routes.twofa:
            changingArea.innerHTML = twofaView();
            init2fa();
            break ;

        case routes.settings:
            changingArea.innerHTML = settingsView();
            initSettings();
            break;
        default:
            break ;
    }
}
