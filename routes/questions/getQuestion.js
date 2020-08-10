const Question = require('../../models/questions');

const getQuestionHandler = async (req, res, next) => {
    try {
        let { levelId } = req.query;
        if (!levelId) {
            return res.status(400).json({ "message": "Details invalid" });
        }

        let levelInfo = await Question.findOne({ _id: levelId });
        if (!levelInfo) {
            return res.status(400).json({ "message": "Level info does not exist" });
        }

        return res.status(200).json({ "message": "Questions", "data": levelInfo.questions });
    } catch (err) {
        next(err);
    }
}

module.exports = getQuestionHandler;
