const ws = require('ws');
const fs = require('fs');

let socket = new ws.WebSocket('ws:/localhost:4000/');
socket.onopen = () => {
    ws.createWebSocketStream(socket, {encoding: 'utf8'}).pipe(fs.createWriteStream('./download.txt'));
}
socket.onmessage = m => console.log('Message: ', m.data);
socket.onclose = () => console.log('Socket closed');
socket.onerror = e => console.error('Socket error: ', e);