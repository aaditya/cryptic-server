const Level = require('../../models/levelInfo');

const getLevelHandler = async (req, res, next) => {
    try {
        const levels = await Level.find({}, { __v: 0 });
        if (!levels) {
            return res.status(200).json({ "message": "No Levels in System" });
        }
        res.status(200).json({ "data": levels })
    } catch (err) {
        next(err);
    }
}

module.exports = getLevelHandler;