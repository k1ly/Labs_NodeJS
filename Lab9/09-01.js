const http = require('http');

const server = http.createServer().listen(3000);

server.on('request', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.end('Success');
})

let options = {
    host: 'localhost',
    path: '/path',
    port: 3000,
    method: 'GET'
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
request.end();

