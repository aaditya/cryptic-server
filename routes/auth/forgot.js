const path = require('path');

const User = require('../../models/user');

const randStr = require('../common/rand');
const renderHTML = require('../common/renderHTML');
const { sendHTMLEMail } = require('../common/email');

const forgotHandler = async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(400).json({ "message": "Please check the data." });
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ "message": "No User Found." });
        }

        if (userData.status === -1) {
            return res.status(401).json({ "message": "User Disabled." });
        }

        const activeKey = randStr({ limit: 11, special: false });
        await User.findOneAndUpdate({ _id: userData._id }, { $set: { status: 2, "activation.key": activeKey } });

        let activeUrl = `${process.env.CB_URL}/activate?uid=${userData._id}&active=${activeKey}`;

        res.status(200).json({
            "message": "Request Email Sent."
        });

        const html = await renderHTML(path.join(__dirname, '../../templates/mailer.ejs'), { 
            url: activeUrl,
            subText: "Reset Password",
            text1: "Please click on the link to",
            text2: "verify your email and restart your hunt !",
            btnText: "Reset Password" 
        });
        await sendHTMLEMail(email, 'Reset Password for your Cryptix Account', html).catch();
    } catch (err) {
        next(err);
    }
}

module.exports = forgotHandler;