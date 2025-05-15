export default async function gameRoutes(fastify, opts) {
  fastify.post('/api/games', async (request, reply) => {
    try {
      const {
        player2Id,
        score1,
        score2,
        totalMoves,
        avgMoveTime,
        duration
      } = request.body;

      // temporairement on force player1Id (car pas de login actif)
      const player1Id = 1;

      const newGame = await fastify.prisma.game.create({
        data: {
          date: new Date(),
          player1Id,
          player2Id,
          score1,
          score2,
          totalMoves,
          avgMoveTime,
          duration
        }
      });

      reply.code(201).send({ message: 'Game saved', game: newGame });
    } catch (err) {
      console.error('Erreur enregistrement partie :', err);
      reply.code(500).send({ error: 'Internal Server Error', details: err.message });
    }
  });
}
