let passwordRules = [
    {
        regex: /.{8,}/,   // min 8 letters
        itemId : "min-len-item"
    },
    {
        regex: /[0-9]/, // at least 1 number
        itemId: "number-item"
    },
    {
        regex: /[a-z]/, // at least one lowercase
        itemId: "lowercase-item"
    },
    {
        regex: /[A-Z]/,
        itemId: "uppercase-item"
    },
    {
        regex: /(?=.*[@$!%*?&])/,
        itemId: "special-char-item"
    }
]

function setChecked(itemId: string): void {
    const listItemElem = document.getElementById(itemId);

    if (listItemElem)
    {
        listItemElem.classList.add("opacity-50");
        listItemElem.firstElementChild.className = "fa-solid fa-check";
    }
}

function setUnchecked(itemId: string):void {
    const listItemElem = document.getElementById(itemId);
    if (listItemElem)
        {
            listItemElem.classList.remove("opacity-50");
            listItemElem.firstElementChild.className = "fa-solid fa-xmark";
        }
}

function initChecklistPopup():void {
    const inputElem = document.getElementById("update-password-value") as HTMLInputElement;
    const checklistPopup = document.getElementById("password-checklist");

    if (!inputElem || !checklistPopup)
        return ;

    inputElem?.addEventListener("focusin", () => {
        checklistPopup?.classList.remove("hidden");
    })

    inputElem?.addEventListener("focusout", () => {
            checklistPopup?.classList.add("hidden");
    })
}

function testPassword(): void {
    const passwordValue = document.getElementById("update-password-value") as HTMLInputElement;

    passwordValue?.addEventListener("keyup", () => {
        for (let idx = 0; idx < passwordRules.length; idx++)
            {
                let isValid: boolean = passwordRules[idx].regex.test(passwordValue.value);

                if (isValid)
                    setChecked(passwordRules[idx].itemId);
                else
                    setUnchecked(passwordRules[idx].itemId);
            }
    })
}

export function handleChecklist(): void {
    initChecklistPopup();
    testPassword();
}

export function isValidPassword(password: string): boolean {
    for (let idx = 0; idx < passwordRules.length; idx++)
        {
            let isValid: boolean = passwordRules[idx].regex.test(password);

            if (!isValid)
                return (false);
        }
    return (true);
}
