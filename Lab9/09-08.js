const http = require('http');
const fs = require('fs');

const server = http.createServer().listen(3000);

server.on('request', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(fs.readFileSync('./MyFile.txt'));
})

let options = {
    host: 'localhost',
    path: '/path',
    port: 3000,
    method: 'GET'
}

const request = http.request(options, res => res.pipe(fs.createWriteStream('./File.txt')))

request.on('error', e => console.error('Error: ', e))
request.end();

