import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {Profession} = init(seq);

let professions = Router();
professions.get('/', (req, res) => {
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Profession.findAll({})
            .then(result => resolve(result.map(e => e.dataValues)))
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(data => res.render('professions', {layout: null, data}))
        .catch(error => res.render('professions', {layout: null, error}));
});
professions.post('/add', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Profession.create(body)
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/professions'))
        .catch(error => res.render('professions', {layout: null, error}));
});
professions.post('/update', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Profession.update(body, {where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/professions'))
        .catch(error => res.render('professions', {layout: null, error}));
});
professions.post('/delete', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Profession.destroy({where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/professions'))
        .catch(error => res.render('professions', {layout: null, error}));
});

export default professions;