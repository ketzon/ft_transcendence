'use strict'

// A normal user should never see this
// because the front is served on port 8080
export default async function (server: any) {
    server.get('/', async function handler (request: any, reply: any) {
        return { test: 'you\'re not supposed to see this...' };
    });
}
