const User = require('../../models/user');

const getUserHandler = async (req, res, next) => {
    try {
        let { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ "message": "Details Invalid" });
        }

        if (typeof status == "string") {
            status = parseInt(status);
        }

        let users = await User.findOneAndUpdate({ _id: id }, { $set: { status }, $unset: { activation: 1 } });

        if (!users) {
            return res.status(404).json({ "message": "No Users in system" })
        }

        return res.status(200).json({ "message": "User Updated" });

    } catch (err) {
        next(err);
    }
}

module.exports = getUserHandler;