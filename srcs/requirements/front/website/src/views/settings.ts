import { toasts } from "../toasts";
import { printResponse, resetInput, isEmptyString } from "../utils";
import { handleChecklist, isValidPassword } from "../passwordValidation";
import { updateI18nTranslations } from '../i18next';
import { isUserAuth } from "../auth";
import router from "../router.ts"
import { hideNavbar } from "../utils";
import { API_URL } from "../config";

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
        const res = await fetch(`${API_URL}/user/modifyPassword`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password, newPassword}),
            credentials: "include"
        });
        const resMsg = await res.json();

        if (!res.ok)
        {
            // console.log(resMsg);
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

    if (localStorage.getItem("googleAuth") === "true")
    {
        const passwordBox = document.getElementById("password-box")
        // console.log("passwordBox = ", passwordBox);
        passwordBox?.classList.add("hidden");
        return ;
    }

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
        const res = await fetch (`${API_URL}/user/customUsername`, {
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
            toasts.error(resMsg.message);
            // toasts.error("Failed to update nickname");
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

async function updateEmail(newEmail: string): Promise<void> {
    try {
        const res = await fetch(`${API_URL}/user/customEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ newEmail }),
        });
        const resMsg = await res.json();

        if (!res.ok) {
            printResponse("/customEmail", resMsg);
            toasts.error(resMsg.message);
            return;
        }

        printResponse("/customEmail", resMsg);
        localStorage.setItem("email", newEmail);
        loadProfileCard();
        toasts.success("Email updated");
    } catch (error) {
        console.error("Error with API when trying to update email");
    }
}

function initEmailForm(): void {
    const updateEmailForm = document.getElementById("update-email-form") as HTMLFormElement;
    const emailValue = document.getElementById("update-email-value") as HTMLInputElement;

     if (localStorage.getItem("googleAuth") === "true")
    {
        const emailBox = document.getElementById("update-email-form")
        emailBox?.classList.add("hidden");
        return ;
    }

    if (updateEmailForm) {
        updateEmailForm.addEventListener("submit", (event) => {
            event.preventDefault();
            updateEmail(emailValue.value);
            resetInput("update-email-value");
        });
    }
}



export async function updateLanguage(language: string): Promise<void> {
    // console.log(`mon language selectionne est ${language}`)
    try {
        const res = await fetch(`${API_URL}/user/language`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ language}),
        });
        const resMsg = await res.json();
        // console.log(resMsg);
        if (!res.ok) {
            printResponse("/language", resMsg);
            toasts.error("Failed to update language")
            return;
        }
        printResponse("/language", resMsg);
        localStorage.setItem("preferred_language", language);
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
        const res = await fetch(`${API_URL}/user/customAvatar`, {
            // headers: {'Content-Type': 'multipart/form-data'},
            method: "POST",
            body: formData,
            credentials: "include"
        });
        if (!res.ok)
        {
            const resMsg = await res.json();
            printResponse("/customAvatar", resMsg);
            toasts.error(resMsg.details);
            // toasts.error("Failed to update avatar");
            loadProfileCard();
            return ;
        }
        const resMsg = await res.json();
        printResponse("/customAvatar", resMsg);
        // localStorage.setItem("avatar", API_URL + "/" + resMsg.user.avatar); //avant
        const uploadedAvatarUrl = `${API_URL}/${resMsg.user.avatar}`; // ines : pour récuperer l'avatar
        localStorage.setItem("avatar", uploadedAvatarUrl);

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

async function deleteUser(): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/user/delusr`, {
      method: "POST",
      credentials: "include"
    });
    if (!res.ok) {
      const resMsg = await res.json();
      printResponse("/delusr", resMsg);
      toasts.error("Failed to delete user");
      return ;
    }
    localStorage.clear();
    hideNavbar();
    router.redirectTo("/login")
    const resMsg = await res.json();
    printResponse("/delusr", resMsg);
    toasts.success("User deleted");
  }
  catch(error) {
    console.error("Error deleting user: " + error);
  }
}

function handleDeleteUser(): void {
    const modalBox = document.getElementById("delAcc-box") as HTMLDialogElement;
    const delBtn = document.getElementById("account-delete-btn");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");

    delBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        modalBox?.showModal();
    });

    cancelBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        modalBox?.close();
    })

    confirmBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        deleteUser();
        modalBox?.close();
    });
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
                // console.log(formData.get("newAvatar"));

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
    handleDeleteUser();
    initEmailForm();
}

export function settingsView(): string {
        return /*html*/`
            <div id="settingsArea" class="h-full w-full flex justify-center items-center">
                <div id="settings-card" class="h-10/12 w-11/12 bg-violet-100 flex flex-col items-center rounded-2xl">
                    <h1 class="i18n w-full text-center p-4 text-2xl bg-violet-300 rounded-t-2xl font-semibold">Account Settings</h1>
                    <div class="flex h-full w-full">
                        <div id="profile-card" class="flex flex-col w-2/5 items-center justify-center p-6">
                            <img id="active-avatar" src="" alt="User active avatar" class="cursor-pointer hover:opacity-80 w-50 h-50 my-5 border-2 border-dashed rounded-2xl">
                            <form id="upload-avatar-form" class="flex items-center w-full">
                                <div class="w-full flex justify-center">
                                    <input type="file" name="update-avatar" id="update-avatar" accept="image/*" class="hidden bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                    <button id="submit-avatar-btn" type="submit" class="i18n hidden mb-4 hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white text-lg px-6 py-2 font-medium rounded-lg peer-focus:bg-[var(--text-color)] whitespace-nowrap">Update</button>
                                </div>
                            </form>
                            <ul class="text-center space-y-2 mt-4">
                                <li class="text-lg font-medium"><span id="active-nickname"></span></li>
                                <li class="text-sm text-gray-600"><span id="active-email"></span></li>
                            </ul>
                        </div>
                        <div id="update-profile" class="flex flex-col h-full w-3/5 bg-violet-200 items-center justify-evenly p-6 rounded-r-2xl">
                            <form id="update-nickname-form" class="flex flex-col w-full max-w-md gap-3">
                                <label for="update-username" class="i18n text-center font-medium text-lg">Change Nickname</label>
                                <div class="flex w-full">
                                    <input type="text" name="update-nickname" id="update-nickname-value" placeholder="New Nickname" class="bg-[var(--base-color)] flex-1 h-12 px-4 rounded-l-lg border-2 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                    <button id="update-nickname-btn" type="submit" class="i18n hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white px-6 py-2 font-medium rounded-r-lg peer-focus:bg-[var(--text-color)] whitespace-nowrap">Update</button>
                                </div>
                            </form>

                            <form id="update-email-form" class="flex flex-col w-full max-w-md gap-3">
                                <label for="update-email-value" class="i18n text-center font-medium text-lg">Change Email</label>
                                <div class="flex w-full">
                                    <input type="email" name="update-email" id="update-email-value" placeholder="New Email"
                                        class="bg-[var(--base-color)] flex-1 h-12 px-4 rounded-l-lg border-2 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer"
                                        required>
                                    <button id="update-email-btn" type="submit"
                                        class="i18n hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white px-6 py-2 font-medium rounded-r-lg peer-focus:bg-[var(--text-color)] whitespace-nowrap">
                                        Update
                                    </button>
                                </div>
                            </form>



                            <div id="password-box" class="flex flex-col items-center w-full max-w-md">
                                <p class="i18n text-center font-medium text-lg mb-4">Change Password</p>
                                <form id="update-password-form" class="w-full space-y-3">
                                    <input type="password" name="current-password" id="current-password-value" placeholder="Current Password" class="w-full bg-[var(--base-color)] h-12 px-4 rounded-lg border-2 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0" required>
                                    <div class="flex w-full">
                                        <input type="password" name="update-password" id="update-password-value" placeholder="New Password" class="bg-[var(--base-color)] flex-1 h-12 px-4 rounded-l-lg border-2 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                        <button type="submit" class="i18n hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white px-6 py-2 font-medium rounded-r-lg peer-focus:bg-[var(--text-color)] whitespace-nowrap">Update</button>
                                    </div>
                                </form>
                                <div id="password-checklist" class="hidden mt-4 w-full py-4 px-6 rounded-2xl bg-violet-300">
                                    <h3 class="text-base mb-3 text-violet-500 font-medium">Password should be</h3>
                                    <ul id="checklist" class="space-y-1">
                                        <li id="min-len-item" class="text-white text-sm flex items-center gap-2">
                                            <i class="text-xs fa-solid fa-xmark w-3"></i>
                                            <span>At least 8 character long</span>
                                        </li>
                                        <li id="number-item" class="text-white text-sm flex items-center gap-2">
                                            <i class="text-xs fa-solid fa-xmark w-3"></i>
                                            <span>At least 1 number</span>
                                        </li>
                                        <li id="lowercase-item" class="text-white text-sm flex items-center gap-2">
                                            <i class="text-xs fa-solid fa-xmark w-3"></i>
                                            <span>At least 1 lowercase letter</span>
                                        </li>
                                        <li id="uppercase-item" class="text-white text-sm flex items-center gap-2">
                                            <i class="text-xs fa-solid fa-xmark w-3"></i>
                                            <span>At least 1 uppercase letter</span>
                                        </li>
                                        <li id="special-char-item" class="text-white text-sm flex items-center gap-2">
                                            <i class="text-xs fa-solid fa-xmark w-3"></i>
                                            <span>At least 1 special character</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="w-full flex justify-center">
                                <button id="account-delete-btn" type="submit" class="i18n mb-4 hover:opacity-80 cursor-pointer bg-red-500 text-white text-lg px-6 py-2 font-medium rounded-lg peer-focus:bg-[var(--text-color)] whitespace-nowrap">Delete Account</button>
                            </div>
                            <dialog class="backdrop:bg-gray-500/70 bg-transparent" id="delAcc-box">
                                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div class="sm:flex sm:items-start">
                                                <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                                    <svg class="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                                    </svg>
                                                </div>
                                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <h3 class="text-base font-semibold text-gray-900" id="dialog-title">Delete account</h3>
                                                     <div class="mt-2">
                                                        <p class="text-sm text-gray-500">Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button id="confirmBtn" type="button" class="cursor-pointer inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-400 sm:ml-3 sm:w-auto">Delete</button>
                                            <button id="cancelBtn"type="button" class="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                        </div>
                                    </div>
                            </dialog>
                        </div>
                    </div>
                </div>
            </div>
        `
}
