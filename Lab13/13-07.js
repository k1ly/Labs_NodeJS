const net = require('net');

let connection = server => socket => {
    console.log(`Connected: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.on('data', data => {
        console.log(`Received (${socket.remoteAddress}:${socket.remotePort}):`, data);
        socket.write(`ECHO (${server}): ${data.readInt32LE()}`);
    });
    socket.on('close', () => console.log(`Socket ${socket.remoteAddress}:${socket.remotePort} close`));
}

let server1 = net.createServer(connection('0.0.0.0:40000')).listen(40000, '0.0.0.0');
let server2 = net.createServer(connection('0.0.0.0:50000')).listen(50000, '0.0.0.0');

server1.on('listening', () => console.log('TCP Server', server1.address().address, ':', server1.address().port))
    .on('error', () => console.error('Server', server1.address().address, ':', server1.address().port, 'error'));
server2.on('listening', () => console.log('TCP Server', server2.address().address, ':', server2.address().port))
    .on('error', () => console.error('Server', server2.address().address, ':', server2.address().port, 'error'));