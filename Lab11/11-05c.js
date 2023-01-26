const rpcws = require('rpc-websockets');
const async = require('async');

let rpc = new rpcws.Client('ws:/localhost:4000/');
rpc.on('open', (x = rpc) => async.waterfall([
            cb => rpc.call('square', [3]).then(r => cb(null, [r])).catch(e => cb(e, null)),
            (p, cb) => rpc.call('square', [5, 4]).then(r => cb(null, p.concat([r]))).catch(e => cb(e, null)),
            (p, cb) => rpc.call('mul', [3, 5, 7, 9, 11, 13]).then(r => cb(null, p.concat([r]))).catch(e => cb(e, null)),
            (p, cb) => {
                console.log(p);
                rpc.call('sum', p).then(r => cb(null, [r])).catch(e => cb(e, null));
            },
            (p, cb) => rpc.login({login: 'login', password: 'password'}).then(login => {
                if (login)
                    rpc.call('fact', [7]).then(r => cb(null, p.concat([r]))).catch(e => cb(e, null));
            }),
            (p, cb) => rpc.call('mul', [2, 4, 6]).then(r => cb(null, p[0] + p[1] * r)).catch(e => cb(e, null))
        ],
        (e, r) => {
            if (e)
                console.error(e);
            if (r)
                console.log(`Result: ${r}`);
            rpc.close();
        })
);
rpc.on('error', e => console.error('Socket error: ', e));
