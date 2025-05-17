export default async function statsRoutes(fastify, opts) {
  fastify.get('/api/stats/user/:id', async (request, reply) => {
    const userId = parseInt(request.params.id);

    try {
      const gamesFromDb = await fastify.prisma.game.findMany({
        where: {
          OR: [
            { player1Id: userId },
            { player2Id: userId }
          ]
        },
        orderBy: {
          date: 'desc'
        },
        include: {
          player1: true,
           player2: true
        }
      });

      const games = gamesFromDb.map((game) => {
      const isPlayer1 = game.player1Id === userId;
        const userScore = isPlayer1 ? game.score1 : game.score2;
        const opponentScore = isPlayer1 ? game.score2 : game.score1;
        const result = userScore > opponentScore ? 'Win' : 'Loss';

        return {
          date: game.date.toISOString().slice(0, 16).replace('T', ' '),
          player1: { id: game.player1Id, username: game.player1?.username || `Player${game.player1Id}` },
          player2: { id: game.player2Id, username: game.player2?.username || `Player${game.player2Id}` },
          score: `${game.score1}-${game.score2}`,
          result,
          username: isPlayer1 ? game.player1?.username : game.player2?.username,
          gameStats: {
            gameDuration: game.duration,
            score1: game.score1,
            score2: game.score2,
            totalMoves: game.totalMoves,
            avgMoveTime: game.avgMoveTime
          }
        };
      });
      const gamesPlayed = games.length;
      const wins = games.filter(game => game.result === 'Win').length;
      const losses = gamesPlayed - wins;
      const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 1000) / 10 : 0;

      return reply.send({
        userId,
        gamesPlayed,
        wins,
        losses,
        winRate,
        games
      });
    } catch (err) {
      console.error('❌ Erreur stats route :', err);
      reply.code(500).send({ error: 'Erreur récupération statistiques', details: err.message });
    }
  });
}
