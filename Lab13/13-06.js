const net = require('net');

let client = new net.Socket();

client.on('data', data => console.log('Received: ', data.readInt32LE()))
    .on('close', () => console.log('Client close'))
    .on('error', () => console.log('Client error'))

client.connect(30000, '127.0.0.1', () => console.log(`Connected: ${client.remoteAddress}:${client.remotePort}`));

let k = process.argv.length > 2 ? process.argv[2] : 0;
let buffer = new Buffer.alloc(4);

client.interval = setInterval(() => client.write((buffer.writeInt32LE(k, 0), buffer)), 1000);
setTimeout(() => {
    clearInterval(client.interval);
    client.end();
}, 20000)