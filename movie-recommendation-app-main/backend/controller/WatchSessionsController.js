const express = require('express');
const WatchSessionsController = express.Router();
const WatchSessions = require('../models/WatchSessionsSchema'); // Adjust the path as needed

// Create a new watch session
WatchSessionsController.post('/watchSessions', async (req, res) => {
    try {
        const watchSessionData = new WatchSessions(req.body);
        const savedWatchSession = await watchSessionData.save();
        res.status(201).json(savedWatchSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all watch sessions
WatchSessionsController.get('/watchSessions', async (req, res) => {
    try {
        const watchSessions = await WatchSessions.find();
        res.json(watchSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get watch sessions by user ID
WatchSessionsController.get('/watchSessions/user/:id', async (req, res) => {
    try {
        const watchSessions = await WatchSessions.find({ user_id: req.params.id });
        if (!watchSessions) {
            res.status(404).json({ message: 'WatchSessions not found' });
            return;
        }
        res.json(watchSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get watch sessions by movie ID
WatchSessionsController.get('/watchSessions/movie/:id', async (req, res) => {
    try {
        const watchSessions = await WatchSessions.find({ movie_id: req.params.id });
        if (!watchSessions) {
            res.status(404).json({ message: 'WatchSessions not found' });
            return;
        }
        res.json(watchSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a watch session by ID
WatchSessionsController.put('/watchSessions/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedWatchSession = await WatchSessions.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedWatchSession) {
            res.status(404).json({ message: 'WatchSession not found' });
            return;
        }

        res.json(updatedWatchSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a watch session by ID
WatchSessionsController.delete('/watchSessions/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedWatchSession = await WatchSessions.findByIdAndDelete(id);

        if (!deletedWatchSession) {
            res.status(404).json({ message: 'WatchSession not found' });
            return;
        }

        res.json({ message: `WatchSession with ID ${id} has been deleted` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = WatchSessionsController;
