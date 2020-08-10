const jwt = require('jsonwebtoken');

const User = require('../../models/user');

const tokenVerificationHandler = async (req, res, next) => {
    try {
        // check header or url parameters or post parameters for token
        let token = req.body.token || req.params.token || req.headers['x-auth-token'];
        // decode token
        if (!token) {
            return res.status(401).json({ "message": "Unauthorized Request" });
        }
        // verifies secret and checks exp
        let info = jwt.verify(token, process.env.SECRET_KEY);
        if (!info) {
            return res.status(401).json({ "message": "Unauthorized Request" });
        }
        // Check for user ban
        const userData = await User.findOne({ _id: info.userId });
        if (!userData || userData.status === -1) {
            return res.status(401).json({ "message": "Unauthorized Request" });
        }

        req.info = {
            id: userData._id,
            access: userData.access,
            email: userData.email
        };
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = tokenVerificationHandler;