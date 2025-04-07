import fastify from 'fastify'
import cors from '@fastify/cors'

// Creates a server object with options to enable logging in console
const server = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: { colorize: true },
        }
    }
});

// Enable CORS headers (allows API calls between front and back)
const registerCors = async () => {
    await server.register(cors, {
    })
}
registerCors();

// List of files to load and transpile alongside with this one
// All files in the routes directory are API endpoints
server.register(import('./routes/root.js')); // special API endpoint for the root page (localhost:3000/)
server.register(import('./routes/ping.js')); // simple API call that replies with "pong" if the backend functions properly 
server.register(import('./routes/print.js'));

// Run web server
server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    // next line commented because automatic logging is already enabled on line 6 of this file
    // console.log(`Server listening at ${address}`);
});
