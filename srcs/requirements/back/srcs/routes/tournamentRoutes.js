
async function tournamentRoutes(fastify, options) {
  fastify.post("/api/tournaments", async (req, reply) => {
    const { players, results, date } = req.body;

    try {
      const tournament = await fastify.prisma.tournament.create({
        data: {
          players: JSON.stringify(players),
          results: JSON.stringify(results),
          date: date ? new Date(date) : new Date(),
        },
      });

      reply.send({ success: true, tournament });
    } catch (error) {
      console.error("❌ Erreur enregistrement tournoi :", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  fastify.get("/api/tournaments", async (req, reply) => {
  const tournaments = await fastify.prisma.tournament.findMany();
  const parsedTournaments = tournaments.map(t => ({
    ...t,
    players: JSON.parse(t.players || '[]'),
    rounds: JSON.parse(t.results || '[]'),
  }));
  reply.send(parsedTournaments);
});

// Route GET - Détails d'un tournoi
fastify.get("/api/tournaments/:id", async (req, reply) => {
  const id = parseInt(req.params.id);
  const t = await fastify.prisma.tournament.findUnique({ where: { id } });
  if (!t) return reply.code(404).send({ error: "Tournament not found" });

  const tournament = {
    ...t,
    players: JSON.parse(t.players || '[]'),
    rounds: JSON.parse(t.results || '[]'),
  };
  reply.send(tournament);
});

}


// fastify.get("/api/tournaments", async (req, reply) => {
//   try {
//     const tournaments = await fastify.prisma.tournament.findMany();
//     reply.send(tournaments);
//   } catch (error) {
//     console.error("❌ Erreur récupération tournois :", error);
//     reply.code(500).send({ success: false, error: error.message });
//   }
// });



export default tournamentRoutes;