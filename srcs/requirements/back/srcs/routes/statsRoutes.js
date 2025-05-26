import userController from '../controllers/users_controller.js';
import userService from "../services/user_services.js"

function toSerializable(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? Number(value) : value
  ));
}

async function statsRoutes(fastify, opts) {
  fastify.get('/api/stats/user', async (request, reply) => {
    const token = userController.getToken(request, reply);
    const user = await userService.getUserByToken(request.server, token);
    const userId = user.id;
    // const userId = parseInt(request.params.id);

    try {
      const gamesFromDb = await fastify.prisma.game.findMany({
        where: {
          OR: [
            { player1Id: userId }
          ]
        },
        orderBy: { date: 'desc' },
        include: {
          player1: true
        }
      });
      // console.log("🧪 Games from DB :", gamesFromDb);

      const games = gamesFromDb.map((game) => {
        const isPlayer1 = game.player1Id === userId;
        const userScore = isPlayer1 ? game.score1 : game.score2;
        const opponentScore = isPlayer1 ? game.score2 : game.score1;
        const result = userScore > opponentScore ? 'Win' : 'Loss';

        const player1Username = game.player1 && game.player1.username ? game.player1.username : 'Player' + game.player1Id;
        const username = isPlayer1 ? player1Username : game.player2Name;

        return {
          date: game.date.toISOString().slice(0, 16).replace('T', ' '),
          player1: { id: game.player1Id, username: player1Username },
          score: game.score1 + '-' + game.score2,
          result: result,
          username: username,
          player2Name: game.player2Name, //utilise dans dashboard.ts pour le gameHistory
          gameStats: {
            gameDuration: game.duration,
            score1: game.score1,
            score2: game.score2,
            totalMoves: game.totalMoves,
            avgMoveTime: game.avgMoveTime,

          }
        };
      });

      let currentStreak = 0;
      let maxStreak = 0;
      games.forEach(game => {
        if (game.result === 'Win') {
          currentStreak++;
          if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      });

      const gamesPlayed = games.length;
      const wins = games.filter(game => game.result === 'Win').length;
      const losses = gamesPlayed - wins;
      const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 1000) / 10 : 0;
      
      console.log("🎯 maxStreak calculé dans le backend :", maxStreak);
      console.log("🎯 total losses calculé dans le backend :", losses);

      return reply.send(toSerializable({
        userId,
        gamesPlayed,
        wins,
        losses,
        winRate,
        games,
        maxStreak
      }));

    } catch (err) {
      console.error('❌ Erreur stats route :', err);
      reply.code(500).send({ error: 'Erreur récupération statistiques', details: err.message });
    }
  });

}

// Export si tu es en module ESM :
export default statsRoutes;

// Ou, si tu es en CommonJS (avec `require`)
/*
module.exports = statsRoutes;
*/
