import { router } from "./router";
import { initI18n } from './i18next';

//On vient charger la variable qui est dans le .env
export const API_URL = import.meta.env.VITE_API_URL;

//init i18n apres le chargement du DOM pour recup original data
document.addEventListener('DOMContentLoaded', () => {
  initI18n();
});

function listenAllClicks(): void {
    let body = document.querySelector("body");

    if (!body)
    {
        console.error("Could not find body");
        return;
    }

    body.addEventListener("click", (e) => {
        const target = (e.target as HTMLElement)?.closest("a")

        // console.log("Click event Target = " + target);
        if (target instanceof HTMLAnchorElement)
        {
            const href = target.getAttribute("href");

            e.preventDefault();
            window.history.pushState(null, "", href); //Met a jour la location actuelle grace au href du <a></a>
            router();
        }
    })
}

listenAllClicks();
router();
