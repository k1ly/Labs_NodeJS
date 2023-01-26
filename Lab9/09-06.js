const http = require('http');
const fs = require('fs');
const mp = require('multiparty');

const server = http.createServer().listen(3000);

server.on('request', (req, res) => {
    let form = new mp.Form({uploadDir: './upload'})
    form.on('file', (name, file) => {
        console.log(file)
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Success');
    })
    form.on('error', err => {
        console.error(err)
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Could not save file');
    })
    form.parse(req);
})

let bound = '=============';
let data = `--${bound}\r\n`
    + `Content-Disposition: form-data; name="file"; filename="MyFile.txt"\r\n`
    + `Content-Type: text/plain\r\n\r\n`
    + fs.readFileSync('MyFile.txt')
    + `\r\n--${bound}--\r\n`;

let options = {
    host: 'localhost',
    path: '/path',
    port: 3000,
    method: 'POST',
    headers: {'Content-Type': `multipart/form-data;boundary=${bound}`}
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

request.end(data);

