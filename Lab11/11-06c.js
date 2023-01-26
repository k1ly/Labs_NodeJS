const rpcws = require('rpc-websockets');

let rpc = new rpcws.Client('ws:/localhost:4000/');
rpc.on('open', () => {
    rpc.subscribe('C');
    rpc.on('C', () => console.log('Event C'));
})