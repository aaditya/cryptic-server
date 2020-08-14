const User = require('../../models/user');

const getUserHandler = async (req, res, next) => {
    try {
        let { id } = req.body;

        if (!id) {
            return res.status(400).json({ "message": "Details Invalid" });
        }

        let users = await User.findOneAndUpdate({ _id: id }, { $set: { access: "admin" } });

        if (!users) {
            return res.status(404).json({ "message": "No Users in system" })
        }

        return res.status(200).json({ "message": "User Updated" });

    } catch (err) {
        next(err);
    }
}

module.exports = getUserHandler;