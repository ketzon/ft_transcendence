import { toasts } from "../toasts";
import { printResponse, resetInput, isEmptyString } from "../utils";
import { handleChecklist, isValidPassword } from "../passwordValidation";
import { updateI18nTranslations } from '../i18next';
import { isUserAuth } from "../auth";


//Load the users infos on profile card using the localStorage infos when user land on this page.
function loadProfileCard(): void {
    const activeAvatar = document.getElementById("active-avatar") as HTMLImageElement;
    const activeNickname = document.getElementById("active-nickname") as HTMLElement;
    const activeEmail = document.getElementById("active-email") as HTMLElement;
    const newNicknamePlaceholder = document.getElementById("update-nickname-value") as HTMLInputElement;

    if (activeAvatar && activeNickname && activeEmail && newNicknamePlaceholder)
    {
        //Since the image URL stay the same, the browser wont refresh and use the image in cache
        // so we use this to act like a force resfresh.
        const avatarUrl = localStorage.getItem("avatar") + `?ts=${Date.now()}`

        activeAvatar.src = avatarUrl as string;
        activeNickname.textContent = localStorage.getItem("nickname") as string;
        activeEmail.textContent = localStorage.getItem("email") as string;
        newNicknamePlaceholder.placeholder = localStorage.getItem("nickname") as string;
    }
}

async function updatePassword(newPassword: string): Promise<void> {
    const   currentPassword = document.getElementById("current-password-value") as HTMLInputElement;
    const   password = currentPassword.value;

    try
    {
        const res = await fetch("http://localhost:3000/user/modifyPassword", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password, newPassword}),
            credentials: "include"
        });
        const resMsg = await res.json();

        if (!res.ok)
        {
            console.log(resMsg);
            toasts.error(resMsg.details);
            return;
        }
        printResponse("/modifyPassword", resMsg);
        toasts.success("Password updated");
    }
    catch(error)
    {
        toasts.error("Failed to update password");
    }
}

//Init the password form
function initPasswordForm(): void {
    const passwordForm = document.getElementById("update-password-form") as HTMLFormElement;
    const passwordValue = document.getElementById("update-password-value") as HTMLInputElement;

    handleChecklist();
    if (passwordForm)
    {
        passwordForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!isValidPassword(passwordValue.value))
                toasts.error("New password does not meet requirements");
            else
                updatePassword(passwordValue.value);
            resetInput("update-password-value");
            resetInput("current-password-value");
        })
    }
}

//Call the API for nickname Update
async function updateNickname(newUsername: string): Promise<void> {
    try
    {
        const res = await fetch ("http://localhost:3000/user/customUsername", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include", // Permet de recevoir le cookie d'auth, sera utilise systematiquement dans chaque request apres.
            body: JSON.stringify({newUsername}),
        });
        const resMsg = await res.json();

        if (!res.ok)
        {
            printResponse("/customUsername", resMsg);
            toasts.error("Failed to update nickname");
            return ;
        }
        printResponse("/customUsername", resMsg);
        localStorage.setItem("nickname", newUsername);
        loadProfileCard(); // We use this to refresh values on the view.
        toasts.success("Nickname updated");
    }
    catch(error)
    {
        console.error("Error with API when trying to update nickname");
    }
}

export async function updateLanguage(newLanguage: string): Promise<void> {
    console.log(`mon language selectionne est ${newLanguage}`)
    try {
        const res = await fetch("http://localhost:3000/user/language", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include", 
            body: JSON.stringify({ newLanguage}),
        });
        const resMsg = await res.json();
        console.log(resMsg);
        if (!res.ok) {
            printResponse("/language", resMsg); 
            toasts.error("Failed to update language")
            return;
        }
        printResponse("/language", resMsg);
        localStorage.setItem("preferred_language", newLanguage);
        toasts.success("Language preference updated");
    }
    catch(error) {
        console.error("Error with API when trying to update language");
    }
}

//Function to check that the new nickname respect our conditions. We can add new rules here.
function isValidNickname(newNickname: string): boolean {
    if (isEmptyString(newNickname))
    {
        toasts.error("Invalid new nickname (empty)");
        return (false);
    }
    return (true);
}

//Init the nickname form.
function initNicknameForm(): void {
    const updateNicknameForm = document.getElementById("update-nickname-form") as HTMLElement;
    const nicknameValue = document.getElementById("update-nickname-value") as HTMLInputElement;

    if (updateNicknameForm)
    {
        updateNicknameForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (isValidNickname(nicknameValue.value))
                updateNickname(nicknameValue.value);
            resetInput("update-nickname-value");
        })
    }
}

async function updateAvatar(formData: FormData): Promise<void> {
    try
    {
        const res = await fetch("http://localhost:3000/user/customAvatar", {
            // headers: {'Content-Type': 'multipart/form-data'},
            method: "POST",
            body: formData,
            credentials: "include"
        });
        if (!res.ok)
        {
            const resMsg = await res.json();
            printResponse("/customAvatar", resMsg);

            toasts.error("Failed to update avatar");
            loadProfileCard();
            return ;
        }
        const resMsg = await res.json();
        printResponse("/customAvatar", resMsg);
        localStorage.setItem("avatar", "http://localhost:3000/" + resMsg.user.avatar);

        const submitBtn = document.getElementById("submit-avatar-btn") as HTMLButtonElement;
        submitBtn.classList.add("hidden");

        toasts.success("Updated avatar");
        loadProfileCard();
    }
    catch(error)
    {
        console.error("ERROR REACH UPLOAD AVATAR ENDPOINT");
    }
}

//Function that will listen to the submit button and call API to update in DB(need to edit this when we connect backend).
function handleSubmitAvatar(): void {
    const avatarUploadForm = document.getElementById("upload-avatar-form");
    const avatarInput = document.getElementById("update-avatar") as HTMLInputElement;
    const submitBtn = document.getElementById("submit-avatar-btn") as HTMLButtonElement;

    if (avatarUploadForm)
    {
        avatarUploadForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData();

            if (avatarInput && avatarInput.files)
            {
                formData.append("newAvatar", avatarInput.files[0]);
                console.log(formData.get("newAvatar"));

                //Call API to really upload file in DB. Atm it just use object URL to store it in localStorage.
                updateAvatar(formData);
            }
        })
    }
}

//Init the avatar upload form, load a preview of the img and enable the submit button on input changes.
function initAvatarUpload(): void {
    const activeAvatar = document.getElementById("active-avatar") as HTMLImageElement;
    const uploadInput = document.getElementById("update-avatar") as HTMLInputElement;
    const submitBtn = document.getElementById("submit-avatar-btn") as HTMLButtonElement;

    // The active-avatar img will trigger the input file.
    if (activeAvatar)
    {
        activeAvatar.addEventListener("click", (event) => {
            event.preventDefault();
            uploadInput?.click();
        })
    }
    // Preview the new avatar in the active-avatar element.
    if (uploadInput)
    {
        uploadInput.onchange = function () {
            if (uploadInput.files)
            {
                const avatarPreview = URL.createObjectURL(uploadInput?.files[0]);
                activeAvatar.src = avatarPreview;
                submitBtn.classList.remove("hidden"); // Submit btn will now show up.
            }
        }
    }
    handleSubmitAvatar();
}

//Init the whole page , user infos and update forms.
export function initSettings(): void {

    updateI18nTranslations(); //traduction automatique
    loadProfileCard();
    initNicknameForm();
    initPasswordForm();
    initAvatarUpload();
}

export function settingsView(): string {
        return /*html*/`
            <div id="settingsArea" class="h-full w-full flex justify-center items-center">
                <div id="settings-card" class="h-10/12 w-11/12 bg-violet-100 flex flex-col items-center">
                    <h1 class="i18n w-full text-center p-4 text-2xl bg-violet-300">Account Settings</h1>
                    <div class="flex h-full w-full">
                        <div id="profile-card" class="flex flex-col w-2/5 items-center justify-center">
                            <img id="active-avatar" src="" alt="User active avatar" class="cursor-pointer hover:opacity-80 w-50 h-50 my-5 border-2 border-dashed rounded-2xl">
                            <form id="upload-avatar-form" class="flex items-center gap-10">
                                    <div class="w-full flex justify-center">
                                        <input type="file" name="update-avatar" id="update-avatar" accept="image/*" class="hidden bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                        <button id="submit-avatar-btn" type="submit" class="i18n hidden mb-4 hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white text-2xl p-2 px-5 font-medium rounded-l-lg rounded-r-lg peer-focus:bg-[var(--text-color)]">Update</button>
                                    </div>
                            </form>
                            <ul>
                                <li><span id="active-nickname"></span></li>
                                <li><span id="active-email"></span></li>
                            </ul>
                        </div>
                        <div id="update-profile" class="flex flex-col h-full w-3/5 bg-violet-200 items-center justify-evenly">
                            <form id="update-nickname-form" class="flex items-center gap-10">
                                <label for="update-username" class="i18n w-full">Change Nickname</label>
                                <div class="w-full flex justify-center">
                                    <input type="text" name="update-nickname" id="update-nickname-value" placeholder="New Nickname" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                    <button id="update-nickname-btn" type="submit" class="i18n hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white text-2xl p-2 px-5 font-medium rounded-r-lg peer-focus:bg-[var(--text-color)]">Update</button>
                                </div>
                            </form>
                            <div id="password-box" class="relative flex flex-col items-center">
                                <p class="i18n w-fit m-auto mb-8">Change Password</p>
                                <form id="update-password-form">
                                    <input type="password" name="current-password" id="current-password-value" placeholder="Current Password" class="mr-30 bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                    <div class="w-full flex justify-center mt-1">
                                        <input type="password" name="update-password" id="update-password-value" placeholder="New Password" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                        <button type="submit" class="i18n hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white text-2xl p-2 px-5 font-medium rounded-r-lg peer-focus:bg-[var(--text-color)]">Update</button>
                                    </div>
                                </form>
                                <div id="password-checklist" class="hidden my-4 w-fit m-auto py-5 px-7 rounded-2xl bg-violet-300">
                                    <h3 class="text-[16px] mb-2.5 text-violet-500">Password should be</h3>
                                    <ul id="checklist">
                                        <li id="min-len-item" class="text-white text-[14px]">
                                            <i class="text-[12px] fa-solid fa-xmark"></i>
                                            At least 8 character long
                                        </li>
                                        <li id="number-item" class="text-white text-[14px]">
                                            <i class="text-[12px] fa-solid fa-xmark"></i>
                                            At least 1 number
                                        </li>
                                        <li id="lowercase-item" class="text-white text-[14px]">
                                            <i class="text-[12px] fa-solid fa-xmark"></i>
                                            At least 1 lowercase letter
                                        </li>
                                        <li id="uppercase-item" class="text-white text-[14px]">
                                            <i class="text-[12px] fa-solid fa-xmark"></i>
                                            At least 1 uppercase letter
                                        </li>
                                        <li id="special-char-item" class="text-white text-[14px]">
                                            <i class="text-[12px] fa-solid fa-xmark"></i>
                                            At least 1 special character
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div>
        `
}
