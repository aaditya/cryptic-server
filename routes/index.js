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

// Questions
router.use('/questions', require('./questions'));

router.use((err, req, res, next) => {
    // Do something with this data
    let data = JSON.stringify(err, null, 4);
    res.status(500).json({ "message": "Server Error. Please Try Again" });
});

module.exports = router;
