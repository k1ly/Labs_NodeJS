import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {Office} = init(seq);

let offices = Router();
offices.get('/', (req, res) => {
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Office.findAll({})
            .then(result => resolve(result.map(e => e.dataValues)))
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(data => res.render('offices', {layout: null, data}))
        .catch(error => res.render('offices', {layout: null, error}));
});
offices.post('/add', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Office.create(body)
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/offices'))
        .catch(error => res.render('offices', {layout: null, error}));
});
offices.post('/update', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Office.update(body, {where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/offices'))
        .catch(error => res.render('offices', {layout: null, error}));
});
offices.post('/delete', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Office.destroy({where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/offices'))
        .catch(error => res.render('offices', {layout: null, error}));
});

export default offices;