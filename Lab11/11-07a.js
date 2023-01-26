const rpcws = require('rpc-websockets');

let rpc = new rpcws.Client('ws:/localhost:4000/');

rpc.on('open', () => {
    process.stdin.on('readable', () => {
        let chunk = null;
        while ((chunk = process.stdin.read()) != null) {
            chunk = chunk.toString().trim();
            switch (chunk) {
                case 'A':
                    rpc.notify('A');
                    break;
                case 'B':
                    rpc.notify('B');
                    break;
                case 'C':
                    rpc.notify('C');
                    break;
            }
        }
    })
})