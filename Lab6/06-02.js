var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    if (url.parse(request.url).pathname === '/' && request.method === 'GET') {
        let html = fs.readFileSync('./form.html');
        response.end(html);
    } else if (url.parse(request.url).pathname === '/' && request.method === 'POST') {
        let body = '';
        request.on('data', data => {
            body += data.toString();
        })
        request.on('end', () => {
            let params = require('querystring').parse(body);
            response.end(`<h1>Message sent to ${params.receiver}</h1>`);
        });
    } else response.end('<h1>Bad request</h1>');
}).listen(3000);