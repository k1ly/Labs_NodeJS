const redis = require('ioredis');

let client = new redis({
    host: 'redis-11907.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 11907,
    password: '********************************'
});

client.on('ready', () => {
    console.log('ready');
    client.quit();
})
client.on('error', err => {
    console.log(err);
})
client.on('connect', () => {
    console.log('connect');
})
client.on('end', () => {
    console.log('end');
})