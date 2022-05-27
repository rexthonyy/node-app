const express = require("express");
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/oauth2/google/success',
    failureRedirect: '/oauth2/google/failed'
}));

router.get('/google/failed', (req, res) => {
    res.send('Something went wrong');
});

router.get('/google/success', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.send('You are logged in');
});

router.get('/google/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send("Logged out");
});

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401);
}

module.exports = router;