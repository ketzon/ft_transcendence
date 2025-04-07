'use strict'

// API endpoints are easily defined with the following function template
// simply specify the method (GET, POST, etc) and the route as first argument
// example below: only the GET method is accepted by route /routes/ping
// anything can be put in the return statement

export default async function (server: any) {
    server.get('/routes/ping', async function handler (request: any, reply: any) {
        return { test: 'pong!' }; // can be used interchangably with reply.send(returnValue);
    });
}
