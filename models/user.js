const { Schema, model } = require('mongoose');

const userModel = new Schema({
    name: String,
    email: String,
    pwd: String,
    school: String,
    access: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    history: {
        level: [{
            last: Number,
            completedOn: Date
        }],
        lastLogin: [{
            accessOn: Date,
            from: String,
            agent: String
        }]
    }
});

module.exports = model('user', userModel);