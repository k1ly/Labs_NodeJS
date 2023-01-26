const http = require('http');
const xmlbuilder = require('xmlbuilder');
const parseString = require('xml2js').parseString;

const server = http.createServer().listen(3000);

server.on('request', (req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk.toString('utf8'));
    req.on('end', () => {
        parseString(data, (err, result) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end(`Error: ${err}`
                );
            } else {
                res.writeHead(200, {'Content-Type': 'application/xml'});
                let xml = xmlbuilder.create('response').att('id', 33).att('request', result.request.$.id);
                let sum = 0;
                result.request.x.forEach(elem => sum += parseInt(elem.$.value));
                xml.ele('sum').att('element', 'x')
                    .att('result', sum);
                let concat = '';
                result.request.m.forEach(elem => concat += elem.$.value);
                xml.ele('concat').att('m', 'x')
                    .att('result', concat);
                res.end(xml.toString({pretty: true}));
            }
        });
    });
})

let options = {
    host: 'localhost',
    path: '/path',
    port: 3000,
    method: 'POST',
    headers: {'Content-Type': 'text/xml', 'Accept': 'text/xml'}
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

let data = xmlbuilder.create('request').att('id', 28);
data.ele('x').att('value', 1)
    .up().ele('x').att('value', 2)
    .up().ele('m').att('value', 'a')
    .up().ele('m').att('value', 'b')
    .up().ele('m').att('value', 'c');

request.end(data.toString());

