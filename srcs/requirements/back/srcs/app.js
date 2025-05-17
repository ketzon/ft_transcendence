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
