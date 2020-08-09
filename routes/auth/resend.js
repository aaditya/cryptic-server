const path = require('path');

const User = require('../../models/user');

const renderHTML = require('../common/renderHTML');
const { sendHTMLEMail } = require('../common/email');

const registerUser = async (req, res, next) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(400).json({
                "message": "Required data not submitted."
            });
        }

        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                "message": "User does not exist."
            });
        }

        const activeKey = existingUser.activation.key;
        if (!activeKey) {
            return res.status(400).json({
                "message": "Resend request not available."
            })
        }

        let activeUrl = `${req.protocol}://${req.get('host')}/activate?uid=${existingUser._id}&active=${activeKey}`;

        res.status(200).json({
            "message": "Email resent."
        });

        const html = await renderHTML(path.join(__dirname, '../../templates/verification.ejs'), { url: activeUrl });
        await sendHTMLEMail(email, 'Verify your Email Address to access Cryptix', html).catch();
    } catch (err) {
        next(err);
    }
}

module.exports = registerUser;