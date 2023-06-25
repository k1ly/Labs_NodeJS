import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import {Strategy} from 'passport-local';
import {fileURLToPath} from 'url';
import {findByUsername, verifyPassword} from './auth.js';

let app = express();
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new Strategy({}, (username, password, done) => {
    console.log('Credentials:', {username, password});
    let user = findByUsername(username);
    if (!user)
        return done(null, false, {message: 'Wrong username'});
    else if (!verifyPassword(password, user))
        return done(null, false, {message: 'Wrong password'});
    else
        return done(null, user);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(session({resave: false, saveUninitialized: false, secret: '12345'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => res.sendFile(fileURLToPath(new URL('./login.html', import.meta.url))));

app.post('/login', passport.authenticate('local', {successRedirect: '/resource', failureRedirect: '/login'}));

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/resource', (req, res, next) => {
    if (!req.user)
        res.sendStatus(401);
    else next();
});
app.get('/resource', (req, res) => res.send(`RESOURCE, user - ${req.user.username}`));

app.use('/*', (req, res) => res.sendStatus(404));

app.listen(3000);