import express from 'express';
import session from 'express-session';
import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import {fileURLToPath} from 'url';

let app = express();

passport.use(new GoogleStrategy({
    clientID: '167244967834-r9stfrlu9k33qpivt96snlfkk5nmg571.apps.googleusercontent.com',
    clientSecret: '***********************************',
    callbackURL: 'http://localhost:3000/oauth/google/callback'
}, (token, refreshToken, profile, done) => {
    done(null, {profile, token});
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(session({resave: false, saveUninitialized: false, secret: '12345'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => res.sendFile(fileURLToPath(new URL('./login.html', import.meta.url))));

app.get('/oauth/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/oauth/google/callback', passport.authenticate('google', {
    successRedirect: '/resource',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/resource', (req, res, next) => {
    if (!req.user)
        res.sendStatus(401);
    else next();
});
app.get('/resource', (req, res) => res.send(`RESOURCE, user - ${req.user.profile.displayName}`));

app.use('/*', (req, res) => res.sendStatus(404));

app.listen(3000);