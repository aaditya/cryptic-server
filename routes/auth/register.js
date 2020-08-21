const bcrypt = require('bcrypt');
const path = require('path');

const User = require('../../models/user');
const Registration = require('../../models/registration');

const randStr = require('../common/rand');
const renderHTML = require('../common/renderHTML');
const { sendHTMLEMail } = require('../common/email');
const verifyCaptcha = require('../common/recaptcha');

const registerUser = async (req, res, next) => {
    try {
        let { name, email, pwd, school, code, captchaKey } = req.body;
        if (!name || !email || !pwd || !school || !captchaKey || !code) {
            return res.status(400).json({
                "message": "Required data not submitted."
            });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                "message": "User already exists."
            });
        }

        let verifyCaptchaRes = await verifyCaptcha(captchaKey);
        if (!verifyCaptchaRes) {
            return res.status(400).json({
                "message": "Invalid Captcha"
            });
        }

        let verifyCode = await Registration.findOne({ code });
        if (!verifyCode || verifyCode.used) {
            return res.status(400).json({
                "message": "Invalid Invite Code"
            });
        }

        const pwdh = await bcrypt.hash(req.body.pwd, 10);
        const activeKey = randStr({ limit: 11, special: false });

        const saveData = await new User({
            name,
            email,
            school,
            pwd: pwdh,
            activation: {
                key: activeKey
            }
        }).save();

        let activeUrl = `${process.env.CB_URL}/activate?uid=${saveData._id}&active=${activeKey}`;

        res.status(200).json({
            "message": "Please check your email for verification"
        });

        const html = await renderHTML(path.join(__dirname, '../../templates/mailer.ejs'), {
            url: activeUrl,
            subText: "Thanks for signing up !",
            text1: "Please verify your email address to",
            text2: "start with your hunt !",
            btnText: "Verify Email"
        });

        await Registration.findOneAndUpdate({ code }, { $set: { used: true } });

        await sendHTMLEMail(email, 'Verify your Email Address to access Cryptix', html).catch();
    } catch (err) {
        next(err);
    }
}

module.exports = registerUser;