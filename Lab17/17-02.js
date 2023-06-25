const redis = require('ioredis');

let client = new redis({
    host: 'redis-11907.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 11907,
    password: '********************************'
});

client.on('ready', () => {
    let setStart = new Date;
    for (let i = 0; i < 10000; i++) {
        client.set(`${i}`, `set${i}`);
    }
    let setEnd = new Date - setStart;
    console.log(`Время затраченное на set: ${new Date(setEnd).getMilliseconds()}`);

    let getStart = new Date;
    for (let i = 0; i < 10000; i++) {
        client.get(`${i}`);
    }
    let getEnd = new Date - getStart;
    console.log(`Время затраченное на get: ${new Date(getEnd).getMilliseconds()}`);

    let delStart = new Date;
    for (let i = 0; i < 10000; i++) {
        client.del(`${i}`);
    }
    let delEnd = new Date - delStart;
    console.log(`Время затраченное на del: ${new Date(delEnd).getMilliseconds()}`);

    client.quit();
})