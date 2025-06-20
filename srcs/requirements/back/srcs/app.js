import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { __dirname } from './services/user_services.js';
// import fs from 'fs';

//Tools
import Fastify from "fastify"

//Config
// import {PORT, _SITE_NAME} from "./config/config.mjs"
import {PORT} from "./config/config.mjs"
import registerUserRoute from "./routes/userRoutes.js"

//Auth
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

//Stats 
import statsRoutes from './routes/statsRoutes.js';
//await fastify.register(statsRoutes);

//Jeu
import gameRoutes from './routes/gameRoutes.js';

// Prisma
import prisma from './config/prismaClient.js';

// Tournament
import tournamentRoutes from './routes/tournamentRoutes.js';

import fs from 'fs';

const fastify = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: { colorize: true },
        },
    },
    https: {
        cert: fs.readFileSync(path.join(__dirname, "../localhost.pem")),
        key: fs.readFileSync(path.join(__dirname, "../localhost-key.pem")),
    },
});


//On Attache Prisma
fastify.decorate('prisma', prisma);  


await fastify.register(fastifyCors, {
    // origin: "http://localhost:8080", //Use this if you want to allow requests to API using docker nginx instead of Vite
    // origin: "http://localhost:5173",
    origin: true, // equivalent a la wildcard * , toutes les origins sont accept
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']  
  });

await fastify.register(multipart, {
    limits: {
        fileSize: 5 * 1024 * 1024 // Ajoute une limite de taille de fichier que peux gerer le serveur
    }
});

fastify.register(async function (instance) {
    instance.register(fastifyStatic, {
      root: path.join(__dirname, 'uploads'),
      prefix: '/uploads/',
    });
  });

  fastify.register(async function (instance) {
    instance.register(fastifyStatic, {
      root: path.join(__dirname, '../public'),
      prefix: '/public/',
    });
  });

fastify.register(fastifyCookie);
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  }
});


//On declare les routes qui utilisent prisma
fastify.register(registerUserRoute, {prefix: "/user"});
await fastify.register(statsRoutes);  //Stats
await fastify.register(gameRoutes);  //Jeu
await fastify.register(tournamentRoutes); //Tournois


fastify.listen({port: PORT, host: "0.0.0.0"}, (err, _address) => {
	if (err) {
		fastify.log.error(err),
		process.exit(1)
	}
	fastify.log.info(`Computer is transcending on : https://localhost:${PORT}`)
})
