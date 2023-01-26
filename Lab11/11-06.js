const rpcws = require('rpc-websockets');

let rpc = new rpcws.Server({port: 4000, host: 'localhost'});

rpc.event('A');
rpc.event('B');
rpc.event('C');

process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        chunk = chunk.toString().trim();
        switch (chunk) {
            case 'A':
                rpc.emit('A');
                console.log('Event A emitted');
                break;
            case 'B':
                rpc.emit('B');
                console.log('Event B emitted');
                break;
            case 'C':
                rpc.emit('C');
                console.log('Event C emitted');
                break;
        }
    }
})