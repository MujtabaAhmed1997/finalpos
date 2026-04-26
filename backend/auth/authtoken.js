const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }
  
    try {
      console.log("Found token:", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'boss');
      console.log('Decoded JWT:', decoded); // Log decoded token
      req.user = decoded;
      console.log(req.user);
      next();
    } catch (error) {
      console.log('Token verification failed:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  
module.exports = authMiddleware;
