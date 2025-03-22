'use strict'

export default async function (server: any) {
    server.get('/routes/print_one', async function handler (request: any, reply: any) {
        return "<p1>1</p1>"; // can be used interchangably with reply.send(returnValue);
    });
    server.get('/routes/print_two', async function handler (request: any, reply: any) {
        return "<p1>2</p1>"; // can be used interchangably with reply.send(returnValue);
    });
}
