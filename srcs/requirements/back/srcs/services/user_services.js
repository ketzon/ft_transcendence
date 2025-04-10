import prisma from "../config/prismaClient.js"
import mailSender from "./mailSender.js"
import bcrypt from "bcryptjs"; // JTW pluggin
import crypto from "crypto"; // for 2FA 

import { customAlphabet } from "nanoid";


//Tools
const generateRandomUsername = () => {
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);
    return "user_" + nanoid(); 
}

const comparePass = async (password, user) => {
	return await bcrypt.compare(password, user.password)
}

//Tokens
const createJWT = async (app, id, email) => {
	const token = await app.jwt.sign({ id: id, email: email });
	return token
}

const getUserByToken = async (app, token) => {
	const decoded =  await app.jwt.verify(token)
	const user = await getUserById(decoded.id)
	return user
}
//

const createUser =  async (email, password, avatar) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const randomUsername = generateRandomUsername()
	const user = await prisma.user.create({
		data: { email, username: randomUsername, password: hashedPassword}
	})
	if (avatar) {
		await prisma.user.update({
			where: {email: email},
			data: {avatar: avatar}
		})
	}
	return user.id
}

const getUserByEmail = async (email) => {
	return await prisma.user.findFirst({ //DEVELOPMENT - then change for findUnique
		where: {email: email}
	})
}

const getUserById = async (id) => {
	const user = await prisma.user.findFirst({ //DEVELOPMENT - then change for findUnique
		where: {id: id}
	})
	return user;
}

const sendTwoFactAuth = async (id, email) => {
	const otp = crypto.randomInt(100000, 999999);
	const otp_expire = Date.now() + 5 * 60 * 1000;
	await mailSender.sendMail({
		to: email,
		text: `Authentification code for next 5 minutes: ${otp}`,
	});
	
	await prisma.user.update({
		where: {id: id},
		data: {	otp: otp, 
			otp_expire: otp_expire,
		}
	})
}

const updateUsername = async (user, newUsername) => {
	return await prisma.user.update({
		where: {id: user.id},
		data: {username: newUsername}
	})
}

const updateAvatar = async (user, newAvatar) => {
	const avatarPath = path.join(__dirname, 'uploads', `avatar-${user.id}.jpg`);
	const writeStream = fs.createWriteStream(avatarPath);
	newAvatar.pipe(writeStream);
	const oldAvatar = user.avatar
	writeStream.on('finish', async () => {
		const userUpdated =  await prisma.user.update({
			where: {id: user.id},
			data: {avatar: avatarPath}
		})
	})
	if (oldAvatar !== "./public/avatar.png" && fs.existsSync(oldAvatar)) {
		fs.unlinkSync(oldAvatar);
	return userUpdated
}
}

const updatePassword = async (user, newPassword) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);
	return await prisma.user.update({
		where: {id: user.id},
		data: {password: hashedPassword}
	})
}


export default {
	createJWT,
	createUser,
	getUserById,
	getUserByToken,
	getUserByEmail,
	comparePass,
	updateUsername,
	updateAvatar,
	updatePassword,
	sendTwoFactAuth,
}