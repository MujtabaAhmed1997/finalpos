/**
 * Refactored User Routes Using Service Layer
 * 
 * BEFORE: Business logic mixed in route handlers
 * AFTER: Thin routes delegate to services
 * 
 * Benefits:
 * - Routes are 5-10 lines instead of 30+
 * - Services are testable independently
 * - Code reusable across multiple routes
 * - Error handling centralized
 * - Business logic separated from HTTP concerns
 */

const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const { validateUserSignup, validateUserLogin } = require('../middleware/validation');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { authLogger, errorLogger } = require('../helpers/logger');

/**
 * BEFORE: 30+ lines with mixed concerns
 * router.post('/signup', async (req, res, next) => {
 *   try {
 *     const hashedPassword = await hashPassword(req.body.password);
 *     const { email, name } = req.body;
 *     const existingUser = await User.findOne({ where: { email } });
 *     if (existingUser) {
 *       return res.status(400).json({ msg: 'Email already exists' });
 *     }
 *     const newUser = await User.create({ name, email, password: hashedPassword });
 *     // ... etc
 *   } catch (error) {
 *     next(error);
 *   }
 * });
 */

/**
 * AFTER: 15 lines, clean separation of concerns
 * Route validates input → Service handles business logic → Error handler catches issues
 */
router.post('/signup', validateUserSignup, async (req, res, next) => {
    try {
        const user = await UserService.createUser(req.body);
        authLogger('signup_success', { userId: user.id, email: user.email });
        res.status(201).json({ 
            message: 'User created successfully', 
            user 
        });
    } catch (error) {
        // Error already logged in service
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

router.post('/login', validateUserLogin, async (req, res, next) => {
    try {
        const { token, user } = await UserService.authenticateUser(
            req.body.email, 
            req.body.password
        );
        authLogger('login_success', { userId: user.id, email: user.email });
        res.json({ 
            message: 'Login successful', 
            token, 
            user 
        });
    } catch (error) {
        authLogger('login_failed', { email: req.body.email, reason: error.message });
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

// All routes below require authentication
router.use(authMiddleware);

router.get('/profile', async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.user.userId);
        res.json(user);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

router.get('/list', isAdmin, async (req, res, next) => {
    try {
        const { limit, offset, role } = req.query;
        const users = await UserService.getAllUsers({
            limit: parseInt(limit) || 50,
            offset: parseInt(offset) || 0,
            role
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/update/:id', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Check permission
        if (req.user.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await UserService.updateUser(
            userId, 
            req.body, 
            req.user.role === 'admin'
        );
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

router.delete('/delete/:id', isAdmin, async (req, res, next) => {
    try {
        await UserService.deleteUser(parseInt(req.params.id));
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

module.exports = router;

/**
 * COMPARISON:
 * 
 * BEFORE:
 * - 200+ lines of route logic
 * - Hard to test (would need mocked DB)
 * - Business logic scattered across routes
 * - Duplicate code (validation, auth checks)
 * - Error handling not centralized
 * 
 * AFTER:
 * - 100 lines of thin routes
 * - Easy to test (mock UserService)
 * - Business logic in reusable service
 * - Single validation point
 * - Service handles all errors
 * - Route only handles HTTP concerns
 * 
 * BENEFITS:
 * ✓ Services can be tested without HTTP
 * ✓ Services can be called from CLI, jobs, webhooks
 * ✓ Code reuse across multiple routes
 * ✓ Business logic easy to find
 * ✓ Routes are readable
 * ✓ Easier to debug (service has all context)
 * 
 * TO APPLY THIS PATTERN:
 * 1. Identify heavy route file (30+ lines per endpoint)
 * 2. Create service: backend/services/FeatureService.js
 * 3. Move business logic to service methods
 * 4. Update route to call service
 * 5. Write service tests
 */
