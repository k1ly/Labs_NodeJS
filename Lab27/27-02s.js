import express from 'express';
import fs from 'fs';
import {ServerSign} from './27-02m.js';

let app = express();

app.get('/student', (req, res) => {
    if (req.headers['accept'] !== 'application/json')
        res.status(409).send('Invalid request');
    else new ServerSign().createSignContext(fs.createReadStream('./27-01.txt'), signContext => {
        console.log(signContext.signature);
        res.send(signContext)
    });
});

app.listen(3000);