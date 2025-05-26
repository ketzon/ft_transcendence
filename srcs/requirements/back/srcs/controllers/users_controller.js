import userService from "../services/user_services.js"
import fastifyMultipart from 'fastify-multipart';

BigInt.prototype.toJSON = function () {
    return this.toString(); // Convert to string for serialization
  };

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
    const passwordPolicy = userService.validPasswordPolicy(password);
    if (!passwordPolicy)
        return reply.status(400).send({message: "Password does not meet requierements."});
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
    if (user == null)
      return reply.status(404).send({message: "No such user"})
		const isPasswordValid = await userService.comparePass(password, user);
		if (!isPasswordValid) {
			throw new Error("Invalid password")
		}
        const twofaToken = await userService.createTempJWT(req.server, user.email);
		const twoFactAuth = await userService.sendTwoFactAuth(user.id, email)
        return reply.status(200).cookie("twofaToken", twofaToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "development", //change for production when project finished (https)
            sameSite: 'strict'
        }).send({message: "Code authentification sent to:", email: email})



		// return reply.status(200).send({message: "Code authentification sent to:", email: email})
	}
	catch(error) {
		return reply.status(500).send({message: "Internal error", details: error.message})
	}
}

const resendOtpCode = async(req, reply) => {
    try
    {
        const twofaToken = req.cookies?.twofaToken;
        if (!twofaToken)
            return reply.status(401).send({message: "twofaToken missing"});
        const email = await userService.getTempTwofaToken(req.server, twofaToken);
        if (!email)
            return reply.status(500).send({message: "twofaToken doesn't match with current user"})
        const user = await userService.getUserByEmail(email);
        if (!user)
            return reply.status(404).send({message: "No such user"});
        const twoFactAuth = await userService.sendTwoFactAuth(user.id, email)
		return reply.status(200).send({message: "New Code authentification sent to:", email: email})
    }
    catch (error)
    {
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
		if (!user || !user.id) {
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
    let user = null;
	try {
		const token = getToken(req, reply)
		user = await userService.getUserByToken(req.server, token)
        const newAvatar = await req.file();
		const userUpdated = await userService.updateAvatar(user, newAvatar)
		reply.status(200).send({message: "Avatar succesfully changed.", user: userUpdated})
	}
	catch (error) {
		reply.status(500).send({message: "customAvatar internal error", details: error.message, userID: user.id || null})
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

const updateLanguage = async (req, reply) => {
    const { language } = req.body;
    try {
        const token = getToken(req, reply);
        const user = await userService.getUserByToken(req.server, token);
        const userUpdated = await userService.updateLanguage(user, language);
        reply.status(200).send({ message: "Language successfully changed", user: userUpdated });
    } catch (error) {
        reply.status(500).send({ error: "updateLanguage internal error" });
    }
}

const verify2FA = async (req, reply) => {
	const {code, email} = req.body
    const user = await userService.getUserByEmail(email);

	if (parseInt(code) !== user.otp || Date.now > user.otp_expiration)
		return reply.status(401).send({message: "One Time Password invalid."})
	const token = await userService.createJWT(req.server, user.id, user.email);

	return reply.status(200)
    .clearCookie("twofaToken", {
		path: "/",
		secure: process.env.NODE_ENV === "development", //change for production when project finished (https)
		sameSite: 'strict',
		})
    .cookie("token", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "development", //change for production when project finished (https)
        sameSite: 'strict'
    }).send({message: "Successfully connected.", user: user})
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
    updateLanguage,
    resendOtpCode,
}
