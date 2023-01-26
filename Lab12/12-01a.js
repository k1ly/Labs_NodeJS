const rpcws = require('rpc-websockets');

let rpc = new rpcws.Client('ws:/localhost:4000/');
rpc.on('open', () => {
    rpc.subscribe('FILE_UPD');
    rpc.on('FILE_UPD', (f) => console.log(`File ${f} was changed`));
})