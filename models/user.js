const { Schema, model } = require('mongoose');

/**
 * User Status Guide
 * 0 -> Unverified / Pending
 * 1 -> Verified
 * 2 -> Password Forgotten
 * -1 -> Banned
 */

const userModel = new Schema({
    status: {
        type: Number,
        default: 0
    },
    name: String,
    email: String,
    pwd: String,
    school: String,
    activation: {
        key: String
    },
    access: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    history: {
        level: [{
            last: Number,
            completedOn: Date,
            question: []
        }],
        lastLogin: [{
            accessOn: Date,
            from: String,
            agent: String
        }]
    }
});

module.exports = model('user', userModel);