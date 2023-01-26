var http = require('http');
var url = require('url');
var fs = require('fs');

var fname = './pic.png';

http.createServer((request, response) => {
    if(request.method === 'GET' && url.parse(request.url).pathname === '/png') {
        fs.stat(fname, (err,stat) => {
            if(err) console.log('error:', err)
            else {
                let jpg = fs.readFileSync(fname);
                response.writeHead(200, {'Content-Type': 'image/jpg', 'Content-Length': stat.size});
                response.end(jpg, 'binary');
            }
        });
    } else {
        response.statusCode = 400;
        response.end();
    }
    
}).listen(3000);

console.log('Server is running at http://localhost:3000/ ');