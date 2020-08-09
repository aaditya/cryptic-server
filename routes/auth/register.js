const bcrypt = require('bcrypt');

const User = require('../../models/user');

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
        await new User({
            name,
            email,
            school,
            pwd: pwdh
        }).save();

        return res.status(200).json({
            "message": "Registration completed."
        });
    } catch (err) {
        next(err);
    }
}

module.exports.local = registerUser;