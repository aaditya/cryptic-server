const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/user');

const loginUser = async (req, res, next) => {
    try {
        let payload = { userId: req.user._id };
        let token = jwt.sign(payload, process.env.SECRET_KEY);

        if (req.user.status === 3) {
            return res.status(400).json({ "message": "Already Completed the Hunt !"});
        }
        
        res.status(200).json({
            "message": "Authenticated",
            "data": token,
            "frame": req.user.access === "user" ? null : true
        });

        // Logging
        if (req.user.access === "user") {
            let accessHistory = {
                accessOn: new Date,
                from: req.connection.remoteAddress.split(':')[3],
                agent: req.useragent.source
            }
            await User.findOneAndUpdate({ _id: req.user._id }, { $push: { "history.lastLogin": accessHistory } }).catch();
        }
    } catch (err) {
        next(err);
    }
}

const loginHandler = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            return res.status(401).json({ "message": "Authentication Failed" });
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return loginUser(req, res, next);
        });
    })(req, res, next);
}

module.exports = loginHandler;