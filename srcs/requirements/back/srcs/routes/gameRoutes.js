import fp from 'fastify-plugin';

console.log("✅ Route /api/games appelée");

async function gameRoutes(fastify, opts) {
//   fastify.post('/api/games', async function (request, reply) {
//     console.log("✅ POST /api/games bien reçu");
   
//     console.log("📦 Contenu body :", request.body);
//     console.log("🧪 this.prisma =", this.prisma);
//     // console.log("🧪 fastify.prisma =", fastify.prisma);
//     try {
//       const {
//         player2Id,
//         score1,
//         score2,
//         totalMoves,
//         avgMoveTime,
//         duration
//       } = request.body;

//       const player1Id = 1; // rairement on force player1Id (car pas de login actif)

//       // ✅ ici fastify.prisma est garanti
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
//       console.error('❌ Erreur /api/games :', err);
//       reply.code(500).send({ error: 'Internal Server Error', details: err.message });
//     }
//   });
//   fastify.get('/api/games/test', async (req, res) => {
//   res.send({ msg: 'La route GET fonctionne' });
// });
fastify.post('/api/games', async function (request, reply) {
  console.log("✅ POST /api/games bien reçu");

  console.log("📦 Contenu body :", request.body);
  console.log("🧪 this.prisma =", this.prisma);

  const player2Id = 2; 

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

