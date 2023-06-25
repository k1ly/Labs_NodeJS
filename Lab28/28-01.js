import express from 'express';
import {createClient} from 'webdav';
import fs from 'fs';

let client = createClient('https://webdav.yandex.ru', {
    username: '************',
    password: '****************'
});

let app = express();

app.post('/md/:path', async (req, res) => {
    let path = `/${req.params.path}`;
    try {
        if (await client.exists(path))
            res.status(408).send('Directory exists');
        else {
            await client.createDirectory(path);
            res.status(200).send('Directory created');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/rd/:path', async (req, res) => {
    let path = `/${req.params.path}`;
    try {
        if (await client.exists(path)) {
            await client.deleteFile(path);
            res.status(200).send('Directory removed');
        } else res.status(404).send('Directory doesn\'t exist');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/up/:file', async (req, res) => {
    let file = req.params.file;
    try {
        if (await client.exists(file))
            await client.deleteFile(file);
        if (await client.putFileContents(file, fs.createReadStream(file)))
            res.status(200).send('File uploaded');
        else res.status(408).send('File cannot be uploaded');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/down/:file', async (req, res) => {
    let file = req.params.file;
    try {
        if (await client.exists(file)) {
            client.createReadStream(file).pipe(fs.createWriteStream(file));
            res.status(200).send('File downloaded');
        } else res.status(404).send('File doesn\'t exist');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/del/:file', async (req, res) => {
    let file = req.params.file;
    try {
        if (await client.exists(file)) {
            await client.deleteFile(file);
            res.status(200).send('File deleted');
        } else res.status(404).send('File doesn\'t exist');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/copy/:source/:destination', async (req, res) => {
    let source = req.params.source;
    let destination = req.params.destination;
    try {
        if (await client.exists(source)) {
            await client.copyFile(source, destination);
            res.status(200).send('File copied');
        } else res.status(404).send('File doesn\'t exist');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/move/:source/:destination', async (req, res) => {
    let source = req.params.source;
    let destination = req.params.destination;
    try {
        if (await client.exists(source)) {
            await client.moveFile(source, destination);
            res.status(200).send('File moved');
        } else res.status(404).send('File doesn\'t exist');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000);