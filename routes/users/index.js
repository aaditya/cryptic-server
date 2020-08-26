const { Router: er } = require('express');

const router = er();

// Protected Routes
const tokenVerify = require('../auth/token');

const adminCheck = (req, res, next) => {
    if (req.info.access !== "admin") {
        return res.status(403).json({ "message": "Not Authorized" });
    }
    next();
}

router.use(tokenVerify);
router.use(adminCheck);

router.get('/info', require('./getUsers'));

router.post('/disable', require('./disableUser'));

router.post('/grant', require('./grantAdmin'));

router.get('/kill', require('./getKillswitch'));

router.post('/kill', require('./setKillswitch'));

module.exports = router;