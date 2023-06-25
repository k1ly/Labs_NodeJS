import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {Employee} = init(seq);

let employees = Router();
employees.get('/', (req, res) => {
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Employee.findAll({})
            .then(result => resolve(result.map(e => e.dataValues)))
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(data => res.render('employees', {layout: null, data}))
        .catch(error => res.render('employees', {layout: null, error}));
});
employees.post('/add', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Employee.create(body)
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/employees'))
        .catch(error => res.render('employees', {layout: null, error}));
});
employees.post('/update', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Employee.update(body, {where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/employees'))
        .catch(error => res.render('employees', {layout: null, error}));
});
employees.post('/delete', (req, res) => {
    let body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== ''));
    new Promise((resolve, reject) => seq.authenticate()
        .then(() => Employee.destroy({where: {id: body.id}})
            .then(result => resolve())
            .catch(err => reject(err.message)))
        .catch(err => reject(err.message)))
        .then(() => res.redirect('/employees'))
        .catch(error => res.render('employees', {layout: null, error}));
});

export default employees;