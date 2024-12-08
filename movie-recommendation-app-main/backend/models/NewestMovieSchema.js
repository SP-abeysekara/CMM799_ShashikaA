const mongoose = require('mongoose');

const newestmovieSchema = new mongoose.Schema({
    content_type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    cast: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    date_added: {
        type: Date,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    listed_in: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    movie_name: {
        type: String,
        required: false,
    },
    movie_info: {
        type: String,
        required: false,
    },
    content_rating: {
        type: String,
        required: false,
    },
    genres: {
        type: String,
        required: false,
    },
    authors: {
        type: String,
        required: false,
    },
    original_release_date: {
        type: Date,
        required: false,
    },
    streaming_release_date: {
        type: Date,
        required: false,
    },
    runtime: {
        type: Number,
        required: false,
    },
    production_company: {
        type: String,
        required: false,
    },
    audience_status: {
        type: String,
        required: false,
    },
    audience_rating: {
        type: Number,
        required: false,
    },
    audience_count: {
        type: Number,
        required: false,
    },
    movie_id: {
        type: Number,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('NewestMovie', newestmovieSchema);
