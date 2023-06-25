import express from 'express';
import swagger from 'swagger-ui-express';
import fs from 'fs';

let app = express();
app.use(express.json());

const apiDocs = await import('./swagger.json', {assert: {type: 'json'}});
app.use('/api', swagger.serve, swagger.setup(apiDocs.default));

const readPhonebook = () => JSON.parse(fs.readFileSync('./phonebook.json').toString());
const writePhonebook = phonebook => fs.writeFileSync('./phonebook.json', JSON.stringify(phonebook, null, 2));

app.get('/TS', (req, res) => {
    try {
        res.json(readPhonebook());
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post('/TS', (req, res) => {
    try {
        let {id, name, phoneNumber} = req.body;
        let phonebook = readPhonebook();
        if (phonebook.find(phone => phone.id === id))
            res.sendStatus(409);
        else {
            phonebook.push({id, name, phoneNumber});
            writePhonebook(phonebook);
            res.sendStatus(201);
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.put('/TS', (req, res) => {
    try {
        let {id, name, phoneNumber} = req.body;
        let phonebook = readPhonebook();
        let phone = phonebook.find(phone => phone.id === id);
        if (!phone)
            res.sendStatus(404);
        else {
            Object.assign(phone, {id, name, phoneNumber});
            writePhonebook(phonebook);
            res.sendStatus(200);
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.delete('/TS', (req, res) => {
    try {
        let {id} = req.body;
        let phonebook = readPhonebook();
        let phoneIndex = phonebook.findIndex(phone => phone.id === id);
        if (phoneIndex < 0)
            res.sendStatus(404);
        else {
            phonebook.splice(phoneIndex, 1);
            writePhonebook(phonebook);
            res.sendStatus(200);
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(3000);