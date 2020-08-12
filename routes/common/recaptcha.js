const axios = require('axios');
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

module.exports = async (captcha) => {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    let { data } = await axios.post(verifyUrl);

    if (!data.success || data.success === undefined || data.success == false) {
        return false
    } else if (data.success == true) {
        return true
    }
}