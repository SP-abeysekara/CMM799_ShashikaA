const express = require('express');
const UserInteractionsController = express.Router();
const UserInteractions = require('../models/UserInteractionsSchema'); // Adjust the path as needed

// Create a new user interaction
UserInteractionsController.post('/userInteractions', async (req, res) => {
    try {
        const userInteractionData = new UserInteractions(req.body);
        const savedUserInteraction = await userInteractionData.save();
        res.status(201).json(savedUserInteraction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all user interactions
UserInteractionsController.get('/userInteractions', async (req, res) => {
    try {
        const userInteractions = await UserInteractions.find();
        res.json(userInteractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific user interactions by user ID
UserInteractionsController.get('/userInteractions/user/:id', async (req, res) => {
    try {
        const userInteractions = await UserInteractions.find({ user_id: req.params.id });
        if (!userInteractions) {
            res.status(404).json({ message: 'UserInteractions not found' });
            return;
        }
        res.json(userInteractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific user interactions by movie ID
UserInteractionsController.get('/userInteractions/movie/:id', async (req, res) => {
    try {
        const userInteractions = await UserInteractions.find({ movie_id: req.params.id });
        if (!userInteractions) {
            res.status(404).json({ message: 'UserInteractions not found' });
            return;
        }
        res.json(userInteractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user interaction by ID
UserInteractionsController.put('/userInteractions/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUserInteraction = await UserInteractions.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUserInteraction) {
            res.status(404).json({ message: 'UserInteraction not found' });
            return;
        }

        res.json(updatedUserInteraction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user interaction by ID
UserInteractionsController.delete('/userInteractions/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUserInteraction = await UserInteractions.findByIdAndDelete(id);

        if (!deletedUserInteraction) {
            res.status(404).json({ message: 'UserInteraction not found' });
            return;
        }

        res.json({ message: `UserInteraction with ID ${id} has been deleted` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = UserInteractionsController;
