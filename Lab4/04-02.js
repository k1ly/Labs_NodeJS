var http = require('http');
var url = require('url');
var fs = require('fs');
var db = require('./db');

var DB = new db.DB();

DB.add({id: 1, name: 'n1', bday: '03/01/2001'});

DB.on('GET', (request, response) => {
        let id = url.parse(request.url, true).query.id;
        if (Number.isInteger(id = parseInt(id[0]))) {
            let entry = DB.find(id);
            if (entry) {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(entry));
            } else {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Entry does not exist');
            }
        }
        request.on('end', () => {
            response.writeHead(200);
            response.end()
        });
    }
);
DB.on('POST', (request, response) => {
    let entry;
    request.on('data', data => {
        entry = JSON.parse(data);
        try {
            DB.add(entry);
        } catch (e) {
            response.writeHead(400, {'Content-Type': 'text/plain'});
            response.end(e);
        }
    })
    request.on('end', () => {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(entry));
    });
});
DB.on('PUT', (request, response) => {
    let id = url.parse(request.url, true).query.id;
    if (Number.isInteger(id = parseInt(id[0]))) {
        request.on('data', data => {
            let entry = JSON.parse(data);
            try {
                DB.update(id, entry);
            } catch (e) {
                response.writeHead(400, {'Content-Type': 'text/plain'});
                response.end(e);
            }
        })
    }
    request.on('end', () => {
        response.writeHead(200);
        response.end()
    });
});
DB.on('DELETE', (request, response) => {
    let id = url.parse(request.url, true).query.id;
    if (Number.isInteger(id = parseInt(id[0]))) {
        let entry = DB.find(id);
        if (entry) {
            DB.remove(id);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(entry));
        } else {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('Entry does not exist');
        }
    }
    request.on('end', () => {
        response.writeHead(200);
        response.end()
    });
});

http.createServer((request, response) => {
    if (url.parse(request.url).pathname === '/api/db') {
        DB.emit(request.method, request, response);
    } else if (url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./fetch.html');
        response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        response.end(html);
    }
}).listen(5000);

console.log('Server is running at http://localhost:5000/ ');