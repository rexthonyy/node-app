const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['buyer', 'seller'],
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    national: {
        type: String,
        required: true
    },
    regional: {
        type: String,
        required: true
    },
    local: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);