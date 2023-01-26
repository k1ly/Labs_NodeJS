const rpcws = require('rpc-websockets');

let rpc = new rpcws.Server({port: 4000, host: 'localhost'});

rpc.setAuth(a => a.login === 'login' && a.password === 'password');

rpc.register('square', params => {
    if (params.length === 1)
        return Math.pow(parseInt(params[0]), 2) * Math.PI;
    else if (params.length === 2)
        return parseInt(params[0]) * parseInt(params[1]);
}).public();
rpc.register('sum', params => {
    let sum = 0;
    for (let i = 0; i < params.length; i++) {
        sum += parseInt(params[i]);
    }
    return sum;
}).public();
rpc.register('mul', params => {
    let mul = 1;
    for (let i = 0; i < params.length; i++) {
        mul *= parseInt(params[i]);
    }
    return mul;
}).public();
rpc.register('fib', params => {
    let fib = [];
    for (let i = 0; i < parseInt(params[0]); i++) {
        fib[i] = (i > 0 ? fib[i - 1] : 1) + (i > 1 ? fib[i - 2] : 0);
    }
    return fib;
}).protected();
rpc.register('fact', params => {
    let fact = params[0] === 0 ? 0 : 1;
    for (let i = 1; i <= parseInt(params[0]); i++) {
        fact *= i;
    }
    return fact;
}).protected();
