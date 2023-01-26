const ws = require('ws');

let n = 0;

let wsserver = new ws.WebSocket.Server({port: 4000, host: 'localhost'});
wsserver.on('connection', socket => {
    socket.on('message', message => {
        console.log(JSON.parse(message.toString()));
        socket.send(JSON.stringify({
            server: n++,
            client: JSON.parse(message.toString()).client,
            timestamp: new Date()
        }));
    });
});

wsserver.on('error', e => console.error('Error: ', e))
