import userManagement from "../controllers/users_controller.js"

export default async function registerUserRoute(fastify) {
	fastify.post("/signup", userManagement.signup)
	fastify.post("/signin", userManagement.signin)
	fastify.post("/logout", userManagement.logout)
	fastify.post("/customUsername", userManagement.customUsername)
	fastify.post("/customAvatar", userManagement.customAvatar)
	fastify.post("/modifyPassword", userManagement.modifyPassword)
	fastify.post("/verify-2FA", userManagement.verify2FA)
	fastify.get("/profil", userManagement.displayCurrentUser)

}