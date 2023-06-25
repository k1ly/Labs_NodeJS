import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {Repo} = init(seq);

let repos = Router();
repos.get('/', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findAll({})
            .then(result => {
                if (result.some(repo => req.ability.cannot('read', repo)))
                    res.sendStatus(403);
                else res.json(result.map(e => e.dataValues));
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});
repos.get('/:id', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('read', result))
                        res.sendStatus(403);
                    else res.json(result.dataValues);
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});
repos.post('/', (req, res) => {
    seq.authenticate().then(() => {
        let repo = new Repo();
        repo.name = req.body.name;
        repo.author = (req.body.author ?? 0).toString();
        if (req.ability.cannot('create', repo))
            res.sendStatus(403);
        else Repo.create(req.body)
            .then(result => result ? res.sendStatus(200) : res.sendStatus(400))
            .catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});
repos.put('/:id', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('update', result))
                        res.sendStatus(403);
                    else Repo.update(req.body, {where: {id: req.params.id}})
                        .then(([number]) => number === 1 ? res.sendStatus(200) : res.sendStatus(400))
                        .catch(err => res.status(500).send(err.message));
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});
repos.delete('/:id', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('delete', result))
                        res.sendStatus(403);
                    else Repo.destroy({where: {id: req.params.id}})
                        .then(number => number === 1 ? res.sendStatus(200) : res.sendStatus(404))
                        .catch(err => res.status(500).send(err.message));
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});

export {repos};