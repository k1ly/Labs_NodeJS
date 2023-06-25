import seq from './sequelize.js';
import redis from './redis.js';
import jwt from 'jsonwebtoken';
import {compare, hash} from 'bcrypt';
import {init} from './model/model.js';

redis.connect();

const accessTokenKey = 'access12345';
const refreshTokenKey = 'refresh12345';

const {User} = init(seq);

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
        type: 'access'
    }, accessTokenKey, {expiresIn: '10m'}),
    refreshToken: jwt.sign({
        id: payload.id,
        username: payload.username,
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

const getAllTokens = async () => {
    let keys = await redis.keys('*');
    let tokens = [];
    for (const key of keys) {
        tokens.push({key, value: await redis.get(key)})
    }
    return tokens;
}

export {
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
    deleteRefreshToken,
    getAllTokens
}