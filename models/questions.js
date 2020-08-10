const { Schema, model } = require('mongoose');

const questionModel = new Schema({
    level: Number,
    total: Number,
    questions: [{
        text: String,
        qType: {
            type: String,
            enum: ["image", "text"],
            default: "text"
        },
        hints: [{
            name: String,
            data: String
        }],
        answer: String
    }]
});

module.exports = model('question', questionModel);