import { router } from "./router";
import { updateI18nTranslations, initI18n } from './i18next';

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
