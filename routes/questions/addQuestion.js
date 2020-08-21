const bcrypt = require('bcrypt');

const Question = require('../../models/questions');

const addQuestionHandler = async (req, res, next) => {
    try {
        let { levelId, question, answer, hints, type } = req.body;
        if (!levelId || !question || !answer || !type) {
            return res.status(400).json({ "message": "Details invalid" });
        }

        let levelInfo = await Question.findOne({ _id: levelId });
        if (!levelInfo) {
            return res.status(400).json({ "message": "Level info does not exist" });
        }

        if (levelInfo.questions.length === levelInfo.total) {
            return res.status(400).json({ "message": "No more questions can be added to this level" });
        }

        let existinngQues = levelInfo.questions.find(q => q.text.toLowerCase() == question.toLowerCase());
        if (existinngQues) {
            return res.status(400).json({ "message": "Question already exists" });
        }

        let ansHash = await bcrypt.hash(answer.toLowerCase(), 10);

        let qObj = {
            text: question,
            qtype: type,
            hints: hints && hints.map(h => ({
                name: h.name,
                data: h.data
            })),
            answer: ansHash
        }

        await Question.findOneAndUpdate({ _id: levelId }, { $push: { questions: qObj } });

        return res.status(200).json({ "message": "Question added" });
    } catch (err) {
        next(err);
    }
}

module.exports = addQuestionHandler;