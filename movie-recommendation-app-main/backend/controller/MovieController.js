const express = require('express');
const MovieController = express.Router();
const Movie = require('../models/MovieSchema'); // Adjust the path as needed

// Create a new movie
MovieController.post('/movie', async (req, res) => {
    try {
        const movieData = new Movie(req.body);
        const savedMovie = await movieData.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all movies with pagination and lean query for performance
MovieController.get('/movie', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page number, default to 1
    const limit = parseInt(req.query.limit) || 10; // Limit number of movies per page, default to 10
    const skipIndex = (page - 1) * limit; // Calculate number of documents to skip

    try {
        // Fetch movies with pagination, and use `lean()` for lightweight objects
        const movies = await Movie.find()
            .skip(skipIndex) // Skip documents for pagination
            .limit(limit) // Limit documents per page
            .lean(); // Return plain JS objects instead of Mongoose documents for performance

        const totalMovies = await Movie.countDocuments(); // Get total number of movies

        res.json({
            totalPages: Math.ceil(totalMovies / limit), // Total number of pages
            currentPage: page,
            totalMovies,
            movies, // Movies for the current page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get a specific movie by ID
MovieController.get('/movie/:movie_id', async (req, res) => {
    try {
        const movie = await Movie.findOne({ movie_id: req.params.movie_id });
        if (!movie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a movie by ID
MovieController.put('/movie/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedMovie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }

        res.json(updatedMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a movie by ID
MovieController.delete('/movie/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }

        res.json({ message: `Movie with ID ${id} has been deleted` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Search for movies by title
MovieController.get('/movieSearch', async (req, res) => {
    const searchQuery = req.query.q; // Get the search query from the query parameters

    if (!searchQuery) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        // Perform a case-insensitive search on the title field
        const movies = await Movie.find({
            title: { $regex: searchQuery, $options: 'i' } // 'i' for case-insensitive search
        }).lean();

        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get movies by actor name
// MovieController.get('/moviesByActor', async (req, res) => {
//     const actorName = req.query.actor;

//     if (!actorName) {
//         return res.status(400).json({ message: 'Actor name is required' });
//     }

//     try {
//         // Search for movies where the cast field contains the actor's name
//         const movies = await Movie.find({
//             cast: { $regex: actorName, $options: 'i' } // Case-insensitive search
//         }).lean();

//         if (movies.length === 0) {
//             return res.status(404).json({ message: 'No movies found for the given actor' });
//         }

//         res.json(movies);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// // Get movies by genre
// MovieController.get('/moviesByGenre', async (req, res) => {
//     const genre = req.query.genre;

//     if (!genre) {
//         return res.status(400).json({ message: 'Genre is required' });
//     }

//     try {
//         // Search for movies where the genres field contains the specified genre
//         const movies = await Movie.find({
//             genres: { $regex: genre, $options: 'i' } // Case-insensitive search
//         }).lean();

//         if (movies.length === 0) {
//             return res.status(404).json({ message: 'No movies found for the given genre' });
//         }

//         res.json(movies);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


MovieController.get('/moviesByActor', async (req, res) => {
    const actorName = req.query.actor;
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 20 movies per page
    const skipIndex = (page - 1) * limit;  // Calculate how many documents to skip

    if (!actorName) {
        return res.status(400).json({ message: 'Actor name is required' });
    }

    try {
        const movies = await Movie.find({
            cast: { $regex: actorName, $options: 'i' } // Case-insensitive search
        })
            .skip(skipIndex)  // Skip documents for pagination
            .limit(limit)  // Limit documents per page
            .lean();  // Return plain JS objects for performance

        const totalMovies = await Movie.countDocuments({
            cast: { $regex: actorName, $options: 'i' }
        });

        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found for the given actor' });
        }

        res.json({
            totalPages: Math.ceil(totalMovies / limit),
            currentPage: page,
            totalMovies,
            movies
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

MovieController.get('/moviesByGenre', async (req, res) => {
    const genre = req.query.genre;
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 20 movies per page
    const skipIndex = (page - 1) * limit;  // Calculate how many documents to skip

    if (!genre) {
        return res.status(400).json({ message: 'Genre is required' });
    }

    try {
        const movies = await Movie.find({
            genres: { $regex: genre, $options: 'i' } // Case-insensitive search
        })
            .skip(skipIndex)  // Skip documents for pagination
            .limit(limit)  // Limit documents per page
            .lean();  // Return plain JS objects for performance

        const totalMovies = await Movie.countDocuments({
            genres: { $regex: genre, $options: 'i' }
        });

        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found for the given genre' });
        }

        res.json({
            totalPages: Math.ceil(totalMovies / limit),
            currentPage: page,
            totalMovies,
            movies
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = MovieController;
