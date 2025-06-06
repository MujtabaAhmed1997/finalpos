// middleware/adminAuth.js

module.exports = (req, res, next) => {
    // Assuming the user's role is stored in req.user after authentication
    if (req.user && req.user.role === 'admin') {
      return next(); // User is an admin, proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  };
  