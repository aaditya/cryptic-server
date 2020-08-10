const Question = require('../../models/questions');

const deleteQuestionHandler = async (req, res, next) => {
    try {
        let { levelId, qId } = req.body;
        if (!levelId || !qId) {
            return res.status(400).json({ "message": "Details invalid" });
        }

        let levelInfo = await Question.findOne({ _id: levelId });
        if (!levelInfo) {
            return res.status(400).json({ "message": "Level info does not exist" });
        }


        let existinngQues = levelInfo.questions.find(q => q._id == qId);
        if (!existinngQues) {
            return res.status(400).json({ "message": "Question does not exist" });
        }

        await Question.findOneAndUpdate({ _id: levelId }, { $pull: { questions: { _id: qId } } });

        return res.status(200).json({ "message": "Question Deleted" });
    } catch (err) {
        next(err);
    }
}

module.exports = deleteQuestionHandler;