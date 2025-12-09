// ============================================
// Saved Jobs Routes
// ============================================
// Handles saved jobs endpoints for job seekers

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verifyToken, checkRole } = require('../middleware/auth');

// ============================================
// Save Job (Job Seeker Only)
// ============================================
// POST /api/saved-jobs
// Saves a job for later viewing
router.post('/', verifyToken, checkRole(['job_seeker']), async (req, res) => {
    try {
        const { job_id } = req.body;
        const user_id = req.user.id;

        // Validate input
        if (!job_id) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required'
            });
        }

        // Check if job exists
        const jobs = await query('SELECT * FROM jobs WHERE id = ?', [job_id]);
        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if already saved
        const existingSaved = await query(
            'SELECT * FROM saved_jobs WHERE job_id = ? AND user_id = ?',
            [job_id, user_id]
        );

        if (existingSaved.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Job already saved'
            });
        }

        // Save job
        await query('INSERT INTO saved_jobs (job_id, user_id) VALUES (?, ?)', [job_id, user_id]);

        res.status(201).json({
            success: true,
            message: 'Job saved successfully'
        });
    } catch (error) {
        console.error('Save job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving job'
        });
    }
});

// ============================================
// Get Saved Jobs (Job Seeker Only)
// ============================================
// GET /api/saved-jobs
// Gets all saved jobs for the authenticated user
router.get('/', verifyToken, checkRole(['job_seeker']), async (req, res) => {
    try {
        const savedJobs = await query(
            `SELECT j.*, sj.saved_at
             FROM saved_jobs sj
             JOIN jobs j ON sj.job_id = j.id
             WHERE sj.user_id = ?
             ORDER BY sj.saved_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            savedJobs
        });
    } catch (error) {
        console.error('Get saved jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching saved jobs'
        });
    }
});

// ============================================
// Remove Saved Job (Job Seeker Only)
// ============================================
// DELETE /api/saved-jobs/:jobId
// Removes a job from saved list
router.delete('/:jobId', verifyToken, checkRole(['job_seeker']), async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id;

        // Delete saved job
        const result = await query(
            'DELETE FROM saved_jobs WHERE job_id = ? AND user_id = ?',
            [jobId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Saved job not found'
            });
        }

        res.json({
            success: true,
            message: 'Job removed from saved list'
        });
    } catch (error) {
        console.error('Remove saved job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing saved job'
        });
    }
});

module.exports = router;
