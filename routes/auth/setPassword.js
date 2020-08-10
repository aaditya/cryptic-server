const bcrypt = require('bcrypt');

const User = require('../../models/user');

const setPasswordHandler = async (req, res) => {
    try {
        let { uid, key, pwd } = req.body;
        if (!uid || !key || !pwd) {
            return res.status(400).json({ "message": "Details not found" });
        }

        let userData = await User.findOne({ _id: uid });
        if (!userData) {
            return res.status(400).json({ "message": "User not found" });
        }

        if (userData.status !== 2) {
            return res.status(400).json({ "message": "Cannot reset password" });
        }

        if (userData.activation.key !== key) {
            return res.status(401).json({ "message": "Activation key invalid" });
        }

        let pwdh = await bcrypt.hash(pwd, 10);

        await User.findOneAndUpdate({ _id: uid }, { $set: { status: 1, pwd: pwdh }, $unset: { activation: 1 } });

        return res.status(200).json({ "message": "Password Reset Successful" });
    } catch (err) {
        next(err);
    }
}

module.exports = setPasswordHandler;