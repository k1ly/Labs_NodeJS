var http = require('http');

function mapHeaders(headers) {
    let rc = '';
    for(h in headers) {
        rc += '<h3>' + h + ' ' + headers[h] + '</h3>';
    }
    return rc;
}

http.createServer((request, response) => {
    let b = '';
    request.on('data', d => {b += d; console.log('data', b);});
    response.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
    request.on('end', () => response.end('<html><body>' +
            '<h1>Структура запроса: </h1>' +
            '<h2>Method: ' + request.method + '</h2>' +
            '<h2>Url: ' + request.url + '</h2>' +
            '<h2>Version: ' + request.httpVersion + '</h2>' +
            '<h2>HEADERS:</h2>' + mapHeaders(request.headers) +
            '<h2>Body: ' + b + '</h2>' +
            '</body></html>'));
}).listen(3000);

console.log('Server is running at http://localhost:3000/ ');