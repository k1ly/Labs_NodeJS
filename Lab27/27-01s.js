import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import {ServerDH} from './27-01m.js';

let app = express();
app.use(express.json());

let serverDH;

app.get('/', (req, res) => {
    serverDH = new ServerDH(1024, 3);
    res.json(serverDH.context);
});

app.post('/resource', (req, res) => {
    let clientContext = req.body;
    if (!clientContext)
        res.status(409).send('Client context not found');
    else {
        let cipher = crypto.createCipher('aes256', serverDH.createSecret(clientContext).toString());
        let encrypted = cipher.update(fs.readFileSync('27-01.txt', 'utf-8'), 'utf-8', 'hex') +
            cipher.final('hex');
        fs.writeFileSync('27-01encrypted.txt', encrypted);
        res.send(encrypted);
    }
});

app.listen(3000);