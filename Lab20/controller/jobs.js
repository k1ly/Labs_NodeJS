import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {Job} = init(seq);

let jobs = Router();
jobs.get('/', (req, res) => {
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Job.findAll({})
            .then(result => resolve(result.map(e => e.dataValues)))
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(data => res.render('jobs', {layout: null, data}))
        .catch(error => res.render('jobs', {layout: null, error}));
});
jobs.post('/add', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Job.create(body)
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/jobs'))
        .catch(error => res.render('jobs', {layout: null, error}));
});
jobs.post('/update', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Job.update(body, {where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/jobs'))
        .catch(error => res.render('jobs', {layout: null, error}));
});
jobs.post('/delete', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Job.destroy({where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/jobs'))
        .catch(error => res.render('jobs', {layout: null, error}));
});

export default jobs;