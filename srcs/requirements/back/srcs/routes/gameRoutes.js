import fp from 'fastify-plugin';
import userController from '../controllers/users_controller.js';
import userService from "../services/user_services.js"


console.log("✅ Route /api/games appelée");

async function gameRoutes(fastify, opts) {
  fastify.post('/api/games', async function (request, reply) {
  console.log("✅ POST /api/games bien reçu");
  console.log("📦 Contenu body :", request.body);
  
  try {
    const {
      player2Name = "player2👻",
      score1,
      score2,
      totalMoves,
      avgMoveTime,
      duration
    } = request.body;
    
  const token = userController.getToken(request, reply);
  const user = await userService.getUserByToken(request.server, token);
  const player1Id = user.id;

  const player1 = await fastify.prisma.user.findUnique({ where: { id: player1Id } });
  if (!player1) {
    return reply.code(400).send({ error: "One or both players do not exist" });
  }
  
  const player2 = await fastify.prisma.user.create({
    data: {
      username: player2Name,
      email: `${player2Name.toString().toLowerCase()}${Date.now()}@example.com`,  // Ajoute un timestamp pour rendre l'email unique
      password: "defaultpassword",
      avatar: "default_avatar.png"
    }
  });

  const player2Id = player2.id;

  const data = {
    date: new Date(),
    player1Id,
    player2Id, 
    score1,
    score2,
    totalMoves,
    avgMoveTime,
    duration
  };

    console.log("📤 Données envoyées à Prisma :", data);

    const newGame = await this.prisma.game.create({ data });

    reply.code(201).send({ message: 'Game saved', game: newGame });

  } catch (err) {
    console.error('❌ Erreur /api/games :', err);
    reply.code(500).send({ error: 'Internal Server Error', details: err.message });
  }
});


}


export default fp(gameRoutes);

