const { Schema, model } = require('mongoose');

const registerActive = new Schema({
    code: String,
    email: String,
    used: {
        type: Boolean,
        default: false
    }
});

module.exports = model('registers', registerActive);
