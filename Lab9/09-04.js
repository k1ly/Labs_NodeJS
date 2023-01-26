const http = require('http');

const server = http.createServer().listen(3000);

server.on('request', (req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk.toString('utf8'));
    req.on('end', () => {
        let json = JSON.parse(data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            __comment: 'Ответ. Лабораторная работа 9',
            x_plus_y: json.x + json.y,
            concat_s_o: json.s + ': ' + json.o.surname + ', ' + json.o.name,
            length_m: json.m.length
        }));
    });
})

let options = {
    host: 'localhost',
    path: '/path',
    port: 3000,
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
}

const request = http.request(options, res => {
    console.log('Response code: ', res.statusCode);
    console.log('Response message: ', res.statusMessage);
    console.log('Server IP: ', res.socket.remoteAddress);
    console.log('Server port: ', res.socket.remotePort);
    let data = '';
    res.on('data', chunk => console.log('data -> Body: ', data += chunk.toString('utf8')))
    res.on('end', () => console.log('end -> Body: ', JSON.parse(data)))
})

request.on('error', e => console.error('Error: ', e))

let data = {
    __comment: 'Запрос. Лабораторная работа 9',
    x: 1,
    y: 2,
    s: 'Сообщение',
    o: {'surname': 'Лысков', 'name': 'Кирилл'},
    m: ['a', 'b', 'c', 'd']
}

request.end(JSON.stringify(data));

