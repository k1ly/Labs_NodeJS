import {createClient} from 'redis';

let redis = createClient({
    password: '********************************',
    socket: {
        host: 'redis-12330.c250.eu-central-1-1.ec2.cloud.redislabs.com',
        port: 12330
    }
});

export default redis;