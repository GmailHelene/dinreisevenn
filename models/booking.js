const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    interests: {
        type: [String],
        required: true
    },
    transport: {
        type: [String],
        required: true
    },
    accommodation: {
        type: String,
        required: false
    },
    activities: [{
        name: String,
        time: String,
        description: String,
        estimatedCost: Number
    }],
    totalEstimatedCost: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware for å oppdatere updatedAt ved lagring
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
