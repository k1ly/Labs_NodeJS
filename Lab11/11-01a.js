const ws = require('ws');
const fs = require('fs');

let socket = new ws.WebSocket('ws:/localhost:4000/');
socket.onopen = () => {
    fs.createReadStream('./upload.txt').pipe(ws.createWebSocketStream(socket, {encoding: 'utf8'}));
}
socket.onmessage = m => console.log('Message: ', m.data);
socket.onclose = () => console.log('Socket closed');
socket.onerror = e => console.error('Socket error: ', e);