import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {fileURLToPath} from 'url';
import {
    createAbility,
    findByUsername, registerUser,
    verifyPassword, generateJwtTokens,
    deleteAccessToken, deleteRefreshToken,
    getAccessToken, getRefreshToken,
    saveAccessToken, saveRefreshToken,
    verifyAccessToken, verifyRefreshToken
} from './authjwt.js';
import {users} from './controller/users.js';
import {repos} from './controller/repos.js';
import {commits} from './controller/commits.js';

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/login', (req, res) => res.sendFile(fileURLToPath(new URL('./login.html', import.meta.url))));

app.post('/login', (req, res) => {
    let username = req.body.username, password = req.body.password;
    console.log('Credentials:', {username, password});
    findByUsername(username).then(user => {
        if (!user)
            res.status(404).send('Wrong username');
        else verifyPassword(password, user).then(matched => {
            if (!matched)
                res.status(401).send('Wrong password');
            else {
                let {accessToken, refreshToken} = generateJwtTokens(user);
                Promise.all([
                    saveAccessToken(user.id, accessToken).then(() => res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        sameSite: 'strict'
                    })).catch(error => res.status(500).send(`Error: ${error.message}`)),
                    saveRefreshToken(user.id, refreshToken).then(() => res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        sameSite: 'strict'
                    })).catch(error => res.status(500).send(`Error: ${error.message}`))]
                ).then(() => res.redirect('/ability'));
            }
        }).catch(error => res.status(400).send(`Error: ${error.message}`));
    }).catch(error => res.status(400).send(`Error: ${error.message}`));
});

app.get('/register', (req, res) => res.sendFile(fileURLToPath(new URL('./register.html', import.meta.url))));

app.post('/register', (req, res) => {
    let username = req.body.username,
        email = req.body.email,
        password = req.body.password;
    console.log('Credentials:', {username, password});
    findByUsername(username).then(user => {
        if (user)
            res.status(409).send('User already exists');
        else registerUser(username, email, password)
            .then(() => res.redirect('/login'))
            .catch(error => res.status(400).send(`Error: ${error.message}`));
    }).catch(error => res.status(400).send(`Error: ${error.message}`));
});

app.use((req, res, next) => {
    let authorization = (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) ?
        req.headers.authorization.substring('Bearer '.length) : req.cookies.accessToken;
    if (authorization) {
        try {
            let payload = verifyAccessToken(authorization);
            if (!payload)
                res.sendStatus(401);
            if (!getAccessToken(payload.id))
                res.sendStatus(401);
            req.payload = payload;
            next();
        } catch (error) {
            res.status(401).send(`Error: ${error.message}`);
        }
    } else {
        req.payload = {role: 'GUEST'};
        next();
    }
});

app.get('/refresh-token', (req, res) => {
    if (req.cookies.refreshToken) {
        try {
            let payload = verifyRefreshToken(req.cookies.refreshToken);
            if (!getRefreshToken(payload.id))
                res.sendStatus(401);
            let {accessToken, refreshToken} = generateJwtTokens(payload);
            Promise.all([
                saveAccessToken(payload.id, accessToken).then(() => res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    sameSite: 'strict'
                })).catch(error => res.status(500).send(`Error: ${error.message}`)),
                saveRefreshToken(payload.id, refreshToken).then(() => res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict'
                })).catch(error => res.status(500).send(`Error: ${error.message}`))]
            ).then(() => res.send('Tokens refreshed successfully!'));
        } catch (error) {
            res.status(401).send(`Error: ${error.message}`);
        }
    } else res.status(401).send('Invalid refresh token');
});

app.get('/logout', (req, res) => {
    try {
        let payload = verifyRefreshToken(req.cookies.refreshToken);
        Promise.all([req.cookies.refreshToken ? deleteRefreshToken(payload.id).then(() => res.clearCookie('refreshToken'))
            .catch(error => res.status(500).send(`Error: ${error.message}`)) : undefined,
            deleteAccessToken(req.payload.id).then(() => res.clearCookie('accessToken'))
                .catch(error => res.status(500).send(`Error: ${error.message}`))])
            .then(() => res.redirect('/login'));
    } catch (error) {
        res.status(401).send(`Error: ${error.message}`);
    }
});

app.use((req, res, next) => {
    let ability = createAbility(req.payload);
    if (!ability)
        res.sendStatus(500);
    else {
        req.ability = ability;
        next();
    }
})

app.get('/ability', (req, res) => {
    res.json(req.ability.rules);
})

app.use('/api/users', users);
app.use('/api/repos', repos);
app.use('/api/repos', commits);

app.use('/*', (req, res) => res.sendStatus(404));

app.listen(3000);