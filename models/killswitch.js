const { Schema, model } = require('mongoose');

const killswitch = new Schema({
    role: String,
    activateOn: Date
});

module.exports = model('killswitch', killswitch);
