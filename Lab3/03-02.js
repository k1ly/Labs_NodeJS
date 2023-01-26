var http = require('http');
var url = require('url');

const fact = k => k < 1 ? 0 : (k === 1 ? 1 : k * fact(k - 1));

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'});
    if (url.parse(request.url).pathname === '/fact') {
        let k = url.parse(request.url, true).query.k;
        if (!Number.isInteger(parseInt(k)))
            k = 0;
        response.end(JSON.stringify({k: k, fact: fact(k)}));
    } else {
        response.statusCode = 400;
        response.end();
    }
}).listen(5000);

console.log('Server is running at http://localhost:5000/ ');