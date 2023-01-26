const ws = require('ws');

let socket = new ws.WebSocket('ws:/localhost:4000/');
socket.onopen = () => {
    setInterval(() => socket.send(JSON.stringify({
        client: process.argv[2],
        timestamp: new Date()
    })), 5000);
}
socket.onmessage = m => console.log('Message: ', JSON.parse(m.data));
socket.onclose = () => console.log('Socket closed');
socket.onerror = e => console.error('Socket error: ', e);
