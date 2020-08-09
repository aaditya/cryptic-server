const { Router: er } = require('express');

const router = er();

router.get('/status', (req, res) => {
    res.json({
        "date": new Date(),
        "host": req.get('host')
    })
});

module.exports = router;