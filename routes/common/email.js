const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// main work is done by this smtpTransport so at new signup the value of to toEmailAddress should be
// equal to the Users[0].email  you the know the best.

const transport = nodemailer.createTransport(smtpTransport({
    host: process.env.MAIL_HOST,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
}))

exports.sendTextEMail = async (address, subject, message) => {
    let mail = {
        from: process.env.MAIL_USER,
        to: address,
        subject: subject,
        text: message
    }
    await transport.sendMail(mail).catch();
    transport.close();

    return true;
}

exports.sendHTMLEMail = async (address, subject, message) => {
    let mail = {
        from: process.env.MAIL_USER,
        to: address,
        subject: subject,
        html: message
    }
    await transport.sendMail(mail).catch();
    transport.close();

    return true;
}
