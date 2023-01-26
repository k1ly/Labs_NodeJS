const rpcws = require('rpc-websockets');

let rpc = new rpcws.Server({port: 4000, host: 'localhost'});

rpc.register('A', () => console.log('Notification A'));
rpc.register('B', () => console.log('Notification B'));
rpc.register('C', () => console.log('Notification C'));