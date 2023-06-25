import express from 'express';
import bodyParser from 'body-parser';
import {create} from 'express-handlebars';
import Contact from './contacts.js';

const contacts = new Contact('./contacts.json');

let app = express();

app.engine('hbs', create({
    extname: 'hbs',
    helpers: {
        buttonCancel: (context, opt) => `<a href="/">${context}</a>`
    }
}).engine);
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));
app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    let data = contacts.find();
    res.render('index', {data});
});
app.get('/add', (req, res) => {
    let data = contacts.find();
    res.render('add', {cancelText: 'Отказаться', disabled: true, data});
});
app.get('/update', (req, res) => {
    let data = contacts.find();
    let entry = contacts.find(parseInt(req.query.id));
    res.render('update', {cancelText: 'Отказаться', disabled: true, data, entry});
});
app.post('/add', (req, res) => {
    try {
        let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
        contacts.create(body);
    } catch (error) {
        console.error(error);
    }
    res.redirect('/');
});
app.post('/update', (req, res) => {
    try {
        let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
        contacts.update(parseInt(body.id), body);
    } catch (error) {
        console.error(error);
    }
    res.redirect('/');
});
app.post('/delete', (req, res) => {
    try {
        let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
        contacts.destroy(parseInt(body.id));
    } catch (error) {
        console.error(error);
    }
    res.redirect('/');
});

app.listen(3000);