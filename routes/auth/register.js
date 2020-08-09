const bcrypt = require('bcrypt');
const path = require('path');

const User = require('../../models/user');

const randStr = require('../common/rand');
const renderHTML = require('../common/renderHTML');
const { sendHTMLEMail } = require('../common/email');

const registerUser = async (req, res, next) => {
    try {
        let { name, email, pwd, school } = req.body;
        if (!name || !email || !pwd || !school) {
            return res.status(400).json({
                "message": "Required data not submitted."
            });
        }
        
        let existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                "message": "User already exists."
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

        let activeUrl = `${req.protocol}://${req.get('host')}/activate?uid=${saveData._id}&active=${activeKey}`;

        res.status(200).json({
            "message": "Registration completed."
        });

        const html = await renderHTML(path.join(__dirname, '../../templates/verification.ejs'), { url: activeUrl });
        await sendHTMLEMail(email, 'Verify your Email Address to access Cryptix', html).catch();
    } catch (err) {
        next(err);
    }
}

module.exports = registerUser;