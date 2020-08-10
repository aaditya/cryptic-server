const { Schema, model } = require('mongoose');

const questionModel = new Schema({
    level: Number,
    total: Number,
    questions: [{
        text: String,
        hints: [{
            name: String,
            data: String
        }],
        answer: String
    }]
});

module.exports = model('question', questionModel);