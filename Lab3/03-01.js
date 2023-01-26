var http = require('http');

const STATES = {NORM: 'norm', STOP: 'stop', TEST: 'test', IDLE: 'idle', EXIT: 'exit'};
var state = STATES.NORM;

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    response.end('Current state: ' + state);
}).listen(5000);

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let command = null;
    while ((command = process.stdin.read()) != null) {
        command = command.trim();
        if (command === STATES.EXIT)
            process.exit(0);
        else if (Object.values(STATES).includes(command)) {
            if (command === state)
                process.stdout.write('Current state is already: ' + state + '\n');
            else {
                process.stdout.write(state + ' --> ' + command + '\n');
                state = command;
            }
        } else {
            process.stdout.write('No such command "' + command + '"\n');
        }
    }
})

console.log('Server is running at http://localhost:5000/ ');