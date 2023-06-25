let https = require('https');
let fs = require('fs');

const options = {
    key: fs.readFileSync('certificates/res-lke.key').toString(),
    cert: fs.readFileSync('certificates/res-lke.crt').toString(),
};

https.createServer(options, (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
    });
    res.end('Https');
}).listen(3000, '127.0.0.1');
