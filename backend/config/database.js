// ============================================
// Database Configuration
// ============================================
// Handles MySQL database connection and configuration

const mysql = require('mysql2/promise');
require('dotenv').config();

// ============================================
// Create Database Connection Pool
// ============================================
// Creates a connection pool for efficient database operations
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'job_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ============================================
// Test Database Connection
// ============================================
// Tests the database connection on startup
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// ============================================
// Execute Query
// ============================================
// Generic function to execute database queries
async function query(sql, params = []) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// ============================================
// Export Functions
// ============================================
module.exports = {
    pool,
    query,
    testConnection
};


