const { Schema, model } = require('mongoose');

const killswitch = new Schema({
    role: String,
    scheduledOn: Date,
    activateOn: Date
});

module.exports = model('killswitch', killswitch);
