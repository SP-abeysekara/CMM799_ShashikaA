const mongoose = require('mongoose');

const userInteractionsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    movie_id: {
        type: Number,
        required: true,
    },
    interaction_date: {
        type: Date,
        required: true,
    },
    interaction_type: {
        type: String,
        required: true,
        enum: ['watching', 'paused', 'watched', 'rated', 'reviewed', 'clicked', 'wishlisted', 'liked', 'unliked', 'unwishlisted', 'unwatched'], // You can add more interaction types as needed
    }
});

module.exports = mongoose.model('UserInteractions', userInteractionsSchema);
