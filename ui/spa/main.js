const routes = {
    index : "/",
    dashboard : "/dashboard",
    profile : "/profile",
    play : "/play"
}

// On recupere le body pour injecter le contenu dans cette partie.
const body = document.querySelector("body");

// Gestion des boutons forward et backward
window.addEventListener("popstate", () => {
    router();
});

//On ajoute des event listener sur tout les boutons.
function handleLinks() {
    const links = document.querySelectorAll("a");
    console.log(links);

    for (let idx = 0; idx < links.length; idx++)
    {
        links[idx].addEventListener("click", (event) => {
            event.preventDefault();
            window.history.pushState({}, "", event.target.href);
            router ();
        })
    }
}


//On injecte le contenu selon le path sur lequel on se trouve.
async function router() {
    //On injecte dans changingArea pour garder la navbar sur la gauche dans le body.
    const changingArea = document.getElementById("changingArea");
    console.log(changingArea);

    console.log(location.pathname);
    switch (location.pathname) {
        case routes.index:
            body.innerHTML = await (await fetch("./pages/landing.html")).text();
            handleLinks();
            break;

        case routes.dashboard:
            body.innerHTML = await (await fetch("./pages/dashboard.html")).text();
            handleLinks();
            break ;

        case routes.profile:
            changingArea.innerHTML = await (await fetch("./pages/profile.html")).text()
            handleLinks();
            break ;

        case routes.play:
            changingArea.innerHTML = await (await fetch("./pages/play.html")).text()
            handleLinks();
            break ;

        default:
            break ;
    }
}

handleLinks();
router();
