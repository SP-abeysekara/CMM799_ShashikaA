const mongoose = require('mongoose');

// const userFavoritesSchema = new mongoose.Schema({
//     user_id: {
//         type: String,
//         required: true,
//     },
//     favorite_actors: {
//         type: [String],
//         required: false,
//     },
//     favorite_films: {
//         type: [Number],
//         required: false,
//     },
//     favorite_genres: {
//         type: [String],
//         required: false,
//     },
//     wishlist_films: {
//         type: [Number],
//         required: false,
//     },
//     watched_films: {
//         type: [Number],
//         required: false,
//     },
//     liked_movies: {
//         type: [Number],
//         required: false,
//     }
// });

// module.exports = mongoose.model('UserFavorites', userFavoritesSchema);

// const mongoose = require('mongoose');

// const userFavoritesSchema = new mongoose.Schema({
//     user_id: {
//         type: String,
//         required: true,
//     },
//     favorite_actors: {
//         type: [String],
//         required: false,
//     },
//     favorite_films: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Movie'
//     }],
//     favorite_genres: {
//         type: [String],
//         required: false,
//     },
//     wishlist_films: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Movie'
//     }],
//     watched_films: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Movie'
//     }],
//     liked_movies: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Movie'
//     }]
// });

// module.exports = mongoose.model('UserFavorites', userFavoritesSchema);


const userFavoritesSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    favorite_actors: {
        type: [String],
        required: false,
    },
    favorite_films: [
        {
            movie_id: { type: Number, required: true },
            title: { type: String, required: true }
        }
    ],
    favorite_genres: {
        type: [String],
        required: false,
    },
    wishlist_films: {
        type: [Number],
        required: false,
    },
    watched_films: {
        type: [Number],
        required: false,
    },
    liked_movies: {
        type: [Number],
        required: false,
    }
});

module.exports = mongoose.model('UserFavorites', userFavoritesSchema);
