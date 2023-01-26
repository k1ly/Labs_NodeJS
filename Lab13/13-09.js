const udp = require('dgram')

let server = udp.createSocket('udp4')
    .on('message', (msg, rinfo) => {
        console.log(`Received (${rinfo.address}:${rinfo.port}):`, msg.toString());
        server.send(`ECHO: ${msg}`, rinfo.port, rinfo.address, error => {
            if (error) {
                console.error('Socket error', error);
                server.close();
            }
        });
    });

server.on('listening', () => console.log('UDP Server', server.address().address, ':', server.address().port))
    .on('close', () => console.log(`Server socket close`))
    .on('error', err => {
        console.error('Server error', err);
        server.close()
    });

server.bind(30000);