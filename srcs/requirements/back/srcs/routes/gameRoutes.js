import fp from 'fastify-plugin';

console.log("✅ Route /api/games appelée");

async function gameRoutes(fastify, opts) {
  fastify.post('/api/games', async function (request, reply) {
  console.log("✅ POST /api/games bien reçu");

  console.log("📦 Contenu body :", request.body);
  // console.log("🧪 this.prisma =", this.prisma);

  try {
    const {
      player2Id,
      score1,
      score2,
      totalMoves,
      avgMoveTime,
      duration
    } = request.body;

    const player1Id = 1; // temporairement

//test si les joueurs existent
    const player1 = await fastify.prisma.user.findUnique({ where: { id: player1Id } });
const player2 = await fastify.prisma.user.findUnique({ where: { id: player2Id } });

console.log("🔍 Joueurs trouvés : player1 =", player1, "player2 =", player2);

if (!player1 || !player2) {
  return reply.code(400).send({ error: "One or both players do not exist" });
}
 
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

