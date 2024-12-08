const express = require('express');
const UserController = express.Router();
const User = require('../models/UserSchema'); // Adjust the path as needed

// Create a new user
UserController.post('/user', async (req, res) => {
    try {
        const userData = new User(req.body);
        const savedUser = await userData.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users
UserController.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific user by ID
UserController.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


UserController.get('/user/findbyemail/:emailaddress', async (req, res) => {
    const email = req.params.emailaddress; // Extract email from URL parameter
    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).json(user); // Send the found user as response
        } else {
            return res.status(404).json({ message: 'User not found' }); // Handle user not found
        }
    } catch (error) {
        // Handle errors like invalid email, DB connection issues, etc.
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update a user by ID
UserController.put('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user by ID
UserController.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ message: `User with ID ${id} has been deleted` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = UserController;
