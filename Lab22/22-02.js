import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {DigestStrategy} from 'passport-http';
import {findByUsername} from './auth.js';

let app = express();
app.use(cookieParser());

passport.use(new DigestStrategy({qop: 'auth'}, (username, done) => {
    console.log('Credentials:', {username});
    let user = findByUsername(username);
    if (!user)
        return done(null, false, {message: 'Wrong username or password'});
    else
        return done(null, user.username, user.password);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(session({resave: false, saveUninitialized: false, secret: '12345'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res, next) => {
    if (req.cookies.logout) {
        delete req.headers.authorization;
        res.clearCookie('logout');
    }
    next();
}, passport.authenticate('digest'), (req, res) => {
    delete req.session.logout;
    res.send('Logged in');
});

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.cookie('logout', true, {httpOnly: true, sameSite: 'strict'});
    res.send('Logged out');
});

app.get('/resource', (req, res, next) => {
    if (!req.user || req.session.logout || req.cookies.logout)
        res.redirect('/login');
    else next();
});
app.get('/resource', (req, res) => res.send('RESOURCE'));

app.use('/*', (req, res) => res.sendStatus(404));

app.listen(3000);