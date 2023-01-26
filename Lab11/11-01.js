const ws = require('ws');
const fs = require('fs');

let wsserver = new ws.WebSocket.Server({port: 4000, host: 'localhost'});
wsserver.on('connection', socket => {
    ws.createWebSocketStream(socket, {encoding: 'utf8'}).pipe(fs.createWriteStream('./upload/upload.txt'));
});

wsserver.on('error', e => console.error('Error: ', e))
