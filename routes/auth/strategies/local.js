const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../../../models/user');

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd',
        session: false
    },
    async function (username, password, done) {
        try {
            const user = await User.findOne({ email: username, status: { $ne: -1 } });
            if (!user) {
                return done(null, false);
            }

            let passChk = await bcrypt.compare(password, user.pwd);
            if (!passChk) {
                return done(null, false);
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
)