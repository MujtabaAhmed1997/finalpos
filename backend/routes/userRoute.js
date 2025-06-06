const express = require('express');
const { hashPassword, compareHashedPassword } = require('../auth/hashpassword');
const User = require('../models/usermodel');
const router = express.Router();
const jwt = require('jsonwebtoken');

// router.post('/signup', async (req, res, next) => {
//     try {
//         const hashedPassword = await hashPassword(req.body.password);
//         const email = req.body.email;
    
//         // Check if user with the same email already exists
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ msg: 'Email already exists' });
//         }
    
//         // If user doesn't exist, create a new user
//         const newUser = await User.create({
//             name: req.body.name,
//             email,
//             password: hashedPassword
//         });
    
//         res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//         next(error);
//     }
// });


router.post('/signup', async (req, res, next) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        const { email, name } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        next(error);
    }
});

// router.post('/login', async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const passwordMatch = await compareHashedPassword(password, user.password);

//         if (passwordMatch) {
//             return res.json({ message: 'Login successful' });
//         } else {
//             return res.status(401).json({ error: 'Incorrect password' });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await compareHashedPassword(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: user.id, role: user.role }, 'boss', { expiresIn: '1h' });
            return res.json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ error: 'Incorrect password' });
        }
    } catch (error) {
        next(error);
    }
});


module.exports = router;
