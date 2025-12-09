// ============================================
// Authentication Middleware
// ============================================
// Middleware to verify JWT tokens and protect routes

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// ============================================
// Verify Token Middleware
// ============================================
// Verifies JWT token and attaches user data to request object
async function verifyToken(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Access denied.'
            });
        }

        // Extract token
        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here_change_in_production');

        // Get user from database
        const users = await query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.userId]);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Attach user to request object
        req.user = users[0];
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Token verification failed.'
        });
    }
}

// ============================================
// Check Role Middleware
// ============================================
// Middleware to check if user has required role
function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
}

module.exports = {
    verifyToken,
    checkRole
};


