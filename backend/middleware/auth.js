const jwt = require('jsonwebtoken');

// Verify JWT token and attach user to request
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'boss');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// Role-based access control
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};

// Admin-only middleware
const isAdmin = requireRole('admin');

// Manager or admin
const isManagerOrAdmin = requireRole('manager', 'admin');

// Employee or manager or admin (everyone)
const isEmployee = requireRole('employee', 'manager', 'admin');

// Optional auth - doesn't fail if no token, just checks if valid
const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'boss');
            req.user = decoded;
        } catch (error) {
            // Token is invalid but we don't fail - just continue without user
            req.user = null;
        }
    } else {
        req.user = null;
    }
    
    next();
};

module.exports = {
    authMiddleware,
    requireRole,
    isAdmin,
    isManagerOrAdmin,
    isEmployee,
    optionalAuth
};
