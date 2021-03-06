const moment = require('moment');

const User = require('../../models/user');

const leaderbordHandler = async (req, res, next) => {
    try {
        let users = await User.find({ access: "user", status: { $nin: [-1, 0] } });

        /**
         * Leaderboard Sorting Priority
         * 1. Highest Level
         * 2. Number of questions solved
         * 3. Time taken in total to reach current position
         */

        let board = users.map((user) => {
            let latestLevel = user.history.level.slice(-1)[0];

            if (!latestLevel) {
                latestLevel = {
                    question: [],
                    last: 0,
                    completedOn: new Date()
                }
            }

            let createdStamp = moment(user.createdAt || new Date());
            let lastLevelStamp = moment(latestLevel.completedOn);

            // Time Spent from account creation to last level.
            let timeSpent = moment.duration(createdStamp.diff(lastLevelStamp));
            let timeSpentMinutes = timeSpent.asMinutes().toFixed(2);
            
            return {
                name: user.name,
                email: user.email,
                self: user.email === req.info.email,
                school: user.school,
                time: timeSpentMinutes,
                level: latestLevel.last,
                completed: user.status === 3,
                date: new Date(lastLevelStamp).getTime(),
                solved: latestLevel.question.length
            }
        }).sort((a, b) => ((b.level - a.level) || (a.date - b.date) || (a.time - b.time)));

        return res.status(200).json({ "message": "Leaderboard", "data": board });
    } catch (err) {
        next(err);
    }
}

module.exports = leaderbordHandler;