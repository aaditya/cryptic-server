const moment = require('moment');
const { Parser } = require('json2csv');

const User = require('../../models/user');

const leaderbordHandler = async (req, res, next) => {
    try {
        let users = await User.find({ access: "user", status: { $ne: -1 } });

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
                "Name": user.name,
                "Email": user.email,
                "School Name": user.school,
                "Time Spent (Minutes)": timeSpentMinutes,
                "Last Level Played": latestLevel.last,
                "Hunt Completed": user.status === 3,
                "Date of Last Level": new Date(lastLevelStamp).toDateString(),
                "Questions Solved": latestLevel.question.length
            }
        }).sort((a, b) => ((b.level - a.level) || (a.date - b.date) || (a.time - b.time)));

        const parser = new Parser();
        let csv = parser.parse(board);
        let csvb = Buffer.from(csv);

        res.attachment('leaderboard.csv').send(csvb);
    } catch (err) {
        next(err);
    }
}

module.exports = leaderbordHandler;