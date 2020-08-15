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

router.post('/info', require('./addInfo'));

router.put('/info', require('./editInfo'));

router.delete('/info', require('./deleteInfo'));

module.exports = router;