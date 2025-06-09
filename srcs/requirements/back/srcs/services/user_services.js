import prisma from "../config/prismaClient.js"
import mailSender from "./mailSender.js"
import bcrypt from "bcryptjs"; // JTW pluggin
import crypto from "crypto"; // for 2FA

import { customAlphabet } from "nanoid";

import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import sharp from 'sharp';


const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);



//Tools
const generateRandomUsername = () => {
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);
    return "user_" + nanoid();
}

const comparePass = async (password, user) => {
  if (user.password == null)
    return false
	return await bcrypt.compare(password, user.password)
}

//Tokens
const createJWT = async (app, id, email) => {
	const token = await app.jwt.sign({ id: id, email: email, type: "auth" });
	return token
}

const createTempJWT = async (app, email) => {
    const token = await app.jwt.sign({ email: email, type: "twofa" }, { expiresIn: "1h"});
    return token
}

const getTempTwofaToken = async (app, token) => {
    const decoded =  await app.jwt.verify(token);
    if (decoded.type !== "twofa")
        return (null);
    return decoded.email;
}

const getUserByToken = async (app, token) => {
	const decoded =  await app.jwt.verify(token)
    if (decoded.type !== "auth")
        return (null);
	const user = await getUserById(decoded.id)
	return user
}
//

const createUser =  async (email, password, avatar, username) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
    if (!username)
	    username = generateRandomUsername()
	const user = await prisma.user.create({
		data: { email, username: username, password: hashedPassword}
	})
	if (avatar) {
		await prisma.user.update({
			where: {email: email},
			data: {avatar: avatar}
		})
	}
	return user.id
}

const deleteUser = async(user) => {
  const del = await prisma.user.delete({
    where: {
      id: user.id,
    },
  })
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
        from: "pongu.sh42@gmail.com",
		to: email,
        subject: "Two-Factor-Authentification",
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

const updateEmail = async (user, newEmail) => {
    return await prisma.user.update({
        where: { id: user.id },
        data: { email: newEmail }
    });
};


const updateAvatar = async (user, newAvatar) => {
    const fileBuffer = await newAvatar.toBuffer();
    const publicPath = `uploads/avatar-${user.id}.jpg`;

    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
    const avatarPath = path.join(uploadDir, `avatar-${user.id}.jpg`);

	const oldAvatar = user.avatar
    if (oldAvatar !== "public/avatar.png")
        {
            const filename = oldAvatar.replace("uploads/", "");
            const oldFilePath = path.join(__dirname, "uploads", filename);

            if (fs.existsSync(oldFilePath))
                fs.unlinkSync(oldFilePath);
        }

    await sharp(fileBuffer)
        .jpeg({quality: 80})
        .toFile(avatarPath);

    const userUpdated = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: publicPath }
        });

    return (userUpdated);
}

const updatePassword = async (user, newPassword) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);
	return await prisma.user.update({
		where: {id: user.id},
		data: {password: hashedPassword}
	})
}

const updateLanguage = async (user, newLanguage) => {
    return await prisma.user.update({
        where: {id: user.id},
        data: {language: newLanguage}
    })
}

const validUsernamePolicy = (username) => {
    let usernameRules = /^[a-zA-Z0-9_-]{2,16}$/;

    if (!username)
        return false;
    const isValid = usernameRules.test(username);
    if (!isValid)
        return false;
    return (true);
}

const validPasswordPolicy = (password) => {
    let passwordRules = [
    {
        regex: /.{8,}/,   // min 8 letters
        itemId : "min-len-item"
    },
    {
        regex: /[0-9]/, // at least 1 number
        itemId: "number-item"
    },
    {
        regex: /[a-z]/, // at least one lowercase
        itemId: "lowercase-item"
    },
    {
        regex: /[A-Z]/,
        itemId: "uppercase-item"
    },
    {
        regex: /(?=.*[@$!%*?&])/,
        itemId: "special-char-item"
    }
]
    if (!password)
        return (false);
    for (let idx = 0; idx < passwordRules.length; idx++)
    {
        let isValid = passwordRules[idx].regex.test(password);
        if (!isValid)
            return (false);
    }
    return (true);
}

const updateLastActive = async (userId) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { lastActive: new Date() }
        });
    } catch (error) {
        console.error("Error updating lastActive:", error);
    }
};

export default {
	createJWT,
    createTempJWT,
    getTempTwofaToken,
	createUser,
	getUserById,
	getUserByToken,
	getUserByEmail,
	comparePass,
	updateUsername,
	updateAvatar,
	updatePassword,
	sendTwoFactAuth,
    updateLanguage,
    validPasswordPolicy,
    validUsernamePolicy,
    updateLastActive,
  deleteUser,
}
