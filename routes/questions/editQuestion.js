const bcrypt = require('bcrypt');

const Question = require('../../models/questions');

const editQuestionHandler = async (req, res, next) => {
    try {
        let { levelId, qId, question, answer, hints, type } = req.body;
        if (!levelId || !qId || !question || !type || !hints || hints.length === 0) {
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

        let qObj = {
            text: question,
            qtype: type,
            hints: hints.map(h => ({
                name: h.name,
                data: h.data
            })),
        }

        if (answer) {
            qObj.answer = await bcrypt.hash(answer.toLowerCase(), 10);
        }

        await Question.findOneAndUpdate({ _id: levelId, "questions._id": qId }, { $set: { "questions.$": qObj } });

        return res.status(200).json({ "message": "Question Updated" });
    } catch (err) {
        next(err);
    }
}

module.exports = editQuestionHandler;