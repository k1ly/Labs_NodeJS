var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer((request, response) => {
    if(url.parse(request.url).pathname === '/xmlhttprequest') {
        let html = fs.readFileSync('./xmlhttprequest.html');
        response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        response.end(html);
    } else if(request.method === 'GET' && url.parse(request.url).pathname === '/api/name') {
        let data = {'n1':'Лысков', 'n2':'Кирилл', 'n3':'Евгеньевич'}
        response.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        response.end(JSON.stringify(data));
    } else {
        response.statusCode = 400;
        response.end();
    }
}).listen(3000);

console.log('Server is running at http://localhost:3000/ ');