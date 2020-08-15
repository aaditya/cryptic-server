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

router.get('/play', require('./getNextQuestion'));

router.post('/play', require('./playQuestion'));

router.get('/leaderboard', require('./leaderboard'));

router.use(adminCheck);

router.get('/leaderboard-csv', require('./leaderboardCsv'));

router.get('/set', require('./getQuestion'));

router.post('/set', require('./addQuestion'));

router.put('/set', require('./editQuestion'));

router.delete('/set', require('./deleteQuestion'));

module.exports = router;