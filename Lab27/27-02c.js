import axios from 'axios';
import {ClientVerify} from './27-02m.js';
import fs from "fs";

axios.get('http://localhost:3000/student', {
    headers: {
        'Accept': 'application/json'
    }
}).then(res => {
        res.data.signature = Buffer.from(res.data.signature);
        new ClientVerify(res.data).verifySignature(fs.createReadStream('./27-01.txt'),
            result => console.log(`Signature ${result ? 'confirmed' : 'not confirmed!'}`))
    }
).catch(error => console.error(error));