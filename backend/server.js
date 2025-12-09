// ============================================
// Job Portal - Express Server
// ============================================
// Main server file that sets up Express application
// and connects all routes and middleware
// ============================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

// Load environment variables
dotenv.config();

// ============================================
// Initialize Express App
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware Configuration
// ============================================
// Enable CORS for frontend requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============================================
// Import Routes
// ============================================
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const savedJobRoutes = require('./routes/savedJobs');

// ============================================
// API Routes
// ============================================
// Authentication routes (login, register)
app.use('/api/auth', authRoutes);

// Job routes (CRUD operations)
app.use('/api/jobs', jobRoutes);

// Application routes (apply, manage applications)
app.use('/api/applications', applicationRoutes);

// Saved jobs routes (save, view saved jobs)
app.use('/api/saved-jobs', savedJobRoutes);

// ============================================
// Health Check Endpoint
// ============================================
// Simple endpoint to check if server is running
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Job Portal API is running',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// Error Handling Middleware
// ============================================
// Global error handler for all routes
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// 404 Handler
// ============================================
// Handle requests to non-existent routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ============================================
// Start Server
// ============================================
// Initialize database connection and start listening
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Please check your configuration.');
            process.exit(1);
        }

        // Start listening on specified port
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
            console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

// Export app for testing purposes
module.exports = app;
