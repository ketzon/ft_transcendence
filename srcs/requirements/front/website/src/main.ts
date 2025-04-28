import { router } from "./router.ts";
import { isUserAuth } from "./auth.ts";

// On utilise l'event delegation pour catch tout les events click , meme ceux qui seront injectes plus tard.
function listenAllClicks(): void {
    let body = document.querySelector("body");
    console.log(body);

    if (!body)
    {
        console.error("Could not find body");
        return;
    }

    body.addEventListener("click", (e) => {
        const target = e.target;

        console.log("Click event Target = " + target);
        if (target instanceof HTMLAnchorElement)
        {
            const href = target.getAttribute("href");

            e.preventDefault();
            window.history.pushState(null, "", href); //Met a jour la location actuelle grace au href du <a></a>
            router();
        }
    })
}

isUserAuth();
listenAllClicks();
router();
