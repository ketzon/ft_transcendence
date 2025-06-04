import prisma from "../config/prismaClient.js";

const addFriend = async (userId, friendUsername) => {
    const friend = await prisma.user.findFirst({
        where: { username: friendUsername }
    });
    if (!friend) {
        throw new Error("User not found");
    }
    if (friend.id === userId) {
        throw new Error("Cannot add yourself as friend");
    }
    //check si deja amis
    const existing = await prisma.friends.findFirst({
        where: {
            OR: [
                { user1_id: userId, user2_id: friend.id },
                { user1_id: friend.id, user2_id: userId }
            ]
        }
    });
    //si amis 
    if (existing) {
        throw new Error(`Already friends with ${friend.username}`);
    }
    //sinon create relation, la personne qui fait la requete est le user1
    //auto increment id
    return await prisma.friends.create({
        data: { 
            user1_id: userId, 
            user2_id: friend.id 
        }
    });
};

const getFriends = async (userId) => {
    const friendships = await prisma.friends.findMany({
        where: {
            OR: [
                { user1_id: userId }, 
                { user2_id: userId }
            ]
        },
        include: {
            user1: { 
                select: { 
                    id: true, 
                    username: true, 
                    avatar: true, 
                    lastActive: true 
                } 
            },
            user2: { 
                select: { 
                    id: true, 
                    username: true, 
                    avatar: true, 
                    lastActive: true 
                } 
            }
        }
    });
    //si je suis user1 return user2 (mon ami) ou inversement
    return friendships.map(friendship => {
        return friendship.user1_id === userId ? friendship.user2 : friendship.user1;
    });
};

const removeFriend = async (userId, friendId) => {
    const result = await prisma.friends.deleteMany({
        where: {
            OR: [
                { user1_id: userId, user2_id: friendId },
                { user1_id: friendId, user2_id: userId }
            ]
        }
    });
    
    if (result.count === 0) {
        throw new Error("Friendship not found");
    }
    
    return result;
};

export default { 
    addFriend, 
    getFriends, 
    removeFriend 
};
