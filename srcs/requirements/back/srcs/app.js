import fastifyCors from '@fastify/cors';

//Tools
import Fastify from "fastify"

//Config
import {PORT, SITE_NAME} from "./config/config.mjs"
import registerUserRoute from "./routes/userRoutes.js"

//Auth
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

//Stats 
import InesStatsRoutes from './routes/statsRoutes.js';
//await fastify.register(InesStatsRoutes);

//Jeu
import gameRoutes from './routes/gameRoutes.js';

// Prisma
import prisma from './config/prismaClient.js';




const fastify = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: { colorize: true },
        },
    },
});


//On Attache Prisma
fastify.decorate('prisma', prisma);  


await fastify.register(fastifyCors, {
    // origin: "http://localhost:8080", //Use this if you want to allow requests to API using docker nginx instead of Vite
    // origin: "http://localhost:5173",
    origin: true, // equivalent a la wildcard * , toutes les origins sont accept
    credentials: true
  });

fastify.register(fastifyCookie);
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  }
});


// //A SUPPRIMER MODIF TEMP TEST
fastify.get('/api/debug/create-player2', async (request, reply) => {
  const user = await fastify.prisma.user.create({
    data: {
      email: "alex@example.com",
      username: "Alex",
      password: "test",
      avatar: "./public/avatar.png"
    }
  });
  reply.send({ message: "User créé", user });
});
//A SUPPRIMER MODIF TEMP TEST
fastify.get('/api/debug/games', async (request, reply) => {
  try {
    const games = await fastify.prisma.game.findMany();
    reply.send(games);
  } catch (err) {
    console.error("❌ Erreur récupération parties :", err);
    reply.code(500).send({ error: "Erreur récupération parties", details: err.message });
  }
});
//A SUPPRIMER MODIF TEMP TEST
fastify.get('/api/debug/create-test-user', async (request, reply) => {
  try {
    const user = await fastify.prisma.user.create({
      data: {
        email: "test@demo.com",
        username: "Inès",
        password: "test", // pas sécurisé évidemment
        avatar: "./public/avatar.png"
      }
    });
    reply.send({ message: "Utilisateur créé", user });
  } catch (err) {
    console.error("❌ Erreur création utilisateur :", err);
    reply.code(500).send({ error: "Erreur création utilisateur", details: err.message });
  }
});
//A SUPPRIMER MODIF TEMP TEST
fastify.get('/api/debug/users', async (request, reply) => {
  try {
    const users = await fastify.prisma.user.findMany();

    // Fonction récursive pour convertir tous les BigInt
    const toSerializable = (obj) =>
      JSON.parse(
        JSON.stringify(obj, (key, value) =>
          typeof value === 'bigint' ? Number(value) : value
        )
      );

    const safeUsers = toSerializable(users);

    console.log("🧪 Utilisateurs convertis :", safeUsers);
    reply.send(safeUsers);
  } catch (err) {
    console.error("❌ Erreur récupération utilisateurs :", err);
    reply.code(500).send({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

// 


//On declare les routes qui utilisent prisma
fastify.register(registerUserRoute, {prefix: "/user"});
await fastify.register(InesStatsRoutes);  //Stats
await fastify.register(gameRoutes);  //Jeu

//demarre le serveur
fastify.listen({port: PORT, host: "0.0.0.0"}, (err, address) => {
	if (err) {
		fastify.log.error(err),
		process.exit(1)
	}
	console.log(`Computer is transcending on : http://localhost:${PORT}`)
})
