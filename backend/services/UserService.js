/**
 * Service Layer Architecture
 * 
 * Separates business logic from route handlers
 * Makes code testable, reusable, and maintainable
 * 
 * Pattern:
 * Route Handler (thin) → Service Layer (business logic) → Data Layer (models)
 */

const User = require('../models/usermodel');
const { hashPassword, compareHashedPassword } = require('../auth/hashpassword');
const jwt = require('jsonwebtoken');
const { errorLogger } = require('../helpers/logger');

class UserService {
    /**
     * Create a new user with validation
     * @param {Object} userData - { email, name, password }
     * @returns {Object} User object (without password)
     * @throws {Error} If email already exists or validation fails
     */
    static async createUser(userData) {
        try {
            const { email, name, password } = userData;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                const error = new Error('Email already exists');
                error.statusCode = 400;
                throw error;
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create user
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'employee' // Default role
            });

            // Return user without password
            return this._formatUserResponse(newUser);
        } catch (error) {
            errorLogger(error, { context: 'UserService.createUser' });
            throw error;
        }
    }

    /**
     * Authenticate user and return JWT token
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} { token, user }
     * @throws {Error} If credentials invalid or user not found
     */
    static async authenticateUser(email, password) {
        try {
            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            // Verify password
            const passwordMatch = await compareHashedPassword(password, user.password);
            if (!passwordMatch) {
                const error = new Error('Incorrect password');
                error.statusCode = 401;
                throw error;
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET || 'boss',
                { expiresIn: '1h' }
            );

            return {
                token,
                user: this._formatUserResponse(user)
            };
        } catch (error) {
            errorLogger(error, { context: 'UserService.authenticateUser' });
            throw error;
        }
    }

    /**
     * Get user by ID
     * @param {number} userId - User ID
     * @returns {Object} User object (without password)
     * @throws {Error} If user not found
     */
    static async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            return this._formatUserResponse(user);
        } catch (error) {
            errorLogger(error, { context: 'UserService.getUserById', userId });
            throw error;
        }
    }

    /**
     * Get all users
     * @param {Object} options - { limit, offset, role }
     * @returns {Array} User objects (without passwords)
     */
    static async getAllUsers(options = {}) {
        try {
            const { limit = 50, offset = 0, role } = options;
            const where = role ? { role } : {};

            const users = await User.findAll({
                where,
                attributes: { exclude: ['password'] },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return users;
        } catch (error) {
            errorLogger(error, { context: 'UserService.getAllUsers' });
            throw error;
        }
    }

    /**
     * Update user profile
     * @param {number} userId - User ID
     * @param {Object} updateData - Data to update (name, email, password)
     * @param {boolean} isAdmin - If user making request is admin
     * @returns {Object} Updated user (without password)
     */
    static async updateUser(userId, updateData, isAdmin = false) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            // Check if email is already taken (by different user)
            if (updateData.email && updateData.email !== user.email) {
                const existingUser = await User.findOne({
                    where: { email: updateData.email }
                });
                if (existingUser) {
                    const error = new Error('Email already taken');
                    error.statusCode = 400;
                    throw error;
                }
            }

            // Prepare update data
            const updates = {
                name: updateData.name || user.name,
                email: updateData.email || user.email
            };

            // Only admins can change role
            if (isAdmin && updateData.role) {
                updates.role = updateData.role;
            }

            // Hash new password if provided
            if (updateData.password) {
                updates.password = await hashPassword(updateData.password);
            }

            await user.update(updates);
            return this._formatUserResponse(user);
        } catch (error) {
            errorLogger(error, { context: 'UserService.updateUser', userId });
            throw error;
        }
    }

    /**
     * Delete user
     * @param {number} userId - User ID to delete
     * @returns {boolean} True if deleted
     */
    static async deleteUser(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            await user.destroy();
            return true;
        } catch (error) {
            errorLogger(error, { context: 'UserService.deleteUser', userId });
            throw error;
        }
    }

    /**
     * Helper: Format user response (remove password)
     * @private
     */
    static _formatUserResponse(user) {
        const { password, ...userWithoutPassword } = user.dataValues || user;
        return userWithoutPassword;
    }
}

module.exports = UserService;
