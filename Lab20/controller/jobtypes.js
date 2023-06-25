import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {JobType} = init(seq);

let jobtypes = Router();
jobtypes.get('/', (req, res) => {
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => JobType.findAll({})
            .then(result => resolve(result.map(e => e.dataValues)))
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(data => res.render('jobtypes', {layout: null, data}))
        .catch(error => res.render('jobtypes', {layout: null, error}));
});
jobtypes.post('/add', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => JobType.create(body)
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/jobtypes'))
        .catch(error => res.render('jobtypes', {layout: null, error}));
});
jobtypes.post('/update', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => JobType.update(body, {where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/jobtypes'))
        .catch(error => res.render('jobtypes', {layout: null, error}));
});
jobtypes.post('/delete', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => JobType.destroy({where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/jobtypes'))
        .catch(error => res.render('jobtypes', {layout: null, error}));
});

export default jobtypes;