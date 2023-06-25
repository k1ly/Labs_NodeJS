import crypto from 'crypto';
import axios from 'axios';
import fs from 'fs';
import {ClientDH} from './27-01m.js';

axios.get('http://localhost:3000/').then(res => {
    let clientDH = new ClientDH(res.data);
    let secret = clientDH.createSecret(res.data);
    axios.post('http://localhost:3000/resource', clientDH.context).then(res => {
        let decipher = crypto.createDecipher('aes256', secret.toString());
        let decrypted = decipher.update(res.data, 'hex', 'utf-8') + decipher.final('utf-8');
        fs.writeFileSync('27-01decrypted.txt', decrypted);
    }).catch(err => console.error(err));
}).catch(err => console.error(err));