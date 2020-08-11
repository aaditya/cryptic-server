const moment = require('moment');

const User = require('../../models/user');

const leaderbordHandler = async (req, res, next) => {
    try {
        let users = await User.find({ access: "user" });

        /**
         * Leaderboard Sorting Priority
         * 1. Highest Level
         * 2. Number of questions solved
         * 3. Time taken in total to reach current position
         */

        let board = users.map((user) => {
            let latestLevel = user.history.level.slice(-1)[0];

            let createdStamp = moment(user.createdAt);
            let lastLevelStamp = moment(latestLevel.completedOn);

            // Time Spent from account creation to last level.
            let timeSpent = moment.duration(lastLevelStamp.diff(createdStamp));
            let timeSpentHours = timeSpent.asHours().toFixed(2);

            return {
                name: user.name,
                email: user.email,
                school: user.school,
                time: timeSpentHours,
                level: latestLevel.last,
                solved: latestLevel.question.length
            }
        }).sort((a, b) => ((b.level - a.level) || (b.solved - a.solved) || (b.time - a.time)));

        return res.status(200).json({ "message": "Leaderboard", "data": board });
    } catch (err) {
        next(err);
    }
}

module.exports = leaderbordHandler;