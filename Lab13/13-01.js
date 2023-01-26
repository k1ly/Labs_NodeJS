const net = require('net');

let server = net.createServer(socket => {
    console.log(`Connected: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.on('data', data => {
        console.log(`Received (${socket.remoteAddress}:${socket.remotePort}):`, data.toString());
        socket.write(`ECHO: ${data}`);
    });
    socket.on('close', () => console.log(`Socket ${socket.remoteAddress}:${socket.remotePort} close`));
}).listen(30000, '0.0.0.0');

server.on('listening', () => console.log('TCP Server', server.address().address, ':', server.address().port))
    .on('error', () => console.error('Server error'))