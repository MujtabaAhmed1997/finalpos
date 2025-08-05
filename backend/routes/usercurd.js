const express = require('express');
const router = express.Router();
const sequelize = require('../db/sequelize'); // Corrected path to sequelize instance
const { QueryTypes } = require('sequelize');
const User = require('../models/usermodel');

router.get('/getusers', async (req, res) => {
    try {
        const result = await User.findAll();
        res.json(result);
    } catch (err) {
        console.error("Error fetch data:", err);
        res.status(500).json({ Message: "Error fetch data" });
    }
});

router.get('/read/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ Message: "User not found" });
    }
    res.json(user);
});

router.put('/update/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).json({ Message: "User not found" });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;  
    await user.save();
    res.json(user);
});

router.delete('/delete/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).json({ Message: "User not found" });
    }
    try {
        await user.destroy();
        res.json({ Message: "User deleted successfully" });
    } catch (err) {
        console.error(`Error updating data for ID ${id}:`, err);
        res.status(500).json({ Message: `Error updating data for ID ${id}` });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const sql = "DELETE FROM users WHERE ID=?";
    const id = req.params.id;
    try {
        const result = await sequelize.query(sql, {
            replacements: [id],
            type: QueryTypes.DELETE
        });
        res.json(result);
    } catch (err) {
        console.error(`Error deleting data for ID ${id}:`, err);
        res.status(500).json({ Message: `Error deleting data for ID ${id}` });
    }
});

module.exports = router;
