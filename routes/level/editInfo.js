const Question = require('../../models/questions');

const editLevelHandler = async (req, res, next) => {
    try {
        let { qid, qcount } = req.body;
        if (!qid || !qcount) {
            return res.status(400).json({ "message": "Details Invalid" });
        }
        let level = await Question.findOne({ _id: qid });
        if (!level) {
            return res.status(404).json({ "message": "Level Info not found" });
        }

        await Question.findOneAndUpdate({ _id: qid }, { $set: { total: qcount } });

        return res.status(200).json({ "message": "Info Updated" });
    } catch (err) {
        next(err);
    }
}

module.exports = editLevelHandler;