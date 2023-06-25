const redis = require('ioredis');

let client = new redis({
    host: 'redis-11907.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 11907,
    password: '********************************'
});

client.on('ready', () => {
    let hsetStart = new Date;
    for (let i = 0; i < 10000; i++) {
        client.hset(`${i}`, {id: i, val: `val-${i}`}, (err, result) => {
        });
    }
    let hsetEnd = new Date - hsetStart;
    console.log(`Время затраченное на hset: ${new Date(hsetEnd).getMilliseconds()}`);

    let hgetStart = new Date;
    for (let i = 0; i < 10000; i++) {
        client.hget(`${i}`, 'id', (err, result) => {
        });
    }
    let hgetEnd = new Date - hgetStart;
    console.log(`Время затраченное на hget: ${new Date(hgetEnd).getMilliseconds()}`);

    for (let i = 0; i < 10000; i++) {
        client.hdel(`${i}`);
    }

    client.quit();
})