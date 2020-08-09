const { Schema, model } = require('mongoose');

const levelModel = new Schema({
    level: Number,
    questionCount: Number
});

module.exports = model('level', levelModel);