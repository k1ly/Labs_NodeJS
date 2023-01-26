const ws = require('ws');
const fs = require('fs');

let wsserver = new ws.WebSocket.Server({port: 4000, host: 'localhost'});
wsserver.on('connection', socket => {
    fs.createReadStream('./download/download.txt').pipe(ws.createWebSocketStream(socket, {encoding: 'utf8'}));
});

wsserver.on('error', e => console.error('Error: ', e))
