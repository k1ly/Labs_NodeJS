import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {Repo, Commit} = init(seq);

let commits = Router();
commits.get('/:id/commits', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('read', result))
                        res.sendStatus(403);
                    else Commit.findAll({where: {repo: result.id}})
                        .then(result => res.json(result.map(e => e.dataValues)))
                        .catch(err => res.status(500).send(err.message));
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});
commits.get('/:id/commits/:commitId', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('read', result))
                        res.sendStatus(403);
                    else Commit.findOne({where: {repo: result.id, id: req.params.commitId}})
                        .then(result => result ? res.sendStatus(200) : res.sendStatus(404))
                        .catch(err => res.status(500).send(err.message));
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
    seq.authenticate().then(() => {

    }).catch(err => res.status(500).send(err.message));
});
commits.post('/:id/commits', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('create', result))
                        res.sendStatus(403);
                    else Commit.create(req.body)
                        .then(result => result ? res.json(result.dataValues) : res.sendStatus(400))
                        .catch(err => res.status(500).send(err.message));
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});
commits.put('/:id/commits/:commitId', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('update', result))
                        res.sendStatus(403);
                    else Commit.update(req.body, {where: {repo: result.id, id: req.params.commitId}})
                        .then(([number]) => number === 1 ? res.sendStatus(200) : res.sendStatus(400))
                        .catch(err => res.status(500).send(err.message));
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});
commits.delete('/:id/commits/:commitId', (req, res) => {
    seq.authenticate().then(() => {
        Repo.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('delete', result))
                        res.sendStatus(403);
                    else Commit.destroy({where: {repo: result.id, id: req.params.commitId}})
                        .then(number => number === 1 ? res.sendStatus(200) : res.sendStatus(404))
                        .catch(err => res.status(500).send(err.message));
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});

export {commits};