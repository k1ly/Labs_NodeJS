const udp = require('dgram')

let client = udp.createSocket('udp4')
    .on('message', (msg, rinfo) => {
        console.log(`Received (${rinfo.address}:${rinfo.port}):`, msg.toString());
        client.close();
    });

client.send('Hello from client!', 30000, '127.0.0.1', error => {
    if (error) {
        console.error('Socket error', error);
        client.close();
    }
});