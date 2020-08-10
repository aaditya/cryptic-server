const Question = require('../../models/questions');

const addLevelHandler = async (req, res, next) => {
    try {
        let { levelNum, qCount } = req.body;
        if (!levelNum || !qCount) {
            return res.status(400).json({ "message": "Details invalid" });
        }

        let levels = await Question.findOne({ level: levelNum });
        if (levels) {
            return res.status(400).json({ "message": "Level Info already exists" });
        }

        await new Question({
            level: levelNum,
            total: qCount
        }).save();

        return res.status(200).json({ "message": "Level Info Saved" });
    } catch (err) {
        next(err);
    }
}

module.exports = addLevelHandler;