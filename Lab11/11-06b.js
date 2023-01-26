const rpcws = require('rpc-websockets');

let rpc = new rpcws.Client('ws:/localhost:4000/');
rpc.on('open', () => {
    rpc.subscribe('B');
    rpc.on('B', () => console.log('Event B'));
})