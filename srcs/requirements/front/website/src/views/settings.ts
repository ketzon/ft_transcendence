import { toasts } from "../toasts";
import { printResponse, resetInput, isEmptyString } from "../utils";

//Load the users infos on profile card using the localStorage infos when user land on this page.
function loadProfileCard(): void {
    const activeAvatar = document.getElementById("active-avatar") as HTMLImageElement;
    const activeNickname = document.getElementById("active-nickname") as HTMLElement;
    const activeEmail = document.getElementById("active-email") as HTMLElement;
    const newNicknamePlaceholder = document.getElementById("update-nickname-value") as HTMLInputElement;

    if (activeAvatar && activeNickname && activeEmail && newNicknamePlaceholder)
    {
        activeAvatar.src = localStorage.getItem("avatar") as string;
        activeNickname.textContent = localStorage.getItem("nickname") as string;
        activeEmail.textContent = localStorage.getItem("email") as string;
        newNicknamePlaceholder.placeholder = localStorage.getItem("nickname") as string;
    }
}

async function updatePassword(newPassword: string): Promise<void> {
    try
    {
        const res = await fetch("http://localhost:3000/user/modifyPassword", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({newPassword}),
            credentials: "include"
        });
        const resMsg = await res.json();

        if (!res.ok)
        {
            console.log(resMsg);
            toasts.error("Failed to update password");
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

    if (passwordForm)
    {
        passwordForm.addEventListener("submit", (event) => {
            event.preventDefault();

            //isValidPassword() //We can add a front password checking here.
            if (isEmptyString(passwordValue.value))
                toasts.error("Invalid new password");
            else
                updatePassword(passwordValue.value);
            resetInput("update-password-value");
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

//Init the nickname form.
function initNicknameForm(): void {
    const updateNicknameForm = document.getElementById("update-nickname-form") as HTMLElement;
    const nicknameValue = document.getElementById("update-nickname-value") as HTMLInputElement;

    if (updateNicknameForm)
    {
        updateNicknameForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // isValidNickname(nicknameValue.value); //Verification en front que la value est pas null, ou maxlen ect..
            if (isEmptyString(nicknameValue.value))
                toasts.error("Invalid new nickname");
            else
                updateNickname(nicknameValue.value);
            resetInput("update-nickname-value");
        })
    }
}

// async function updateAvatar(formData: FormData): Promise<void> {
//     try
//     {
//         const res = await fetch("https://reqres.in/api/users", {
//             method: "POST",
//             body: formData,
//             // credentials: "include"
//         });
//         if (!res.ok)
//         {
//             toasts.error("Failed to update avatar");
//             window.prompt("Could not update avatar, try later..");
//             loadProfileCard();
//             return ;
//         }
//         //Here we should get the return value of the call to update the localStorage.
//         const avatarInput = document.getElementById("update-avatar") as HTMLInputElement;
//         const newAvatar = URL.createObjectURL(avatarInput.files[0]);
//         const submitBtn = document.getElementById("submit-avatar-btn") as HTMLButtonElement;

//         console.log("Upload Successfull");
//         toasts.success("Updated avatar");
//         localStorage.setItem("avatar", newAvatar);
//         submitBtn.classList.add("hidden");
//         loadProfileCard();
//     }
//     catch(error)
//     {
//         console.error("ERROR REACH UPLOAD AVATAR ENDPOINT");
//     }
// }

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
                formData.append("avatarFile", avatarInput.files[0]);
                console.log(formData.get("avatarFile"));

                //Call API to really upload file in DB. Atm it just use object URL to store it in localStorage.
                // updateAvatar(formData);

                const newAvatar = URL.createObjectURL(avatarInput.files[0]);
                localStorage.setItem("avatar", newAvatar);
                submitBtn.classList.add("hidden");
                toasts.success("Updated avatar");
                loadProfileCard();
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
    loadProfileCard();
    initNicknameForm();
    initPasswordForm();
    initAvatarUpload();
}

export function settingsView(): string {
        return /*html*/`
            <div id="settingsArea" class="h-full w-full flex justify-center items-center">
                <div id="settings-card" class="h-10/12 w-11/12 bg-violet-100 flex flex-col items-center">
                    <h1 class="w-full text-center p-4 text-2xl bg-violet-300">Account Settings</h1>
                    <div class="flex h-full w-full">
                        <div id="profile-card" class="flex flex-col w-2/5 items-center justify-center">
                            <img id="active-avatar" src="" alt="User active avatar" class="cursor-pointer hover:opacity-80 w-50 h-50 my-5 border-2 border-dashed rounded-2xl">
                            <form id="upload-avatar-form" class="flex items-center gap-10">
                                    <div class="w-full flex justify-center">
                                        <input type="file" name="update-avatar" id="update-avatar" accept="image/*" class="hidden bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                        <button id="submit-avatar-btn" type="submit" class="hidden mb-4 hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white text-2xl p-2 px-5 font-medium rounded-l-lg rounded-r-lg peer-focus:bg-[var(--text-color)]">Update</button>
                                    </div>
                            </form>
                            <ul>
                                <li><span id="active-nickname"></span></li>
                                <li><span id="active-email"></span></li>
                            </ul>
                        </div>
                        <div id="update-profile" class="flex flex-col h-full w-3/5 bg-violet-200 items-center justify-evenly">
                            <form id="update-nickname-form" class="flex items-center gap-10">
                                <label for="update-username" class="w-full">Change Nickname</label>
                                <div class="w-full flex justify-center">
                                    <input type="text" name="update-nickname" id="update-nickname-value" placeholder="New Nickname" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                    <button id="update-nickname-btn" type="submit" class="hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white text-2xl p-2 px-5 font-medium rounded-r-lg peer-focus:bg-[var(--text-color)]">Update</button>
                                </div>
                            </form>
                            <form id="update-password-form" class="flex items-center gap-10">
                                <label for="update-password" class="w-full">Change Password</label>
                                <div class="w-full flex justify-center">
                                    <input type="password" name="update-password" id="update-password-value" placeholder="New Password" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-l-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer" required>
                                    <button type="submit" class="hover:opacity-80 cursor-pointer bg-[var(--accent-color)] text-white text-2xl p-2 px-5 font-medium rounded-r-lg peer-focus:bg-[var(--text-color)]">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            <div>
        `
}
