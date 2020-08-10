const { Router: er } = require('express');

const router = er();

// Protected Routes
const tokenVerify = require('../auth/token');
router.use(tokenVerify);
router.use((req, res, next) => {
    if (req.info.access !== "admin") {
        return res.status(403).json({ "message": "Not Authorized" });
    }
    next();
})

router.get('/info', require('./getInfo'));

router.post('/info', require('./addInfo'));

router.put('/info', require('./editInfo'));

module.exports = router;