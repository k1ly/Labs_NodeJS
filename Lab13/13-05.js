const net = require('net');
const streams = require('memory-streams');

let connections = new Map();

let server = net.createServer(socket => {
    console.log(`Connected: ${socket.remoteAddress}:${socket.remotePort}`);
    connections.set(socket, {stream: new streams.WritableStream()});
    socket.pipe(connections.get(socket).stream);
    socket.on('close', () => {
        console.log(`Socket ${socket.remoteAddress}:${socket.remotePort} close`);
        connections.delete(socket);
    });
    socket.on('error', () => {
        console.log(`Socket ${socket.remoteAddress}:${socket.remotePort} error`);
        connections.delete(socket);
    });
}).listen(30000, '0.0.0.0');

setInterval(() => {
    for (let [socket, data] of connections) {
        let sum = 0;
        let dataBuffer = data.stream.toBuffer();
        console.log(`${socket.remoteAddress}:${socket.remotePort}`, dataBuffer);
        for (let i = 0; i < dataBuffer.length; i += 4) {
            sum += dataBuffer.readInt32LE(i);
        }
        let buffer = new Buffer.alloc(4);
        buffer.writeInt32LE(sum, 0)
        socket.write(buffer);
    }
}, 5000)

server.on('listening', () => console.log('TCP Server', server.address().address, ':', server.address().port))
    .on('error', () => console.error('Server error'))