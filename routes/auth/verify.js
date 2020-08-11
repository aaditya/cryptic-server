const User = require('../../models/user');

const handleVerify = async (req, res) => {
    try {
        let { uid, active } = req.query;

        const userData = await User.findOne({ _id: uid });

        if (!userData) {
            return res.json({ "message": "User does not exist" });
        }

        if (userData.activation.key !== active) {
            return res.json({ "message": "Invalid Activation Code" });
        }

        await User.findOneAndUpdate({ _id: uid }, { $set: { status: 1, createdAt: new Date() }, $unset: { activation: 1 } });

        return res.status(200).json({ "message": "Account Activated" });
    } catch (err) {
        next(err);
    }
}

module.exports = handleVerify;