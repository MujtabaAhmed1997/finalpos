const express = require('express');
const { hashPassword, compareHashedPassword } = require('../auth/hashpassword');
const User = require('../models/usermodel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { validateUserSignup, validateUserLogin } = require('../middleware/validation');
const { authLogger, errorLogger } = require('../helpers/logger');

router.post('/signup', validateUserSignup, async (req, res, next) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        const { email, name } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            authLogger('signup_failed', { email, reason: 'email_already_exists' });
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const newUser = await User.create({ name, email, password: hashedPassword });
        authLogger('signup_success', { userId: newUser.id, email });
        
        res.status(201).json({ 
            message: 'User created successfully', 
            user: { id: newUser.id, name: newUser.name, email: newUser.email } 
        });
    } catch (error) {
        errorLogger(error, { context: 'user_signup' });
        next(error);
    }
});

router.post('/login', validateUserLogin, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            authLogger('login_failed', { email, reason: 'user_not_found' });
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await compareHashedPassword(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign(
                { userId: user.id, role: user.role }, 
                process.env.JWT_SECRET || 'boss', 
                { expiresIn: '1h' }
            );
            authLogger('login_success', { userId: user.id, email });
            return res.json({ 
                message: 'Login successful', 
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            authLogger('login_failed', { email, reason: 'invalid_password' });
            return res.status(401).json({ error: 'Incorrect password' });
        }
    } catch (error) {
        errorLogger(error, { context: 'user_login' });
        next(error);
    }
});


module.exports = router;
