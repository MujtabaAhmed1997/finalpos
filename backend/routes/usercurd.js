const express = require('express');
const router = express.Router();
const sequelize = require('../db/sequelize');
const { QueryTypes } = require('sequelize');
const User = require('../models/usermodel');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { errorLogger } = require('../helpers/logger');

// All user CRUD routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get('/getusers', isAdmin, async (req, res) => {
    try {
        const result = await User.findAll({
            attributes: { exclude: ['password'] } // Don't return passwords
        });
        res.json(result);
    } catch (err) {
        errorLogger(err, { context: 'fetch_users' });
        res.status(500).json({ Message: "Error fetching users" });
    }
});

// Get user by ID (admin or own user)
router.get('/read/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Users can only read their own data unless they're admin
        if (req.user.userId !== parseInt(id) && req.user.role !== 'admin') {
            return res.status(403).json({ Message: "Forbidden: Cannot read other users" });
        }

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        
        res.json(user);
    } catch (err) {
        errorLogger(err, { context: 'read_user', userId: req.user.userId });
        res.status(500).json({ Message: "Error reading user" });
    }
});

// Update user (admin only for others, users can update own profile)
router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Users can only update their own data unless they're admin
        if (req.user.userId !== parseInt(id) && req.user.role !== 'admin') {
            return res.status(403).json({ Message: "Forbidden: Cannot update other users" });
        }

        // Admins can change role, regular users cannot
        const updateData = { ...req.body };
        if (req.user.role !== 'admin') {
            delete updateData.role; // Regular users cannot change their role
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }

        await user.update(updateData);
        res.json({ 
            message: "User updated successfully", 
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        errorLogger(err, { context: 'update_user', userId: req.user.userId, targetId: req.params.id });
        res.status(500).json({ Message: "Error updating user" });
    }
});

// Delete user (admin only)
router.delete('/delete/:id', isAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        
        await user.destroy();
        res.json({ Message: "User deleted successfully" });
    } catch (err) {
        errorLogger(err, { context: 'delete_user', userId: req.user.userId, targetId: req.params.id });
        res.status(500).json({ Message: `Error deleting user with ID ${req.params.id}` });
    }
});

module.exports = router;
