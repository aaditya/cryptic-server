const { Schema, model } = require('mongoose');

const questionModel = new Schema({
    text: String,
    level: Number,
    hints: [{
        name: String,
        data: String
    }],
    answer: String
});

module.exports = model('question', questionModel);