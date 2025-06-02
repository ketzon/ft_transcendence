
// async function tournamentRoutes(fastify, options) {
//   fastify.post("/api/tournaments", async (req, reply) => {
//     const { tournamentName, players, results, date, creatorId } = req.body;

//     try {
//       const tournament = await fastify.prisma.tournament.create({
//         data: {
//           tournamentName,
//           players: JSON.stringify(players),
//           results: JSON.stringify(results),
//           date: date ? new Date(date) : new Date(),
//           creatorId,
//         },
//       });

//       reply.send({ success: true, tournament });
//     } catch (error) {
//       console.error("❌ Erreur enregistrement tournoi :", error);
//       reply.code(500).send({ success: false, error: error.message });
//     }
//   });

// //   fastify.get("/api/tournaments", async (req, reply) => {
// //   const tournaments = await fastify.prisma.tournament.findMany();
// //   console.log(" 📍 Tournaments fetched:", tournaments.length);
// //   const parsedTournaments = tournaments.map(t => ({
// //     ...t,
// //     players: JSON.parse(t.players || '[]'),
// //     rounds: JSON.parse(t.results || '[]'),
// //   }));
// //   reply.send(parsedTournaments);
// // });

// // // Route GET - Détails d'un tournoi
// // fastify.get("/api/tournaments/:id", async (req, reply) => {
// //   const id = parseInt(req.params.id);
// //   const t = await fastify.prisma.tournament.findUnique({ where: { id } });
// //   if (!t) return reply.code(404).send({ error: "Tournament not found" });

// //   const tournament = {
// //     ...t,
// //     players: JSON.parse(t.players || '[]'),
// //     rounds: JSON.parse(t.results || '[]'),
// //   };
// //   reply.send(tournament);
// // });

// // }

// // export default tournamentRoutes;
//   fastify.get("/api/tournaments", async (req, reply) => {
//   const currentUserId = req.user?.id;
//     if (!currentUserId) {
//     return reply.code(401).send({ error: "Unauthorized" });
//   }

//   const tournaments = await fastify.prisma.tournament.findMany({
//     where: { creatorId: currentUserId },
//   });
//   console.log(" 📍 Tournaments fetched:", tournaments.length);
//   const parsedTournaments = tournaments.map(t => ({
//     ...t,
//     players: JSON.parse(t.players || '[]'),
//     rounds: JSON.parse(t.results || '[]'),
//   }));
//   reply.send(parsedTournaments);
// });

// // Route GET - Détails d'un tournoi
// fastify.get("/api/tournaments/:id", async (req, reply) => {
//   const id = parseInt(req.params.id);
//   const currentUserId = req.user?.id;
//     if (!currentUserId) {
//     return reply.code(401).send({ error: "Unauthorized" });
//   }
//   const t = await fastify.prisma.tournament.findUnique({
//     where: {
//       id,
//       creatorId: currentUserId,
//      }
//   });
  
//   if (!t) return reply.code(404).send({ error: "Tournament not found" });

//   const tournament = {
//     ...t,
//     players: JSON.parse(t.players || '[]'),
//     rounds: JSON.parse(t.results || '[]'),
//   };
//   reply.send(tournament);
// });

// }

// export default tournamentRoutes;

import userController from '../controllers/users_controller.js';
import userService from "../services/user_services.js";

async function tournamentRoutes(fastify, options) {

  // Route création tournoi
  fastify.post("/api/tournaments", async (req, reply) => {
    try {
      // Récupérer token et user côté backend
      const token = userController.getToken(req, reply); // ou req, reply selon contexte
      const user = await userService.getUserByToken(req.server, token);

      if (!user) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const currentUserId = user.id;
      const { tournamentName, players, results, date } = req.body;

      const tournament = await fastify.prisma.tournament.create({
        data: {
          tournamentName,
          players: JSON.stringify(players),
          results: JSON.stringify(results),
          date: date ? new Date(date) : new Date(),
          creatorId: currentUserId,  // <-- utilisation sécurisée de l'id backend
        },
      });

      reply.send({ success: true, tournament });
    } catch (error) {
      console.error("❌ Erreur enregistrement tournoi :", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  // Route GET liste tournois filtrée sur user connecté
  fastify.get("/api/tournaments", async (req, reply) => {
    try {
      const token = userController.getToken(req, reply);
      const user = await userService.getUserByToken(req.server, token);

      if (!user) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const currentUserId = user.id;

      const tournaments = await fastify.prisma.tournament.findMany({
        where: { creatorId: currentUserId },
      });

      const parsedTournaments = tournaments.map(t => ({
        ...t,
        players: JSON.parse(t.players || '[]'),
        rounds: JSON.parse(t.results || '[]'),
      }));

      reply.send(parsedTournaments);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Route GET détail tournoi avec contrôle accès
  fastify.get("/api/tournaments/:id", async (req, reply) => {
    try {
      const token = userController.getToken(req, reply);
      const user = await userService.getUserByToken(req.server, token);

      if (!user) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const currentUserId = user.id;
      const id = parseInt(req.params.id);

      const t = await fastify.prisma.tournament.findUnique({
        where: { id },
      });

      if (!t || t.creatorId !== currentUserId) {
        return reply.code(404).send({ error: "Tournament not found or access denied" });
      }

      const tournament = {
        ...t,
        players: JSON.parse(t.players || '[]'),
        rounds: JSON.parse(t.results || '[]'),
      };

      reply.send(tournament);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

}

export default tournamentRoutes;
