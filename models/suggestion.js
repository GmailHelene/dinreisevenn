const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    interests: {
        type: [String],
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    ageGroup: {
        type: String,
        required: true
    },
    activityLevel: {
        type: String,
        required: true
    },
    transport: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);