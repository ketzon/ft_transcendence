export default async function statsRoutes(fastify, opts) {
  fastify.get('/api/stats/user/:id', async (request, reply) => {
    const userId = request.params.id;

    // → Ici on met des données de test pour commencer
    const games = [
      {
        date: '2025-05-14 15:30',
        player1: { id: 1, username: 'Ines' },
        player2: { id: 2, username: 'Bot' },
        score: '5-3',
        result: 'Win',
        gameStats: {
          gameDuration: '7:30',
          score1: 5,
          score2: 3,
          totalMoves: 82,
          avgMoveTime: '1.2s'
        }
      }
    ];

    return { games };
  });
}
