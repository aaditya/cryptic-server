const Question = require('../../models/questions');

const getLevelHandler = async (req, res, next) => {
    try {
        const levels = await Question.find({}, { _id: 1, level: 1, total: 1 });
        if (!levels) {
            return res.status(200).json({ "message": "No Levels in System" });
        }
        res.status(200).json({ "data": levels })
    } catch (err) {
        next(err);
    }
}

module.exports = getLevelHandler;