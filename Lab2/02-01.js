var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer((request, response) => {
    if(url.parse(request.url).pathname === '/html') {   
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        response.end(html);
    } else {
        response.statusCode = 400;
        response.end();
    }
}).listen(3000);

console.log('Server is running at http://localhost:3000/ ');