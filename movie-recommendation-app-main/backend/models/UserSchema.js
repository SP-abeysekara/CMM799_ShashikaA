const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        // required: true,
    },

    subscription_type: {
        type: String,
        // required: true,
    },
    monthly_revenue: {
        type: Number,
        // required: true,
    },
    join_date: {
        type: String,
        // required: true,
    },
    last_payment: {
        type: String,
        // required: true,
    },
    country: {
        type: String,
        // required: true,
    },
    age: {
        type: Number,
        // required: true,
    },
    gender: {
        type: String,
        // required: true,
    },
    device: {
        type: String,
        // required: true,
    },
    plan_duration: {
        type: String,
        // required: true,
    }
});

module.exports = mongoose.model('User', userSchema);
