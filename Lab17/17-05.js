const redis = require('ioredis');

let client1 = new redis({
    host: 'redis-11907.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 11907,
    password: '********************************'
});

client1.on('message', (channel, message) => {
    console.log(`channel: ${channel}`);
    console.log(`message: ${message}`);
})
client1.subscribe('channel-1');

let client2 = new redis({
    host: 'redis-11907.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 11907,
    password: 'RXly1V2pBhZOwgLDEDPQKLJbZvLxSvF1'
});
let interval = setInterval(() => {
    client2.publish('channel-1', 'Hello world!');
}, 2000)
setTimeout(() => {
    clearInterval(interval);
}, 11000)