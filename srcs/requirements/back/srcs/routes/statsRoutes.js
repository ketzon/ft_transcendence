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

    try {
      const gamesFromDb = await fastify.prisma.game.findMany({
        where: {
          OR: [
            { player1Id: userId },
            { player2Id: userId }
          ]
        },
        orderBy: { date: 'desc' },
        include: {
          player1: true,
          player2: true
        }
      });
      
      const games = gamesFromDb.map((game) => {
        const isPlayer1 = game.player1Id === userId;
        const isPlayer2 = game.player2Id === userId;
        const isCurrentUser = isPlayer1 || isPlayer2;
        const player1DisplayName = game.player1?.username || game.player1Name || 'Player1';
        const player2DisplayName = game.player2?.username || game.player2Name || 'Player2';
        const userScore = isPlayer1 ? game.score1 : game.score2;
        const opponentScore = isPlayer1 ? game.score2 : game.score1;
        const result = userScore > opponentScore ? 'Win' : 'Loss';
        const username = isPlayer1 ? player1DisplayName : player2DisplayName;
        const opponentName = isPlayer1 ? player2DisplayName : player1DisplayName;
        const player1Username = game.player1 && game.player1.username ? game.player1.username : 'Player' + game.player1Id;
        // const username = isPlayer1 ? player1Username : game.player2Name;
        // const username = isCurrentUser ? (isPlayer1 ? player1DisplayName : player2DisplayName) : 'Unknown';
        console.log("=== Partie ===");
        console.log("player1Id:", game.player1Id, "player1.username:", game.player1?.username, "player1Name:", game.player1Name);
        console.log("player2Id:", game.player2Id, "player2.username:", game.player2?.username, "player2Name:", game.player2Name);
        console.log("isPlayer1:", isPlayer1, "isPlayer2:", isPlayer2);
        console.log("player1DisplayName:", player1DisplayName);
        console.log("player2DisplayName:", player2DisplayName);
        console.log("username (current user):", username);
        console.log("opponentName:", opponentName);
        return {
          date: game.date.toISOString().slice(0, 16).replace('T', ' '),
          player1: { id: game.player1Id, username: player1Username },
          player2: { id: game.player2Id, username: player2DisplayName },
          score: game.score1 + '-' + game.score2,
          result: result,
          username: username,
          player2Name: game.player2Name, 
          opponent: opponentName,
          gameStats: {
            gameDuration: game.duration,
            score1: game.score1,
            score2: game.score2,
            totalMoves: game.totalMoves,
            avgMoveTime: game.avgMoveTime,
          // date: game.date.toISOString().slice(0, 16).replace('T', ' '),
          // player1: { id: game.player1Id, username: game.player1?.username || 'Player' + game.player1Id },
          // score: game.score1 + '-' + game.score2,
          // result: game.score1 > game.score2 ? 'Win' : 'Loss',
          // username: game.player1?.username,
          // player2Name: game.player2Name,
          // gameStats: {
          //   gameDuration: game.duration,
          //   score1: game.score1,
          //   score2: game.score2,
          //   totalMoves: game.totalMoves,
          //   avgMoveTime: game.avgMoveTime,

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

      return reply.send(toSerializable({
        userId,
        username: user.username,
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

export default statsRoutes;
