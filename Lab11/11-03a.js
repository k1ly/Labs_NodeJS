const ws = require('ws');

let socket = new ws.WebSocket('ws:/localhost:4000/');
socket.onmessage = m => console.log('Message: ', m.data);
socket.onclose = () => console.log('Socket closed');
socket.onerror = e => console.error('Socket error: ', e);

socket.on('ping', message => {
    console.log(`Ping: ${message.toString()}`);
    socket.ping('client');
});
socket.on('pong', message => {
    console.log(`Pong: ${message.toString()}`);
});