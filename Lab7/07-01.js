var http = require('http');
var stat = require('./m07-01')('./static');

http.createServer((request, response) => {
    stat.processStaticRequest(request, response);
}).listen(3000);