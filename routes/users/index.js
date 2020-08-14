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

router.post('/info', require('./disableUser'));

module.exports = router;