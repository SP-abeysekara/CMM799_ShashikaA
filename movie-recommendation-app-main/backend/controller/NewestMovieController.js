const express = require('express');
const MovieController = express.Router();
const NewestMovie = require('../models/NewestMovieSchema'); // Adjust the path as needed



// Get all movies with pagination and lean query for performance
MovieController.get('/newestmovies', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page number, default to 1
    const limit = parseInt(req.query.limit) || 20; // Limit number of movies per page, default to 10
    const skipIndex = (page - 1) * limit; // Calculate number of documents to skip

    try {
        // Fetch movies with pagination, and use `lean()` for lightweight objects
        const movies = await NewestMovie.find()
            .skip(skipIndex) // Skip documents for pagination
            .limit(limit) // Limit documents per page
            .lean(); // Return plain JS objects instead of Mongoose documents for performance

        const totalMovies = await NewestMovie.countDocuments(); // Get total number of movies

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

module.exports = MovieController;