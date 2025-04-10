import userService from "../services/user_services.js"
import fastifyMultipart from 'fastify-multipart';


//tools
const getBody = (req, reply ) => {
	if (!req.body) {
		return reply.status(400).send("Missing body in request.")
	}
	else if (!req.body.email || req.body.email.trim() === "")
		return reply.status(400).send("Missing email in request-body.")
	else if (!req.body.password || req.body.password.trim() === "")
		return reply.status(400).send("Missing password in request-body.")
	const { email, username, password, avatar } = req.body
	return { email, username, password, avatar }
}

const getToken = (req, reply) => {
	const token = req.cookies?.token
	if (!token) {
		return reply.status(401).send({message: "Token Authentification missing"})
	}
	return token
}

// User try to signup
const signup = async (req, reply) => {
	const { email, username, password, avatar } = getBody(req, reply)

	try {
		//create user
		const id = await userService.createUser(email, password, avatar)

		//create auth token
		const token = await userService.createJWT(req.server, id, email);
		//return in front status, cookie with auth, and message.
		return reply
		.status(200)
		.cookie("token", token, {
			httpOnly: true,
			path: "/",
			secure: process.env.NODE_ENV === "development", //change for production when project finished (https)
			sameSite: 'strict'
		})
		.send({message: "User has been registered succesfully", details: {email, password, avatar}, token: req.cookies})
	}
	catch (error) {
		if (error.code === "P2002")
			return reply.status(409).send({message: "Username already used.", details: error.message})
		else 
			return reply.status(500).send({message: "Internal error", details: error.message})
	}
}

const signin = async(req, reply) => {
	const { email, username, password, avatar } = getBody(req, reply)
	try {
		const user = await userService.getUserByEmail(email)
		const isPasswordValid = await userService.comparePass(password, user);
		if (!isPasswordValid) {
			throw new Error({message: "Invalid password"})
		}
		const twoFactAuth = await userService.sendTwoFactAuth(user.id, email)
		return reply.status(200).send({message: "Code authentification sent to:", user: user})
	}
	catch(error) {
		return reply.status(500).send({message: "Internal error", details: error.message})
	}
}

const displayCurrentUser = async(req, reply) => {
	try {
		const token = req.cookies?.token
		if (!token) {
			return reply.status(401).send({message: "Token Authentification missing"})
		}
		const user = await userService.getUserByToken(req.server, token)
		if (!user.id) {
			return reply.status(500).send({message: "Token Authentification doesn't match with registered user"})
		}
		return user
	}
	catch (error) {
		reply.status(500).send({message: "Internal error displaying user", details: error.message})
	}
}

const logout = async(req, reply) => {
	try {
	return reply
		.clearCookie("token", {
		path: "/",
		secure: process.env.NODE_ENV === "development", //change for production when project finished (https)
		sameSite: 'strict',
		}).status(200).send({ message: "User logged out successfully", token: req.cookies });
	} catch (error) {
	return reply
		.status(500)
		.send({ message: "Error logging out", details: error.message });
	}
}

const customUsername = async (req, reply) => {
	try {
		const newUsername = req.body.newUsername
		const token = getToken(req, reply)
		const user = await userService.getUserByToken(req.server, token)
		const userUpdated = await userService.updateUsername(user, newUsername)
		reply.status(200).send({message: "Username succesfully changed.", user: userUpdated})
	}
	catch (error) {
		reply.status(500).send({message: "customUsername internal error", details: error.message})
	}
}

const customAvatar = async (req, reply) => {
	try {
		const newAvatar = req.body.newAvatar
		const token = getToken(req, reply)
		const user = await userService.getUserByToken(req.server, token)
		const userUpdated = await userService.updateAvatar(user, req.avatar)
		reply.status(200).send({message: "Avatar succesfully changed.", user: userUpdated})
	}
	catch (error) {
		reply.status(500).send({message: "customAvatar internal error", details: error.message, userID: user.id})
	}
}

const modifyPassword = async (req, reply) => {
	try {
		const { password, newPassword } = req.body
		const token = getToken(req, reply)
		const user = await userService.getUserByToken(req.server, token)
		const isPasswordValid = await userService.comparePass(password, user);
		if (!isPasswordValid) {
			throw new Error("Invalid password")
		}
		const userUpdated = await userService.updatePassword(user, newPassword)
		reply.status(200).send({message: "Password succesfully changed.", user: userUpdated})
	}
	catch (error) {
		reply.status(500).send({message: "modifyPassword internal error", details: error.message})
	}
}

const verify2FA = async (req, reply) => {
	const {auth, user} = req.body

	if (auth !== user.otp || Date.now > user.otp_expiration)
		return reply.status(401).send({message: "One Time Password invalid."})
	const token = await userService.createJWT(req.server, user.id, user.email);
	return reply.status(200).send({message: "Successfully connected.", user: user})
}

export default {
	signup,
	signin,
	logout,
	customUsername,
	customAvatar,
	displayCurrentUser,
	modifyPassword,
	verify2FA,
}