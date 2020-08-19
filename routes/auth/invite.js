const csv = require('csvtojson');
const path = require('path');

const Register = require('../../models/registration');

const rand = require('../common/rand');
const renderHTML = require('../common/renderHTML');
const { sendHTMLEMail } = require('../common/email');

const inviteHandler = async (req, res, next) => {
    try {
        // Get CSV DATA AND PARSE
        let csvStr = Buffer.from(req.file.buffer).toString();
        let invites = await csv().fromString(csvStr);

        res.status(200).json({
            "message": "Invitations are being generated, Please check logs in case of error"
        });

        let emailCount = invites.length;
        for (let i = 0; i < emailCount; i++) {
            let key = rand({ limit: 24 });
            let email = invites[i].Email;
            let activeUrl = `${process.env.CB_URL}/register?key=${key}&email=${email}`;

            const html = await renderHTML(path.join(__dirname, '../../templates/mailer.ejs'), {
                url: activeUrl,
                subText: "Thanks for registering for GD Goenka Public School's cryptic hunt !",
                text1: "Please use the following unique link to register on the platform.",
                text2: "Reach out to support@cryptix.codes for any query regarding the platform or to the student coordinators.",
                btnText: "Register"
            });

            let existingInvite = await Register.findOne({ email });
            if (!existingInvite) {
                await new Register({ code: key, email }).save();
            } else {
                await Register.findOneAndUpdate({ email }, { $set: { code: key } });
            }

            await sendHTMLEMail(email, 'Invitation for Cryptix', html).catch();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = inviteHandler;
