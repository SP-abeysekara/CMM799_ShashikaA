const mongoose = require('mongoose');

const watchSessionsSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    movie_id: {
        type: Number,
        required: true,
    },
    watch_date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    time_of_day: {
        type: String,
        required: false,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night'], // Possible values, can be adjusted
    },
    social_context: {
        type: String,
        required: false,
    },
    mood: {
        type: String,
        required: false,
    },
    device: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('WatchSessions', watchSessionsSchema);
