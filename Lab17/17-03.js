const redis = require('ioredis');

let client = new redis({
    host: 'redis-11907.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 11907,
    password: '********************************'
});

client.on('ready', () => {
    for (let i = 0; i < 10000; i++) {
        client.set(`incr`, 0);
    }
    let incrStart = new Date;
    for (let i = 0; i < 10000; i++) {
        client.incr(`incr`);
    }
    let incrEnd = new Date - incrStart;
    console.log(`Время затраченное на incr: ${new Date(incrEnd).getMilliseconds()}`);

    let decrStart = new Date;
    for (let i = 0; i < 10000; i++) {
        client.decr(`incr`);
    }
    let decrEnd = new Date - decrStart;
    console.log(`Время затраченное на decr: ${new Date(decrEnd).getMilliseconds()}`);

    client.quit();
})