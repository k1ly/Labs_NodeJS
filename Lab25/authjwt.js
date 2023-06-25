import seq from './sequelize.js';
import redis from './redis.js';
import jwt from 'jsonwebtoken';
import {compare, hash} from 'bcrypt';
import casl from 'casl';
import {init} from './model/model.js';

redis.connect();

const accessTokenKey = 'access12345';
const refreshTokenKey = 'refresh12345';

const {User} = init(seq);

const createAbility = payload => {
    let {rules, can} = casl.AbilityBuilder.extract();
    can('read', 'Repo');
    can('read', 'Commit');
    switch (payload.role) {
        case 'CLIENT':
            can('read', 'User', {id: payload.id});
            can('create', 'Repo', {author: payload.id});
            can('update', 'Repo', {author: payload.id});
            break;
        case 'ADMIN':
            can('read', 'User');
            can('update', 'Repo');
            can('delete', 'Repo');
            break;
    }
    return new casl.Ability(rules);
}

const findByUsername = async username => {
    await seq.authenticate();
    let result = await User.findOne({where: {username}});
    return result ? result.dataValues : null;
}

const verifyPassword = (password, user) => compare(password, user.password);

const registerUser = async (username, password) => {
    await seq.authenticate();
    let hashed = await hash(password, 10);
    await User.create({username, password: hashed});
}

const generateJwtTokens = payload => ({
    accessToken: jwt.sign({
        id: payload.id,
        username: payload.username,
        role: payload.role,
        type: 'access'
    }, accessTokenKey, {expiresIn: '10m'}),
    refreshToken: jwt.sign({
        id: payload.id,
        username: payload.username,
        role: payload.role,
        type: 'refresh'
    }, refreshTokenKey, {expiresIn: '24h'})
});

const verifyAccessToken = accessToken => jwt.verify(accessToken, accessTokenKey);
const verifyRefreshToken = refreshToken => jwt.verify(refreshToken, refreshTokenKey);

const getAccessToken = id => redis.get(`${id}-access`);
const getRefreshToken = id => redis.get(`${id}-refresh`);

const saveAccessToken = (id, token) => redis.set(`${id}-access`, token, {EX: 60 * 10});
const saveRefreshToken = (id, token) => redis.set(`${id}-refresh`, token, {EX: 60 * 60 * 24});

const deleteAccessToken = id => redis.del(`${id}-access`);
const deleteRefreshToken = id => redis.del(`${id}-refresh`);

export {
    createAbility,
    findByUsername,
    verifyPassword,
    registerUser,
    generateJwtTokens,
    verifyAccessToken,
    verifyRefreshToken,
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
    saveRefreshToken,
    deleteAccessToken,
    deleteRefreshToken
}