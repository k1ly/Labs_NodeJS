const http = require('http');
const url = require('url')
const query = require('querystring')

const server = http.createServer().listen(3000);

server.on('request', (req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk.toString('utf8'));
    req.on('end', () => {
        let params = JSON.parse(data);
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end(`Params: x = ${params.x}; y = ${params.y}; s = ${params.s}`);
    })
})

let options = {
    host: 'localhost',
    path: `/path}`,
    port: 3000,
    method: 'POST'
}

const request = http.request(options, res => {
    console.log('Response code: ', res.statusCode);
    console.log('Response message: ', res.statusMessage);
    console.log('Server IP: ', res.socket.remoteAddress);
    console.log('Server port: ', res.socket.remotePort);
    let data = '';
    res.on('data', chunk => console.log('data -> Body: ', data += chunk.toString('utf8')))
    res.on('end', () => console.log('end -> Body: ', data))
})

request.on('error', e => console.error('Error: ', e))
request.end(JSON.stringify({x: 10, y: 20, s: 'ssssssss'}));

