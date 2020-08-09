const { Router: er } = require('express');
const passport = require('passport');

const router = er();

// Passport Config
passport.use(require('./strategies/local'));
passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (user, done) { done(null, user); });

router.post('/login', passport.authenticate('local'), require('./login'));

router.post('/register', require('./register').local);

module.exports = router;