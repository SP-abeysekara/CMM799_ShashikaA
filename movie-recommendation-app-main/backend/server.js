const express = require("express");
const mongoose = require("mongoose");
const userController = require("./controller/UserController");
const movieController = require("./controller/MovieController"); // Import MovieController
const userFavoritesController = require("./controller/UserFavoritesController"); // Import UserFavoritesController
const userInteractionsController = require("./controller/UserInteractionsController"); // Import UserInteractionsController
const watchSessionsController = require("./controller/WatchSessionsController"); // Import WatchSessionsController
const newestMovieController = require("./controller/NewestMovieController");
const cors = require('cors');
const dotenv = require('dotenv'); // Import dotenv

// Load environment variables from .env
dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION_STRING; // Access the MongoDB connection string from .env

mongoose.connect(connectionString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
});

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

// Add routes for each controller
app.use('/api', userController);
app.use('/api', movieController);
app.use('/api', userFavoritesController);
app.use('/api', userInteractionsController);
app.use('/api', watchSessionsController);
app.use('/api', newestMovieController);

app.listen(port, () => {
    console.log("Server running on port " + process.env.PORT + "...");
});
