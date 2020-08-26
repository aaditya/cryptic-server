const bcrypt = require('bcrypt');
const moment = require('moment');

const Killswitch = require('../../models/killswitch');
const Question = require('../../models/questions');
const User = require('../../models/user');

const playQuestion = async (req, res, next) => {
    try {
        let { levelId, qId, answer } = req.body;
        if (!levelId, !qId, !answer) {
            return res.status(400).json({ "message": "Details Invalid" })
        }

        let killdate = await Killswitch.findOne({ role: 'main' });
        if (moment().isAfter(moment(killdate.activateOn))) {
            return res.status(400).json({ "message": "Hunt has been closed" });
        }

        let levelInfo = await Question.findOne({ _id: levelId });
        if (!levelInfo) {
            return res.status(400).json({ "message": "Level Info Does not exist" });
        }

        let questionInfo = levelInfo.questions.find(q => q._id == qId);
        if (!questionInfo) {
            return res.status(400).json({ "message": "Question Does not exist" });
        }

        let latestLevel = req.info.history.slice(-1)[0];
        if (latestLevel && latestLevel.question.includes(qId)) {
            return res.status(400).json({ "message": "Already Answered" });
        }

        let ansCommpare = await bcrypt.compare(answer, questionInfo.answer);

        if (!ansCommpare) {
            return res.status(200).json({ "message": "Wrong Answer", answer: false });
        }

        res.status(200).json({ "message": "Correct Answer", answer: true });

        if (req.info.history.length === 0) {
            // First Question
            const levelObj = {
                last: levelInfo.level,
                completedOn: new Date(),
                question: [qId]
            }
            await User.findOneAndUpdate({ _id: req.info.id }, { $push: { "history.level": levelObj } });
        } else {
            // Subsequent Question
            const levelObj = {
                last: levelInfo.level,
                completedOn: new Date(),
                question: latestLevel.last === levelInfo.level ? latestLevel.question.concat(qId) : [qId]
            }

            if (latestLevel.last === levelInfo.level) {
                await User.findOneAndUpdate({ _id: req.info.id, "history.level.last": levelInfo.level }, { $set: { "history.level.$": levelObj } });
            } else {
                await User.findOneAndUpdate({ _id: req.info.id }, { $push: { "history.level": levelObj } });
            }
        }

        return true;
    } catch (err) {
        next(err);
    }
}

module.exports = playQuestion;