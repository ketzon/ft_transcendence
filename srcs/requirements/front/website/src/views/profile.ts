import { getUserData, userInfos } from "../auth";


function initAvatarBtns(): void {
    const   avatars = document.querySelectorAll("#avatar-selection img");
    let     newAvatar: string;

    for (let i = 0; i < avatars.length; i++)
    {
        avatars[i].addEventListener("click", (event) => {
            event.preventDefault();
            newAvatar = avatars[i].getAttribute("src") as string;
            updateAvatar(newAvatar);
        })
    }
}

function initUploadAvatar(): void
{
    const uploadAvatarBtn = document.getElementById("upload-avatar") as HTMLInputElement;
    let   newAvatar: string;

    if (uploadAvatarBtn)
        uploadAvatarBtn.onchange = function () {
           if (uploadAvatarBtn.files)
            newAvatar  = URL.createObjectURL(uploadAvatarBtn.files[0]);
            updateAvatar(newAvatar);
    }
}

function updateNickname(nickname: string) {
    const nicknameElem = document.getElementById("nickname-value");

    // Call API for real update in DB.
    if (nicknameElem)
        nicknameElem.textContent = nickname;
}

function updateEmail(email: string) {
    const emailElem = document.getElementById("email-value");

    // Call API for real update in DB.
    if (emailElem)
        emailElem.textContent = email;
}

function updateAvatar(avatar: string) {
    const activeAvatar = document.getElementById("active-avatar") as HTMLImageElement;

    // Call API for real update in DB.
    if (activeAvatar)
    {
        activeAvatar.src = avatar;
        localStorage.setItem("avatar", avatar);
    }
}

function loadUserInfos() {
    const activeAvatar = document.getElementById("active-avatar") as HTMLImageElement;
    const emailElem = document.getElementById("email-value");
    const nicknameElem = document.getElementById("nickname-value");

    if (activeAvatar)
        activeAvatar.src = localStorage.getItem("avatar") as string;
    if (emailElem)
        emailElem.textContent = localStorage.getItem("email");
    if (nicknameElem)
        nicknameElem.textContent = localStorage.getItem("nickname");
}



export function initProfile(): void {
    // loadUserInfos();
    // initAvatarBtns();
    // initUploadAvatar();
}


// VIEW //

export function profileView(): string {
    return /*html*/`
    <div id="profile-content" class="gap-3 h-full flex flex-col justify-center items-center">
        <div class="profile-infos w-3/4 flex justify-evenly items-center bg-white rounded-3xl">
            <div class="flex flex-col items-center">
                <img id="active-avatar" src="" alt="User active avatar" class="w-50 h-50 my-5 border-2 border-dashed rounded-2xl">
                <label class="cursor-copy border-2 rounded-2xl mb-5 p-2.5" for="upload-avatar">Upload avatar</label>
                <input class="hidden" id="upload-avatar" type="file" name="upload-avatar" accept="image/*"/>
            </div>
            <ul>
                <li>Nickname : <span id="nickname-value"></span> </li>
                <li>Email : <span id="email-value"></span></li>
            </ul>
        </div>
        <div id="avatar-selection" class="profile-subpart w-3/4 h-2/4 gap-3 flex justify-center ">
            <div class="avatar-selection w-full flex flex-wrap gap-10 justify-center items-center bg-white rounded-3xl">
                <img id="man-avatar" class="w-30 h-30 border-2 cursor-pointer rounded-3xl hover:opacity-60" src="images/default_avatar.png" alt="Default user avatar">
                <img id="woman-avatar" class="w-30 h-30 border-2 cursor-pointer rounded-3xl hover:opacity-60" src="images/woman_avatar.png" alt="Woman user avatar">
                <img id="alien-avatar" class="w-30 h-30 border-2 cursor-pointer rounded-3xl hover:opacity-60" src="images/alien_avatar.png" alt="Alien user avatar">
                <img id="detective-avatar" class="w-30 h-30 border-2 cursor-pointer rounded-3xl hover:opacity-60" src="images/detective_avatar.png" alt="Detective user avatar">
            </div>
            <div class="avatar-selection w-full flex justify-center text-center items-center bg-white rounded-3xl">
                <p>Activate 2FA Option ?</p>
            </div>
        </div>
    </div>
    `
}
