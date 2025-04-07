import prisma from "./config/prismaClient.js"



const createUser =  async (req, res) => {
	const {name, password, avatar} = req.body
	const user = await prisma.user.create({
		data: { name, password}
	})
	if (avatar) {
		await prisma.update({
			data: {avatar: avatar}
		})
	}
}

const modifyName = async (newName) => {
	await prisma.user.update({
		where: {id: this.id},
		data: {name: newName}
	})
	this.name = newName;
}

const modifyPassword = async (newPassword) => {
	await prisma.user.update({
		where: {id: this.id},
		data: {password: newPassword}
	})
	this.password = newPassword;
}

const modifyAvatar = async(newAvatar) => {
	await prisma.user.update({
		where: {id: this.id},
		data: {avatar: newAvatar}
	})
	this.avatar = newAvatar;
}

const updateStats = async (win, loose) => {
	const stats = await prisma.stats.findUnique({
		where: { userId: this.id }
	});
	
	if (!stats) {
		await prisma.stats.create({
			data: {
				userId: this.id,
				game: 1,
				wins: win,
				looses: loose
			}
		})
	}
	else {
		await prisma.stats.update({
			where: {userId: this.id},
			data: {
				game: {increment: 1},
				wins: {increment: win},
				looses: {increment: loose}
			}
		})
		this.game += 1;
		this.win += win;
		this.looses += loose;
	}
}


// async addFriend(friendId) {
// }
// async deleteFriend(friendId) {
// }
// async blockFriend(friendId) {
// }
// async deleteAccount() {
// 	await prisma.user.delete({
// 		where: {id: this.id}
// 	})
// }
// static async deleteUserTable() {
// 	await prisma.user.deleteMany({})
// }


export default {
	createUser,
	modifyName,
	modifyPassword,
	modifyAvatar,
	updateStats
}