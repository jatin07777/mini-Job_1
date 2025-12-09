// ============================================
// Jobs Routes
// ============================================
// Handles job-related endpoints (CRUD operations)

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verifyToken, checkRole } = require('../middleware/auth');

// ============================================
// Get All Jobs
// ============================================
// GET /api/jobs
// Retrieves all active jobs with optional filters
router.get('/', async (req, res) => {
    try {
        let sql = 'SELECT j.*, u.name as posted_by_name FROM jobs j LEFT JOIN users u ON j.posted_by = u.id WHERE j.status = "active"';
        const params = [];

        // Apply filters
        if (req.query.category) {
            sql += ' AND j.category = ?';
            params.push(req.query.category);
        }

        if (req.query.location) {
            sql += ' AND j.location = ?';
            params.push(req.query.location);
        }

        if (req.query.search) {
            sql += ' AND (j.title LIKE ? OR j.description LIKE ? OR j.company_name LIKE ?)';
            const searchTerm = `%${req.query.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Order by created date (newest first)
        sql += ' ORDER BY j.created_at DESC';

        // Apply limit
        if (req.query.limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(req.query.limit));
        }

        const jobs = await query(sql, params);

        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs'
        });
    }
});

// ============================================
// Get Single Job
// ============================================
// GET /api/jobs/:id
// Retrieves details of a specific job
router.get('/:id', async (req, res) => {
    try {
        const jobId = req.params.id;

        const jobs = await query(
            'SELECT j.*, u.name as posted_by_name FROM jobs j LEFT JOIN users u ON j.posted_by = u.id WHERE j.id = ?',
            [jobId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            job: jobs[0]
        });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job'
        });
    }
});

// ============================================
// Create New Job (Recruiter Only)
// ============================================
// POST /api/jobs
// Creates a new job posting (requires recruiter authentication)
router.post('/', verifyToken, checkRole(['recruiter']), async (req, res) => {
    try {
        const { title, description, category, location, salary, company_name } = req.body;

        // Validate input
        if (!title || !description || !category || !location || !salary || !company_name) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Insert new job
        const result = await query(
            'INSERT INTO jobs (title, description, category, location, salary, company_name, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, category, location, salary, company_name, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            job: {
                id: result.insertId,
                title,
                description,
                category,
                location,
                salary,
                company_name
            }
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating job'
        });
    }
});

// ============================================
// Update Job (Recruiter Only)
// ============================================
// PUT /api/jobs/:id
// Updates an existing job posting
router.put('/:id', verifyToken, checkRole(['recruiter']), async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, category, location, salary, company_name, status } = req.body;

        // Check if job exists and belongs to user
        const jobs = await query('SELECT * FROM jobs WHERE id = ? AND posted_by = ?', [jobId, req.user.id]);
        
        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or you do not have permission to update it'
            });
        }

        // Update job
        await query(
            'UPDATE jobs SET title = ?, description = ?, category = ?, location = ?, salary = ?, company_name = ?, status = ? WHERE id = ?',
            [title, description, category, location, salary, company_name, status || 'active', jobId]
        );

        res.json({
            success: true,
            message: 'Job updated successfully'
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job'
        });
    }
});

// ============================================
// Delete Job (Recruiter Only)
// ============================================
// DELETE /api/jobs/:id
// Deletes a job posting
router.delete('/:id', verifyToken, checkRole(['recruiter']), async (req, res) => {
    try {
        const jobId = req.params.id;

        // Check if job exists and belongs to user
        const jobs = await query('SELECT * FROM jobs WHERE id = ? AND posted_by = ?', [jobId, req.user.id]);
        
        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or you do not have permission to delete it'
            });
        }

        // Delete job
        await query('DELETE FROM jobs WHERE id = ?', [jobId]);

        res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting job'
        });
    }
});

// ============================================
// Get Recruiter's Jobs
// ============================================
// GET /api/jobs/recruiter/my-jobs
// Gets all jobs posted by the authenticated recruiter
router.get('/recruiter/my-jobs', verifyToken, checkRole(['recruiter']), async (req, res) => {
    try {
        const jobs = await query(
            'SELECT j.*, COUNT(a.id) as application_count FROM jobs j LEFT JOIN applications a ON j.id = a.job_id WHERE j.posted_by = ? GROUP BY j.id ORDER BY j.created_at DESC',
            [req.user.id]
        );

        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Get recruiter jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs'
        });
    }
});

module.exports = router;


