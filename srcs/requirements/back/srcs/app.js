import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { __dirname } from './services/user_services.js';

//Tools
import Fastify from "fastify"

//Config
import {PORT, SITE_NAME} from "./config/config.mjs"
import registerUserRoute from "./routes/userRoutes.js"

//Auth
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';


const fastify = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: { colorize: true },
        },
    },
});

await fastify.register(fastifyCors, {
    // origin: "http://localhost:8080", //Use this if you want to allow requests to API using docker nginx instead of Vite
    // origin: "http://localhost:5173",
    origin: true, // equivalent a la wildcard * , toutes les origins sont accept
    credentials: true
  });
await fastify.register(multipart);

await fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'uploads'),
    prefix: '/uploads/', // l’URL publique commencera par /uploads/
  });

fastify.register(fastifyCookie);
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  }
});

fastify.register(registerUserRoute, {prefix: "/user"});


fastify.listen({port: PORT, host: "0.0.0.0"}, (err, address) => {
	if (err) {
		fastify.log.error(err),
		process.exit(1)
	}
	console.log(`Computer is transcending on : http://localhost:${PORT}`)
})
