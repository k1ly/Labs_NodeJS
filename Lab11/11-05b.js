const rpcws = require('rpc-websockets');
const async = require('async');

let rpc = new rpcws.Client('ws:/localhost:4000/');
rpc.on('open', (x = rpc) => async.parallel({
            square1: cb => rpc.call('square', [3]).then(r => cb(null, `square(3) = ${r}`)).catch(e => cb(e, null)),
            square2: cb => rpc.call('square', [5, 4]).then(r => cb(null, `square(5,4) = ${r}`)).catch(e => cb(e, null)),
            sum1: cb => rpc.call('sum', [2]).then(r => cb(null, `sum(2) = ${r}`)).catch(e => cb(e, null)),
            sum2: cb => rpc.call('sum', [2, 4, 6, 8, 10]).then(r => cb(null, `sum(2,4,6,8,10) = ${r}`)).catch(e => cb(e, null)),
            mul1: cb => rpc.call('mul', [3]).then(r => cb(null, `mul(3) = ${r}`)).catch(e => cb(e, null)),
            mul2: cb => rpc.call('mul', [3, 5, 7, 9, 11, 13]).then(r => cb(null, `mul(3,5,7,9,11,13) = ${r}`)).catch(e => cb(e, null)),
            fib1: cb => rpc.login({login: 'login', password: 'password'}).then(login => {
                if (login)
                    rpc.call('fib', [1]).then(r => cb(null, `fib(1) = ${r}`)).catch(e => cb(e, null));
            }),
            fib2: cb => rpc.login({login: 'login', password: 'password'}).then(login => {
                if (login)
                    rpc.call('fib', [2]).then(r => cb(null, `fib(2) = ${r}`)).catch(e => cb(e, null));
            }),
            fib3: cb => rpc.login({login: 'login', password: 'password'}).then(login => {
                if (login)
                    rpc.call('fib', [7]).then(r => cb(null, `fib(7) = ${r}`)).catch(e => cb(e, null));
            }),
            fact1: cb => rpc.login({login: 'login', password: 'password'}).then(login => {
                if (login)
                    rpc.call('fact', [0]).then(r => cb(null, `fact(0) = ${r}`)).catch(e => cb(e, null));
            }),
            fact2: cb => rpc.login({login: 'login', password: 'password'}).then(login => {
                if (login)
                    rpc.call('fact', [5]).then(r => cb(null, `fact(5) = ${r}`)).catch(e => cb(e, null));
            }),
            fact3: cb => rpc.login({login: 'login', password: 'password'}).then(login => {
                if (login)
                    rpc.call('fact', [10]).then(r => cb(null, `fact(10) = ${r}`)).catch(e => cb(e, null));
            })
        },
        (e, r) => {
            if (e)
                console.error(e);
            if (r)
                console.log(r);
            rpc.close();
        })
);
rpc.on('error', e => console.error('Socket error: ', e));
