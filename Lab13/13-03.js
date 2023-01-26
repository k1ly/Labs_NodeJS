const net = require('net');

let sum = 0;

let server = net.createServer(socket => {
    console.log(`Connected: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.on('data', data => {
        console.log(`Received (${socket.remoteAddress}:${socket.remotePort}):`, data);
        sum += data.readInt32LE();
    });
    setInterval(() => {
        let buffer = new Buffer.alloc(4);
        buffer.writeInt32LE(sum, 0)
        socket.write(buffer);
    }, 5000)
    socket.on('close', () => console.log(`Socket ${socket.remoteAddress}:${socket.remotePort} close`));
    socket.on('error', () => console.log(`Socket ${socket.remoteAddress}:${socket.remotePort} error`));
}).listen(30000, '0.0.0.0');

server.on('listening', () => console.log('TCP Server', server.address().address, ':', server.address().port))
    .on('error', () => console.error('Server error'))