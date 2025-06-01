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
      player1Name, // Valeur par défaut si player1Name n'est pas fourni
      player2Name = "Player2", // Valeur par défaut si player2Name n'est pas fourni
      score1,
      score2,
      totalMoves,
      avgMoveTime,
      duration
    } = request.body;
    
  const token = userController.getToken(request, reply);
  const user = await userService.getUserByToken(request.server, token);
  // let player1Id = null;
  // if (player1Name === user.username) {
  //   player1Id = user.id;
  // }

  // const player1 = await fastify.prisma.user.findUnique({ where: { id: player1Id } });
  // if (!player1) {
  //   return reply.code(400).send({ error: "One or both players do not exist" });
  // }
      let player1Id = null;
      let player2Id = null;
    if (player1Name === user.username) {
        player1Id = user.id;
      }
    if (player2Name === user.username) {
        player2Id = user.id;
      }
    let player1 = null;
    if (player1Id) {
      player1 = await fastify.prisma.user.findUnique({ where: { id: player1Id } });
      if (!player1) {
        return reply.code(400).send({ error: "Player 1 does not exist" });
      }
    }
    const data = {
    date: new Date(),
    // player1Id,
    player1Name,
    player2Name, 
    score1,
    score2,
    totalMoves,
    avgMoveTime,
    duration
  };
  if (player1Id) {
    data.player1 = { connect: { id: player1Id } };
  }
  if (player2Id) {
    data.player2 = { connect: { id: player2Id } };
  }

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

