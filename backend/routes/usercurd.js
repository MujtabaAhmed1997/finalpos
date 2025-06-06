const express = require('express');
const router = express.Router();
const sequelize = require('../db/sequelize'); // Corrected path to sequelize instance
const { QueryTypes } = require('sequelize');

router.get('/getproducts', async (req, res) => {
    const sql = "SELECT * FROM users";
    try {
        const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
        res.json(result);
    } catch (err) {
        console.error("Error fetch data:", err);
        res.status(500).json({ Message: "Error fetch data" });
    }
});

router.get('/read/:id', async (req, res) => {
    const sql = "SELECT * FROM users WHERE ID=?";
    const id = req.params.id;
    try {
        const result = await sequelize.query(sql, {
            replacements: [id],
            type: QueryTypes.SELECT
        });
        res.json(result);
    } catch (err) {
        console.error(`Error fetching data for ID ${id}:`, err);
        res.status(500).json({ Message: `Error fetching data for ID ${id}` });
    }
});

router.put('/update/:id', async (req, res) => {
    const sql = "UPDATE users SET `NAME`=?,`EMAIL`=?,`ROLE`=? WHERE ID=?";
    const id = req.params.id;
    const { name, email, role } = req.body;
    try {
        const result = await sequelize.query(sql, {
            replacements: [name, email, role, id],
            type: QueryTypes.UPDATE
        });
        res.json(result);
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
