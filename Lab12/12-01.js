const http = require('http');
const fs = require('fs');
const rpcws = require('rpc-websockets');

let server = http.createServer((req, res) => {
        fs.access('StudentList.json', fs.constants.F_OK, err => {
            if (err) {
                fs.open('./StudentList.json', 'w', (err, fd) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    } else {
                        fs.writeFile('StudentList.json', JSON.stringify([]), err => {
                            if (err) {
                                res.writeHead(500, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify(err));
                            } else this.processStudentList();
                        })
                        fs.watch('StudentList.json', {}, (event, filename) => {
                            rpc.emit('FILE_UPD', filename);
                        })
                    }
                })
            } else this.processStudentList();
        });
        this.processStudentList = () => {
            if (req.method === 'GET' && req.url === '/') {
                fs.readFile('StudentList.json', (err, data) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    } else {
                        let json = JSON.parse(data.toString());
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(json));
                    }
                });
            } else if (req.method === 'GET' && req.url.match('^/\\d+$')) {
                fs.readFile('StudentList.json', (err, data) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    } else {
                        let json = JSON.parse(data.toString());
                        let id = parseInt(req.url.substring(req.url.indexOf('/') + 1));
                        let entry = json.find(o => parseInt(o.id) === id);
                        if (entry) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(entry));
                        } else {
                            res.writeHead(404, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: 1, message: `Student with id ${id} not found`}));
                        }
                    }
                });
            } else if (req.method === 'POST' && req.url === '/') {
                let body = '';
                req.on('data', chunk => body += chunk.toString());
                req.on('end', () => {
                    fs.readFile('StudentList.json', (err, data) => {
                        if (err) {
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        } else {
                            let json = JSON.parse(data.toString());
                            let obj = JSON.parse(body);
                            if (json.find(o => o.id === obj.id)) {
                                res.writeHead(400, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({error: 2, message: `Student with id ${obj.id} already exists`}));
                            } else {
                                json.push(obj);
                                fs.writeFile('StudentList.json', JSON.stringify(json), err => {
                                    if (err) {
                                        res.writeHead(500, {'Content-Type': 'application/json'});
                                        res.end(JSON.stringify(err));
                                    } else {
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        res.end(JSON.stringify(obj));
                                    }
                                })
                            }
                        }
                    });
                });
            } else if (req.method === 'PUT' && req.url === '/') {
                let body = '';
                req.on('data', chunk => body += chunk.toString());
                req.on('end', () => {
                    fs.readFile('StudentList.json', (err, data) => {
                        if (err) {
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        } else {
                            let json = JSON.parse(data.toString());
                            let obj = JSON.parse(body);
                            let entry = json.find(o => parseInt(o.id) === parseInt(obj.id));
                            if (entry) {
                                json[json.indexOf(entry)] = obj;
                                fs.writeFile('StudentList.json', JSON.stringify(json), err => {
                                    if (err) {
                                        res.writeHead(500, {'Content-Type': 'application/json'});
                                        res.end(JSON.stringify(err));
                                    } else {
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        res.end(JSON.stringify(obj));
                                    }
                                })
                            } else {
                                res.writeHead(404, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({error: 1, message: `Student with id ${obj.id} not found`}));
                            }
                        }
                    });
                });
            } else if (req.method === 'DELETE' && req.url.match('^/\\d+$')) {
                fs.readFile('StudentList.json', (err, data) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    } else {
                        let json = JSON.parse(data.toString());
                        let id = parseInt(req.url.substring(req.url.indexOf('/') + 1));
                        let entry = json.find(o => parseInt(o.id) === id);
                        if (entry) {
                            json.splice(json.indexOf(entry), 1);
                            fs.writeFile('StudentList.json', JSON.stringify(json), err => {
                                if (err) {
                                    res.writeHead(500, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify(err));
                                } else {
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify(entry));
                                }
                            })
                        } else {
                            res.writeHead(404, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: 1, message: `Student with id ${id} not found`}));
                        }
                    }
                });
            } else if (req.method === 'POST' && req.url === '/backup') {
                setTimeout(() => {
                    let date = new Date();
                    let dateString = `${date.getFullYear()}`
                        + `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}`
                        + `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`
                        + `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}`
                        + `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
                        + `${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`;
                    fs.copyFile('StudentList.json', `${dateString}_StudentList.json`, err => {
                        if (err) {
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        } else {
                            fs.watch(`${dateString}_StudentList.json`, {}, (event, filename) => {
                                rpc.emit('FILE_UPD', filename);
                            })
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end('Backup created');
                        }
                    })
                }, 2000);
            } else if (req.method === 'DELETE' && req.url.match('^/backup/\\d{4}\\d{2}\\d{2}$')) {
                let dateString = req.url.substring('/backup/'.length);
                let paramDate = new Date(Date.parse(`${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}T00:00:00`));
                fs.readdir('./', (err, files) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    } else {
                        try {
                            for (let file of files) {
                                if (file.endsWith('_StudentList.json')) {
                                    let fileDate = new Date(Date.parse(`${file.substring(0, 4)}-${file.substring(4, 6)}-${file.substring(6, 8)}`
                                        + `T${file.substring(8, 10)}:${file.substring(10, 12)}:${file.substring(12, 14)}`));
                                    if (paramDate > fileDate)
                                        fs.unlinkSync(file);
                                }
                            }
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end('Backups deleted');
                        } catch (err) {
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        }
                    }
                })
            } else if (req.method === 'GET' && req.url === '/backup') {
                fs.readdir('./', (err, files) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    } else {
                        try {
                            let list = [];
                            for (let file of files) {
                                if (file.endsWith('_StudentList.json')) {
                                    let data = fs.readFileSync(file);
                                    list.push({file: file, data: JSON.parse(data.toString())});
                                }
                            }
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(list));
                        } catch (err) {
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        }
                    }
                });
            }
        }
    }
).listen(3000);

let rpc = new rpcws.Server({port: 4000, host: 'localhost'});
rpc.event('FILE_UPD');

