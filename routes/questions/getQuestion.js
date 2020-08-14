const Question = require('../../models/questions');

const getQuestionHandler = async (req, res, next) => {
    try {
        let { levelId } = req.query;
        let query = {}
        if (levelId) {
            query._id = levelId;
        }
        
        let levelInfo = await Question.find(query);
        if (!levelInfo) {
            return res.status(400).json({ "message": "Level info does not exist" });
        }

        return res.status(200).json({ "message": "Questions", "data": levelInfo });
    } catch (err) {
        next(err);
    }
}

module.exports = getQuestionHandler;
