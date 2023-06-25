import {Router} from 'express';
import seq from '../sequelize.js';
import {init} from '../model/model.js';

const {User} = init(seq);

let users = Router();
users.get('/', (req, res) => {
    seq.authenticate().then(() => {
        User.findAll({})
            .then(result => {
                if (result.some(user => req.ability.cannot('read', user)))
                    res.sendStatus(403);
                else res.json(result.map(e => {
                    let {password, ...userDto} = e.dataValues;
                    return userDto;
                }));
            }).catch(err => res.status(500).send(err.message))
    }).catch(err => res.status(500).send(err.message));
});
users.get('/:id', (req, res) => {
    seq.authenticate().then(() => {
        User.findOne({where: {id: req.params.id}})
            .then(result => {
                if (result) {
                    if (req.ability.cannot('read', result))
                        res.sendStatus(403);
                    else {
                        let {password, ...userDto} = result.dataValues;
                        res.json(userDto);
                    }
                } else res.sendStatus(404);
            }).catch(err => res.status(500).send(err.message));
    }).catch(err => res.status(500).send(err.message));
});

export {users};