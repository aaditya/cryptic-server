const { Router: er } = require('express');

const router = er();

router.get('/status', (req, res) => {
    res.json({
        "date": new Date(),
        "host": req.get('host')
    })
});

// Authentication APIs
router.use('/auth', require('./auth'));

// Level Info
router.use('/level', require('./level'));

module.exports = router;
