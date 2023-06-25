import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {Vacancy} = init(seq);

let vacancies = Router();
vacancies.get('/', (req, res) => {
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Vacancy.findAll({})
            .then(result => resolve(result.map(e => e.dataValues)))
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(data => res.render('vacancies', {layout: null, data}))
        .catch(error => res.render('vacancies', {layout: null, error}));
});
vacancies.post('/add', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Vacancy.create(body)
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/vacancies'))
        .catch(error => res.render('vacancies', {layout: null, error}));
});
vacancies.post('/update', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Vacancy.update(body, {where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/vacancies'))
        .catch(error => res.render('vacancies', {layout: null, error}));
});
vacancies.post('/delete', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Vacancy.destroy({where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/vacancies'))
        .catch(error => res.render('vacancies', {layout: null, error}));
});

export default vacancies;