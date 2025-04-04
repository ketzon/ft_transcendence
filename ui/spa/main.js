const routes = {
    dashboard : "/dashboard",
    profile : "/profile"
}

const body = document.querySelector("body");

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

async function router() {
    const changingArea = document.getElementById("changingArea");
    console.log(changingArea);

    console.log(location.pathname);
    switch (location.pathname) {
        case routes.dashboard:
            body.innerHTML = await (await fetch("./pages/dashboard.html")).text();
            handleLinks();
            break ;

        case routes.profile:
            changingArea.innerHTML = await (await fetch("./pages/profile.html")).text()
            handleLinks();
            break ;

        default:
            break ;
    }
}

handleLinks();
