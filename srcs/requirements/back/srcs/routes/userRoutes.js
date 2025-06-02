import userManagement from "../controllers/users_controller.js"
import friendsController from "../controllers/friends_controller.js";

export default async function registerUserRoute(fastify) {
    fastify.post("/signup", userManagement.signup);
    fastify.post("/signin", userManagement.signin);
    fastify.post("/logout", userManagement.logout);
    fastify.post("/delusr", userManagement.deleteUser);
    fastify.post("/customUsername", userManagement.customUsername);
    fastify.post("/customAvatar", userManagement.customAvatar);
    fastify.post("/modifyPassword", userManagement.modifyPassword);
    fastify.post("/verify-2FA", userManagement.verify2FA);
    fastify.get("/profil", userManagement.displayCurrentUser);
    fastify.post("/language", userManagement.updateLanguage);
    fastify.post("/resendOtpCode", userManagement.resendOtpCode);
    fastify.post("/friends/add", friendsController.addFriend);
    fastify.get("/friends/list", friendsController.getFriends);
    fastify.delete("/friends/remove/:id", friendsController.removeFriend);
}
