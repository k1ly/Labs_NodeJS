const ws = require('ws');

let n = 0;
let connections = 0;

let wsserver = new ws.WebSocket.Server({port: 4000, host: 'localhost'});
wsserver.on('connection', socket => {
    socket.on('ping', message => {
        console.log(`Ping: ${message.toString()}`);
        connections++;
        console.log(`Active connections: ${connections}`);
    });
    socket.on('pong', message => {
        console.log(`Pong: ${message.toString()}`);
    });
    setInterval(() => socket.send(`11-03-server: ${n++}`), 15000);
});

setInterval(() => {
    connections = 0;
    wsserver.clients.forEach(client => {
        if (client.readyState === ws.WebSocket.OPEN);
            // client.ping('server');
    })
}, 5000);

wsserver.on('error', e => console.error('Error: ', e))
