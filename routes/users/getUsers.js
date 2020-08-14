const User = require('../../models/user');

const getUserHandler = async (req, res, next) => {
    try {
        let users = await User.find({ _id: { $ne: req.info.id } }, { pwd: 0 });

        if (!users || users.length === 0) {
            return res.status(404).json({ "message": "No Users in system" })
        }

        return res.status(200).json({ "message": "Users", "data": users });

    } catch (err) {
        next(err);
    }
}

module.exports = getUserHandler;