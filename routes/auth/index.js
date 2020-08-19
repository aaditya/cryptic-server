const { Router: er } = require('express');
const passport = require('passport');
const multer = require('multer')

const router = er();

const tokenVerify = require('./token');
const adminCheck = (req, res, next) => {
    if (req.info.access !== "admin") {
        return res.status(403).json({ "message": "Not Authorized" });
    }
    next();
}

// Passport Config
passport.use(require('./strategies/local'));
passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (user, done) { done(null, user); });

router.post('/login', require('./login'));

router.post('/register', require('./register'));

router.post('/resend', require('./resend'));

router.get('/verify', require('./verify'));

router.post('/forgot', require('./forgot'));

router.post('/set-password', require('./setPassword'));

const upload = multer({ storage: multer.memoryStorage() });
router.post('/invite', tokenVerify, adminCheck, upload.single('emails'), require('./invite'));

module.exports = router;