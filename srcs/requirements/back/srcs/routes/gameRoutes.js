// export default async function gameRoutes(fastify, opts) {
//   fastify.post('/api/games', async function (request, reply) {
//     console.log('🧪 this.prisma =', this.prisma); 
//     try {
//       const {
//         player2Id,
//         score1,
//         score2,
//         totalMoves,
//         avgMoveTime,
//         duration
//       } = request.body;

//       // temporairement on force player1Id (car pas de login actif)
//       const player1Id = 1;

//       //utilisation de this car fastify.prisma est undefined dans ce contexte
//       const newGame = await this.prisma.game.create({
//         data: {
//           date: new Date(),
//           player1Id,
//           player2Id,
//           score1,
//           score2,
//           totalMoves,
//           avgMoveTime,
//           duration
//         }
//       });

//       reply.code(201).send({ message: 'Game saved', game: newGame });
//     } catch (err) {
//       console.error('Erreur enregistrement partie :', err);
//       reply.code(500).send({ error: 'Internal Server Error', details: err.message });
//     }
//   });
// }

import fp from 'fastify-plugin';

async function gameRoutes(fastify, opts) {
  fastify.post('/api/games', async function (request, reply) {
    console.log("✅ Route /api/games appelée");
    console.log("📦 Contenu body :", request.body);
    console.log("🧪 this.prisma =", this.prisma);
    console.log("🧪 fastify.prisma =", fastify.prisma);
    try {
      const {
        player2Id,
        score1,
        score2,
        totalMoves,
        avgMoveTime,
        duration
      } = request.body;

      const player1Id = 1;

      // ✅ ici fastify.prisma est garanti
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
      console.error('❌ Erreur /api/games :', err);
      reply.code(500).send({ error: 'Internal Server Error', details: err.message });
    }
  });
}

// ✅ on exporte en tant que plugin Fastify
export default fp(gameRoutes);
