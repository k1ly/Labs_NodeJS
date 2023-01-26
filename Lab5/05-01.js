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

var STAT = null;

var server = http.createServer((request, response) => {
    if (STAT)
        STAT.request++;
    if (url.parse(request.url).pathname === '/api/db') {
        DB.emit(request.method, request, response);
    } else if (url.parse(request.url).pathname === '/api/ss') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        let stat = Stat.STAT ? Stat.STAT : STAT;
        response.end(JSON.stringify(stat));
    } else if (url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./fetch.html');
        response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        response.end(html);
    }
}).listen(5000);

const COMMAND = {STOP: 'sd(\\s+\\d+)?', COMMIT: 'sc(\\s+\\d+)?', STAT: 'ss(\\s+\\d+)?'};

function Stop(x) {
    if (Stop.promise)
        clearTimeout(Stop.timer);
    Stop.promise = new Promise((resolve, reject) => {
            Stop.reject = reject;
            Stop.timer = setTimeout(() => {
                console.log('Finishing process...');
                process.stdin.unref();
                server.close();
            }, x * 1000);
            return Stop.timer;
        }
    );
    return Stop.promise;
}

function Commit(x) {
    if (Commit.promise)
        clearInterval(Commit.timer);
    Commit.promise = new Promise((resolve, reject) => {
            Commit.reject = reject;
            Commit.timer = setInterval(() => {
                console.log('Committing...');
                if (STAT)
                    STAT.commit++;
            }, x * 1000);
            return Commit.timer;
        }
    );
    Commit.timer.unref();
    return Commit.promise;
}

function Stat(x) {
    if (Stat.promise)
        clearInterval(Stat.timer);
    Stat.promise = new Promise((resolve, reject) => {
            STAT = {start: new Date(), finish: null, request: 0, commit: 0}
            Stat.reject = reject;
            Stat.timer = setInterval(() => {
                console.log('Logging statistics...');
                Stat.start = new Date();
                if (STAT) {
                    STAT.finish = new Date();
                    Stat.STAT = STAT;
                }
                STAT = {start: new Date(), finish: null, request: 0, commit: 0}
            }, x * 1000);
            Stat.timer.unref();
            return Stat.timer;
        }
    );
    Stat.timer.unref();
    return Stat.promise;
}

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let command = null;
    while ((command = process.stdin.read()) != null) {
        command = command.trim();
        if (command.match(COMMAND.STOP)) {
            let x = command.match('\\d');
            if (x) {
                x = parseInt(command.substring(x.index));
                if (x > -1) {
                    console.log('Server will be stopped in ' + x + ' seconds...');
                    Stop(x).catch(reason => {
                        console.log(reason);
                        clearTimeout(Stop.timer);
                    });
                }
            } else {
                if (Stop.promise)
                    Stop.reject('Stopping server cancelled.');
            }
        } else if (command.match(COMMAND.COMMIT)) {
            let x = command.match('\\d');
            if (x) {
                x = parseInt(command.substring(x.index));
                if (x > -1) {
                    console.log('Starting auto-commit every ' + x + ' seconds...');
                    Commit(x).catch(reason => {
                        console.log(reason);
                        clearInterval(Commit.timer);
                    });
                }
            } else {
                if (Commit.promise)
                    Commit.reject('Auto-commit stopped.');
            }
        } else if (command.match(COMMAND.STAT)) {
            let x = command.match('\\d');
            if (x) {
                x = parseInt(command.substring(x.index));
                if (x > -1) {
                    console.log('Starting statistics logging every ' + x + ' seconds...');
                    Stat(x).catch(reason => {
                        console.log(reason);
                        clearInterval(Stat.timer);
                    });
                }
            } else {
                if (Stat.promise)
                    Stat.reject('Statistics logging stopped.');
            }
        } else {
            console.log('No such command "' + command + '"\n');
        }
    }
})

console.log('Server is running at http://localhost:5000/ ');