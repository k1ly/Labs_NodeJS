const net = require('net');

let client = new net.Socket();

client.on('data', data => {
    console.log(`Received: ${data}`);
    client.destroy();
}).on('close', () => console.log('Client close'))
    .on('error', () => console.log('Client error'))

client.connect(30000, '127.0.0.1', () => console.log(`Connected: ${client.remoteAddress}:${client.remotePort}`));

client.write('Hello from client!');