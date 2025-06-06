import { toasts } from "../toasts";

export function friendsView(): string {
    return `
    <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-purple-400">friends</h2>

    <div class="mb-6">
    <h3 class="text-lg font-semibold mb-3 text-purple-400">add friend</h3>
    <div class="flex gap-2">
    <input id="friend-input" placeholder="enter username..." class="flex-1 p-2 border border-purple-400 rounded-lg">
    <button onclick="addFriend()" class="px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-200">add</button>
    </div>
    </div>

    <div>
    <h3 class="text-lg font-semibold mb-3 text-purple-400">my friends</h3>
    <div id="friends-list" class="space-y-2">
    <p class="text-gray-500">loading friends...</p>
    </div>
    </div>
    </div>
    `;
}

async function addFriend(): Promise<void> {
    const input = document.getElementById('friend-input') as HTMLInputElement;
    const username = input.value.trim();

    if (!username) {
        toasts.error("Empty username");
        return;
    }
    try {
        const res = await fetch('http://back:3000/user/friends/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username})
        });
        const data = await res.json();
        if (!res.ok) {
            if(data.details) {
                toasts.error(`${data.details}`);
                return;
            }
        }
        if (data.success) {
            toasts.success(`${data.message}`);
            loadFriends();
            input.value = '';
        }
        //trigger uniquement si un probleme pour connecter le serveur ou pas de reply en json
    } catch (error) {
        toasts.error("Internal Server Error");
    }
}

async function loadFriends(): Promise<void> {
    try {
        const res = await fetch('http://back:3000/user/friends/list', {
            credentials: 'include'
        });
        // si reply 401,500
        if (!res.ok) {
            const text = await res.text();
            console.error("Response text:", text);
            const list = document.getElementById('friends-list');
            if (list) {
                list.innerHTML = '<p class="text-red-500">Failed to load friends. Check console for details.</p>';
            }
            return;
        }
        const responseText = await res.text();
        let data;
        try {
            data = JSON.parse(responseText);
        //probleme sur le parsing
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Response was:", responseText);
            const list = document.getElementById('friends-list');
            if (list) {
                list.innerHTML = '<p class="text-red-500">Server returned invalid JSON. Check console.</p>';
            }
            return;
        }
        if (data.friends) { //si je recup bien ma liste
            displayFriends(data.friends);
        } else {
            console.error("No friends array in response:", data);
            const list = document.getElementById('friends-list');
            if (list) {
                list.innerHTML = '<p class="text-yellow-500">Unexpected response format.</p>';
            }
        }
        //si probleme serveur URL, connexion ou server down
    } catch (error) {
        console.error("Network error loading friends:", error);
        const list = document.getElementById('friends-list');
        if (list) {
            list.innerHTML = '<p class="text-red-500">Network error loading friends.</p>';
        }
    }
}

function displayFriends(friends: any[]): void {
    const list = document.getElementById('friends-list');
    if (!list) return;

    if (friends.length === 0) {
        list.innerHTML = '<p class="text-gray-500 italic">No friends yet. Add some friends above!</p>';
        return;
    }
    list.innerHTML = friends.map(friend => {
        const isOnline = new Date().getTime() - new Date(friend.lastActive).getTime() < 20000;
        const statusColor = isOnline ? '🟢' : '🔴'; 

        return `
        <div class="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
        <div class="flex items-center">
            <span class="font-medium">${friend.username}</span>
        <span class="ml-2">${statusColor}</span>
        </div>
        <button onclick="removeFriend(${friend.id})" class="px-3 py-1 bg-purple-400 text-white rounded hover:bg-purple-700 text-sm">
        remove
        </button>
        </div>
        `;
    }).join('');
}

async function removeFriend(id: number): Promise<void> {
    try {
        const res = await fetch(`http://back:3000/user/friends/remove/${id}`, {
            method: 'DELETE', 
        credentials: 'include'
        });
        if (res.ok) {
            toasts.success("Friend removed!");
            loadFriends();
        } else {
            const data = await res.json();
            toasts.error(data.error || "Failed to remove friend");
        }
    } catch (error) {
        console.error("Error removing friend:", error);
        toasts.error("Failed to remove friend");
    }
}

export function initFriends(): void {
    loadFriends();
}

(window as any).addFriend = addFriend;
(window as any).removeFriend = removeFriend;

