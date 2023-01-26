const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const parseString = require('xml2js').parseString;
const builder = require('xmlbuilder');
const mp = require('multiparty');

let server = http.createServer();

let sockets = new Set();
let socketInfo;
let connection = 0;
server.on('connection', socket => {
    sockets.add(socket);
    socketInfo = socket;
    socket.once('close', () => sockets.delete(socket));
    console.log(`Connection #${++connection}`);
});
server.destroy = () => {
    for (let socket of sockets)
        socket.destroy();
    sockets.clear();
    return new Promise((rsv, rjc) => server.close(err => err ? rjc(err) : rsv()));
};

server.on('request', (request, response) => {
        let urlString = url.parse(request.url, true);
        if (urlString.pathname === '/connection') {
            if (request.method === 'GET') {
                let set = urlString.query.set;
                if (set != null) {
                    set = parseInt(set);
                    if (Number.isInteger(set)) {
                        server.keepAliveTimeout = set;
                    } else {
                        response.writeHead(400, 'Bad request');
                        response.end('Bad request');
                    }
                }
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(`KeepAliveTimeout parameter set to ${server.keepAliveTimeout}`);
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/headers') {
            if (request.method === 'GET') {
                let headers = {'Content-Type': 'text/html', 'Custom': 'Test'};
                response.writeHead(200, headers);
                let reqHeaders = '<h1>Request headers:</h1>';
                for (const key in request.headers)
                    reqHeaders += `<div>${key}: ${request.headers[key]}</div>`;
                let resHeaders = '<h1>Response headers:</h1>';
                for (const key in headers)
                    resHeaders += `<div>${key}: ${headers[key]}</div>`;
                response.end(`<div>${reqHeaders}</div><div>${resHeaders}</div>`);
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/parameter') {
            if (request.method === 'GET') {
                let x = parseInt(urlString.query.x);
                let y = parseInt(urlString.query.y);
                if (Number.isInteger(x) && Number.isInteger(y)) {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(`<div>x = ${x} y = ${y}</div>`
                        + `<div>x + y = ${x + y}</div>`
                        + `<div>x - y = ${x - y}</div>`
                        + `<div>x * y = ${x * y}</div>`
                        + `<div>x / y = ${x / y}</div>`);
                } else {
                    response.writeHead(400, 'Bad request');
                    response.end('Bad request');
                }
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname.match('/parameter/\\d+/\\d+')) {
            let variables = urlString.pathname.substring(1);
            variables = variables.substring(variables.indexOf('/'));
            let x = parseInt(variables.substring(1, variables.lastIndexOf('/')));
            let y = parseInt(variables.substring(variables.lastIndexOf('/') + 1));
            if (Number.isInteger(x) && Number.isInteger(y)) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(`<div>x = ${x} y = ${y}</div>`
                    + `<div>x + y = ${x + y}</div>`
                    + `<div>x - y = ${x - y}</div>`
                    + `<div>x * y = ${x * y}</div>`
                    + `<div>x / y = ${x / y}</div>`);
            }
        } else if (urlString.pathname === '/close') {
            if (request.method === 'GET') {
                let closeTimeout = 10;
                setTimeout(() => {
                    clearInterval(interval);
                    process.stdin.unref();
                    console.log('Finishing...')
                    server.destroy().catch(err => console.error(err));
                }, closeTimeout * 1000);
                let interval = setInterval(() => console.log(`Sever will be closed in ${--closeTimeout} seconds`), 1000).unref();
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end('<h1>Server will be closed in 10 seconds!</h1>');
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/socket') {
            if (request.method === 'GET') {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end('<h1>Socket info</h1>'
                    + `<div>Client address: ${socketInfo.remoteAddress}</div>`
                    + `<div>Client port: ${socketInfo.remotePort}</div>`
                    + `<div>Server address: ${socketInfo.localAddress}</div>`
                    + `<div>Server port: ${socketInfo.localPort}</div>`);
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/req-data') {
            if (request.method === 'GET') {
                let data = '';
                let i = 0;
                request.on('data', chunk => data += ` ------ ${++i} ------ ${chunk.toString()}`);
                request.on('end', () => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({data: data}));
                });
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/resp-status') {
            if (request.method === 'GET') {
                let code = parseInt(urlString.query.code);
                let mess = urlString.query.mess;
                response.writeHead(code, mess, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: code, mess: mess}));
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/formparameter') {
            if (request.method === 'GET') {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(fs.readFileSync('./formparameter.html'));
            } else if (request.method === 'POST') {
                let data = '';
                request.on('data', chunk => data += chunk.toString());
                request.on('end', () => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(qs.parse(data)));
                });
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/json') {
            if (request.method === 'POST') {
                let data = '';
                request.on('data', chunk => data += chunk.toString());
                request.on('end', () => {
                    let json = JSON.parse(data);
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        __comment: 'Ответ. Лабораторная работа 8',
                        x_plus_y: json.x + json.y,
                        concat_s_o: json.s + ': ' + json.o.surname + ', ' + json.o.name,
                        length_m: json.m.length
                    }));
                });
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/xml') {
            if (request.method === 'POST') {
                let data = '';
                request.on('data',
                    chunk => data += chunk.toString());
                request.on('end', () => {
                    parseString(data, (err, res) => {
                        if (err) {
                            response.writeHead(500, {'Content-Type': 'text/plain'});
                            response.end(`Error: ${err}`
                            );
                        } else {
                            response.writeHead(200, {'Content-Type': 'application/xml'});
                            let xml = builder.create('response').att('id', 33).att('request', res.request.$.id);
                            let sum = 0;
                            res.request.x.forEach(elem => sum += parseInt(elem.$.value));
                            xml.ele('sum').att('element', 'x')
                                .att('result', sum);
                            let concat = '';
                            res.request.m.forEach(elem => concat += elem.$.value);
                            xml.ele('concat').att('m', 'x')
                                .att('result', concat);
                            response.end(xml.toString({pretty: true}));
                        }
                    });
                });
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/files') {
            if (request.method === 'GET') {
                fs.readdir('./static', (err, files) => {
                    if (err) {
                        response.writeHead(500, {'Content-Type': 'text/plain'});
                        response.end('Could not read directory /static');
                    } else {
                        response.writeHead(200, {'X-static-files-count': files.length});
                        response.end('Header');
                    }
                });
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname.match('/files/.+')) {
            if (request.method === 'GET') {
                let path = urlString.pathname.substring(1).substring(urlString.pathname.indexOf('/'));
                path =
                    `./static${path.substring(path.indexOf('/'))}`;
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end(fs.readFileSync(path));
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else if (urlString.pathname === '/upload') {
            if (request.method === 'GET') {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(fs.readFileSync('./upload.html'));
            } else if (request.method === 'POST') {
                let form = new mp.Form({uploadDir: './static'})
                form.on('file', (name, file) => {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(`<h1>Success!</h1><div>File: ${file.originalFilename}</div>`);
                })
                form.on('error', err => {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end('Could not save file');
                })
                form.parse(request);
            } else {
                response.writeHead(405, 'Method not allowed');
                response.end('Method not allowed');
            }
        } else {
            response.writeHead(400, 'Bad request');
            response.end('Bad request');
        }
    }
)
server.listen(3000);

