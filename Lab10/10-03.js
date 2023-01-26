const http = require('http');
const ws = require('ws');
const fs = require('fs');

let httpserver = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/start') {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end(fs.readFileSync('./start.html'));
    } else {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Bad request');
    }
}).listen(3000);

let n = 0;
let k = 0;

let wsserver = new ws.WebSocket.Server({port: 4000, host: 'localhost'});
wsserver.on('connection', ws => {
    ws.on('message', message => {
        n = parseInt(message.toString().substring(message.toString().indexOf(': ') + 1));
        console.log('Message: ', message.toString());
    });
});

setInterval(() => {
    wsserver.clients.forEach(client => {
        if (client.readyState === ws.WebSocket.OPEN)
            client.send(`10-01-server: ${n}->${k++}`);
    })
}, 5000);

wsserver.on('error', e => console.error('Error: ', e))
