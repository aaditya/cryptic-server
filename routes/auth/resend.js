const path = require('path');

const User = require('../../models/user');

const renderHTML = require('../common/renderHTML');
const { sendHTMLEMail } = require('../common/email');

const registerUser = async (req, res, next) => {
    try {
        let { email, type } = req.body;
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

        res.status(200).json({
            "message": "Email resent."
        });

        if (type === "register") {
            let activeUrl = `${process.env.CB_URL}/activate?uid=${existingUser._id}&active=${activeKey}`;
            const html = await renderHTML(path.join(__dirname, '../../templates/mailer.ejs'), {
                url: activeUrl,
                subText: "Thanks for signing up !",
                text1: "Please verify your email address to",
                text2: "start with your hunt !",
                btnText: "Verify Email"
            });

            await sendHTMLEMail(email, 'Verify your Email Address to access Cryptix', html).catch();
        } else if (type === "forgot") {
            let activeUrl = `${process.env.CB_URL}/forgot-password?uid=${existingUser._id}&active=${activeKey}`;
            const html = await renderHTML(path.join(__dirname, '../../templates/mailer.ejs'), {
                url: activeUrl,
                subText: "Reset Password",
                text1: "Please click on the link to",
                text2: "verify your email and restart your hunt !",
                btnText: "Reset Password"
            });
            await sendHTMLEMail(email, 'Reset Password for your Cryptix Account', html).catch();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = registerUser;