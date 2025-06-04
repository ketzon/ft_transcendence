import friendsService from "../services/friends_service.js";
import userService from "../services/user_services.js";

const addFriend = async (req, reply) => {
    try {
        //le serveur resend du json
        reply.header('Content-Type', 'application/json');
        //tu as un token?
        const token = req.cookies?.token;
        if (!token) {
            return reply.status(401).send(JSON.stringify({error: "Token Authentication missing"}));
        }
        //tu es qui?
        const user = await userService.getUserByToken(req.server, token);
        if (!user || !user.id) {
            return reply.status(401).send(JSON.stringify({error: "Token Authentication doesn't match"}));
        }
        //tu veux ajouter qui ?
        const { username } = req.body;
        if (!username) {
            return reply.status(400).send(JSON.stringify({error: "Username is required"}));
        }
        //ok je vais check dans la db
        await friendsService.addFriend(user.id, username);

        //c'est ok, send response au front 200
        //besoin de resoudre la promesse de res.json(); pour manipuler la reponse
        return reply.status(200).send(JSON.stringify({
            success: true, 
            message: "Friend added successfully"
        }));
    //c'est pas bon, send response au front 500 en json
    //besoin de resoudre la promesse de res.json(); pour manipuler la reponse
    } catch (error) {
        reply.header('Content-Type', 'application/json');
        return reply.status(500).send(JSON.stringify({
            details: error.message
        }));
    }
};

const getFriends = async (req, reply) => {
    try {
        reply.header('Content-Type', 'application/json');
        const token = req.cookies?.token;
        if (!token) {
            return reply.status(401).send(JSON.stringify({error: "Token Authentication missing"}));
        }
        const user = await userService.getUserByToken(req.server, token);
        if (!user || !user.id) {
            return reply.status(401).send(JSON.stringify({error: "Token Authentication doesn't match"}));
        }
        const friends = await friendsService.getFriends(user.id);
        return reply.status(200).send(JSON.stringify({
            friends: friends || []
        }));
    } catch (error) {
        reply.header('Content-Type', 'application/json');
        return reply.status(500).send(JSON.stringify({
            error: "Failed to get friends", 
            details: error.message
        }));
    }
};

const removeFriend = async (req, reply) => {
    try {
        reply.header('Content-Type', 'application/json');
        const token = req.cookies?.token;
        if (!token) {
            return reply.status(401).send(JSON.stringify({error: "Token Authentication missing"}));
        }
        const user = await userService.getUserByToken(req.server, token);
        if (!user || !user.id) {
            return reply.status(401).send(JSON.stringify({error: "Token Authentication doesn't match"}));
        }
        const friendId = parseInt(req.params.id);
        await friendsService.removeFriend(user.id, friendId);
        return reply.status(200).send(JSON.stringify({
            success: true,
            message: "Friend removed successfully"
        }));
    } catch (error) {
        console.error("Error in removeFriend:", error);
        reply.header('Content-Type', 'application/json');
        return reply.status(500).send(JSON.stringify({
            error: "Failed to remove friend", 
            details: error.message
        }));
    }
};

export default {
    addFriend,
    getFriends,
    removeFriend
};
