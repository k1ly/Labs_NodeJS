const ws = require('ws');

let k = 0;

let socket = new ws.WebSocket('ws:/localhost:4000/');
socket.onopen = () => {
    socket.interval = setInterval(() => socket.send(`10-01-client: ${k++}`), 3000);
    setTimeout(() => socket.close(), 25000);
}
socket.onmessage = m => console.log('Message: ', m.data);
socket.onclose = () => {
    console.log('Socket closed');
    clearInterval(socket.interval);
};
socket.onerror = e => console.error('Socket error: ', e);