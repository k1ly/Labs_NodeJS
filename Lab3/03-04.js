var http = require('http');
var url = require('url');
var fs = require('fs');

const fact = k => k < 1 ? 0 : (k === 1 ? 1 : k * fact(k - 1));

function FactAsync(k, callback) {
    this.fact = fact;
    this.k = k;
    this.callback = callback;
    this.calc = () => process.nextTick(() => this.callback(null, this.fact(this.k)));
}

http.createServer((request, response) => {
    if (url.parse(request.url).pathname === '/fact') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        let k = url.parse(request.url, true).query.k;
        if (!Number.isInteger(parseInt(k)))
            k = 0;
        let fact = new FactAsync(k, (err, result) => response.end(JSON.stringify({k: k, fact: result})))
        fact.calc();
    } else {
        response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        let html = fs.readFileSync('./fact.html');
        response.end(html);
    }
}).listen(5000);

console.log('Server is running at http://localhost:5000/ ');