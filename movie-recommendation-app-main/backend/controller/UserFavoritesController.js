const express = require('express');
const UserFavoritesController = express.Router();
const UserFavorites = require('../models/UserFavoritesSchema'); // Adjust the path as needed
const Movie = require('../models/MovieSchema');

UserFavoritesController.post('/userFavorites', async (req, res) => {
    try {
        const { favorite_films, ...otherData } = req.body;

        // Map the favorite_films to store movie_id and title
        const filmsData = await Promise.all(
            favorite_films.map(async (filmId) => {
                const movie = await Movie.findOne({ movie_id: filmId });

                if (!movie) {
                    // If the movie doesn't exist, create a placeholder entry
                    const newMovie = new Movie({
                        movie_id: filmId,
                        content_type: 'movie',
                        title: `Placeholder for movie ${filmId}`
                    });
                    const savedMovie = await newMovie.save();
                    return { movie_id: savedMovie.movie_id, title: savedMovie.title };
                }
                // If the movie exists, return its movie_id and title
                return { movie_id: movie.movie_id, title: movie.title };
            })
        );

        // Create a new UserFavorites document
        const userFavoritesData = new UserFavorites({
            ...otherData,
            favorite_films: filmsData,
        });

        const savedUserFavorites = await userFavoritesData.save();
        res.status(201).json(savedUserFavorites);
    } catch (error) {
        console.error('Error saving user favorites:', error);
        res.status(400).json({ message: error.message });
    }
});



// UserFavoritesController.post('/userFavorites', async (req, res) => {
//     try {
//         const { favorite_films, ...otherData } = req.body;

//         // Convert favorite_films IDs to ObjectIds
//         const movieIds = await Promise.all(favorite_films.map(async (filmId) => {
//             // Check if the movie exists in the database
//             const movie = await Movie.findOne({ movie_id: filmId });
//             if (movie) {
//                 return movie._id;
//             } else {
//                 // If the movie doesn't exist, create a placeholder movie document
//                 const newMovie = new Movie({
//                     movie_id: filmId,
//                     content_type: 'movie',  // Assuming it's a movie
//                     title: `Placeholder for movie ${filmId}` // Placeholder title
//                 });
//                 const savedMovie = await newMovie.save();
//                 return savedMovie._id;
//             }
//         }));

//         const userFavoritesData = new UserFavorites({
//             ...otherData,
//             favorite_films: movieIds
//         });

//         const savedUserFavorites = await userFavoritesData.save();
//         res.status(201).json(savedUserFavorites);
//     } catch (error) {
//         console.error("Error saving user favorites:", error);
//         res.status(400).json({ message: error.message });
//     }
// });


// Create a new user favorites entry
// UserFavoritesController.post('/userFavorites', async (req, res) => {
//     try {
//         const userFavoritesData = new UserFavorites(req.body);
//         const savedUserFavorites = await userFavoritesData.save();
//         res.status(201).json(savedUserFavorites);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// Get all user favorites
UserFavoritesController.get('/userFavorites', async (req, res) => {
    try {
        const userFavorites = await UserFavorites.find();
        res.json(userFavorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific user favorites by user ID
// UserFavoritesController.get('/userFavorites/:id', async (req, res) => {
//     try {
//         const userFavorites = await UserFavorites.findOne({ user_id: req.params.id });
//         console.log("Full user favorites document:", JSON.stringify(userFavorites, null, 2));
//         if (!userFavorites) {
//             res.status(404).json({ message: 'UserFavorites not found' });
//             return;
//         }
//         res.json(userFavorites);
//     } catch (error) {
//         console.error("Error fetching user favorites:", error);
//         res.status(500).json({ message: error.message });
//     }
// });


UserFavoritesController.get('/userFavorites/:id', async (req, res) => {
    try {
        const userFavorites = await UserFavorites.findOne({ user_id: req.params.id })
            .populate('favorite_films', 'title')  // Populate favorite_films with just the title
        // .populate('wishlist_films', 'title')
        // .populate('watched_films', 'title')
        // .populate('liked_movies', 'title');

        if (!userFavorites) {
            res.status(404).json({ message: 'UserFavorites not found' });
            return;
        }


        console.log("Full user favorites document:", JSON.stringify(userFavorites, null, 2));

        // Transform the response to include both id and title for films
        const transformedFavorites = {
            ...userFavorites.toObject(),
            favorite_films: userFavorites.favorite_films.map(film => ({
                // id: film._id,
                title: film.title,
                movie_id: film.movie_id
            })),
            // wishlist_films: userFavorites.wishlist_films.map(film => ({
            //     id: film._id,
            //     title: film.title
            // })),
            // watched_films: userFavorites.watched_films.map(film => ({
            //     id: film._id,
            //     title: film.title
            // })),
            // liked_movies: userFavorites.liked_movies.map(film => ({
            //     id: film._id,
            //     title: film.title
            // }))
        };

        res.json(transformedFavorites);
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        res.status(500).json({ message: error.message });
    }
});

// Update a user favorites by user ID
UserFavoritesController.put('/userFavorites/:id', async (req, res) => {
    try {
        const userFavorites = await UserFavorites.findOneAndUpdate({ user_id: req.params.id }, req.body, { new: true });

        if (!userFavorites) {
            res.status(404).json({ message: 'UserFavorites not found' });
            return;
        }

        res.json(userFavorites);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user favorites by user ID
UserFavoritesController.delete('/userFavorites/:id', async (req, res) => {
    try {
        const userFavorites = await UserFavorites.findOneAndDelete({ user_id: req.params.id });

        if (!userFavorites) {
            res.status(404).json({ message: 'UserFavorites not found' });
            return;
        }

        res.json({ message: `UserFavorites with user ID ${req.params.id} has been deleted` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add a movie_id to the wishlist, watched, or liked list
UserFavoritesController.put('/userFavorites/:id/addToList', async (req, res) => {
    const { movie_id, listType } = req.body; // expecting movie_id and listType ('wishlist', 'watched', 'liked')

    if (!movie_id || !listType || !['wishlist', 'watched', 'liked'].includes(listType)) {
        return res.status(400).json({ message: 'Invalid movie_id or listType' });
    }

    try {
        let userFavorites = await UserFavorites.findOne({ user_id: req.params.id });

        // If user not found, create a new entry
        if (!userFavorites) {
            userFavorites = new UserFavorites({
                user_id: req.params.id,
                wishlist_films: [],
                watched_films: [],
                liked_movies: []
            });
        }

        const listField = listType === 'wishlist' ? 'wishlist_films' :
            listType === 'watched' ? 'watched_films' : 'liked_movies';

        // Only add if movie_id is not already in the list
        if (!userFavorites[listField].includes(movie_id)) {
            userFavorites[listField].push(movie_id);
            await userFavorites.save();
            return res.json({ message: `${movie_id} added to ${listType} list`, data: userFavorites });
        }

        res.status(400).json({ message: `${movie_id} already in ${listType} list` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/// Remove a movie_id from the wishlist, watched, or liked list
UserFavoritesController.put('/userFavorites/:id/removeFromList', async (req, res) => {
    const { movie_id, listType } = req.body; // expecting movie_id and listType ('wishlist', 'watched', 'liked')

    if (!movie_id || !listType || !['wishlist', 'watched', 'liked'].includes(listType)) {
        return res.status(400).json({ message: 'Invalid movie_id or listType' });
    }

    try {
        let userFavorites = await UserFavorites.findOne({ user_id: req.params.id });

        // If user not found, create an empty entry
        if (!userFavorites) {
            userFavorites = new UserFavorites({
                user_id: req.params.id,
                wishlist_films: [],
                watched_films: [],
                liked_movies: []
            });
            await userFavorites.save(); // Save the new user entry
            return res.status(404).json({ message: 'User created, but no movie found to remove from list', data: userFavorites });
        }

        const listField = listType === 'wishlist' ? 'wishlist_films' :
            listType === 'watched' ? 'watched_films' : 'liked_movies';

        const movieIndex = userFavorites[listField].indexOf(movie_id);

        if (movieIndex !== -1) {
            userFavorites[listField].splice(movieIndex, 1); // Remove the movie_id from the list
            await userFavorites.save();
            return res.json({ message: `${movie_id} removed from ${listType} list`, data: userFavorites });
        }

        res.status(400).json({ message: `${movie_id} not found in ${listType} list` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = UserFavoritesController;
