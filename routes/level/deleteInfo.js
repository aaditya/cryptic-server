const Question = require('../../models/questions');

const deleteLevelHandler = async (req, res, next) => {
    try {
        let { qid } = req.body;
        if (!qid) {
            return res.status(400).json({ "message": "Details invalid" });
        }

        let levels = await Question.findOne({ _id: qid });
        if (!levels) {
            return res.status(400).json({ "message": "Level Info does not exist" });
        }

        await Question.findOneAndDelete({ _id: qid });

        return res.status(200).json({ "message": "Level Info Deleted" });
    } catch (err) {
        next(err);
    }
}

module.exports = deleteLevelHandler;