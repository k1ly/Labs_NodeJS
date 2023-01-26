var http = require('http');

http.createServer((request, response) => {
    response.writeHead(200, {'content-type': 'text/html'});
    response.end('<h1>Hello world!</h1>');
}).listen(3000);

console.log('Server is running at http://localhost:3000/ ');