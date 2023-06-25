import JsonRPCServer from 'jsonrpc-server-http-nats';

let server = new JsonRPCServer();

const arrayNumberValidator = params => {
    if (!Array.isArray(params))
        throw new Error('Params must be an array');
    if (params.length === 0)
        throw new Error('Params must contain at least one number');
    if (params.some(element => typeof element !== 'number'))
        throw new Error('Params must contain only numbers');
    return params;
}

const binNumberValidator = params => {
    if (Array.isArray(params)) {
        if (params.length !== 2)
            throw new Error('Params must contain 2 values');
        params = {x: params[0], y: params[1]};
    } else if (!(Object.hasOwn(params, 'x') && Object.hasOwn(params, 'y')))
        throw new Error('Params must contain property x and y');
    if (!(typeof params.x === 'number' && typeof params.y === 'number'))
        throw new Error('Params must contain only numbers');
    if (params.y === 0)
        throw new Error('Can\'t divide by zero');
    return params;
}

server.on('sum', arrayNumberValidator, (params, channel, response) => {
    response(null, params.reduce((previousValue, currentValue) => previousValue + currentValue, 0));
})
server.on('mul', arrayNumberValidator, (params, channel, response) => {
    response(null, params.reduce((previousValue, currentValue) => previousValue * currentValue, 1));
})
server.on('div', binNumberValidator, (params, channel, response) => {
    response(null, params.x / params.y);
})
server.on('proc', binNumberValidator, (params, channel, response) => {
    response(null, params.x / params.y * 100);
})

server.listenHttp({host: '127.0.0.1', port: 3000});