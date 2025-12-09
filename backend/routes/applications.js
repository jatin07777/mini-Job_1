// ============================================
// Applications Routes
// ============================================
// Handles job application endpoints

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verifyToken, checkRole } = require('../middleware/auth');

// ============================================
// Apply for Job (Job Seeker Only)
// ============================================
// POST /api/applications
// Submits a job application
router.post('/', verifyToken, checkRole(['job_seeker']), async (req, res) => {
    try {
        const { job_id, cover_letter } = req.body;
        const user_id = req.user.id;

        // Validate input
        if (!job_id) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required'
            });
        }

        // Check if job exists
        const jobs = await query('SELECT * FROM jobs WHERE id = ? AND status = "active"', [job_id]);
        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or not available'
            });
        }

        // Check if already applied
        const existingApplications = await query(
            'SELECT * FROM applications WHERE job_id = ? AND user_id = ?',
            [job_id, user_id]
        );

        if (existingApplications.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Create application
        const result = await query(
            'INSERT INTO applications (job_id, user_id, cover_letter) VALUES (?, ?, ?)',
            [job_id, user_id, cover_letter || '']
        );

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: {
                id: result.insertId,
                job_id,
                user_id,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Apply job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application'
        });
    }
});

// ============================================
// Get User's Applications (Job Seeker Only)
// ============================================
// GET /api/applications/my-applications
// Gets all applications submitted by the authenticated job seeker
router.get('/my-applications', verifyToken, checkRole(['job_seeker']), async (req, res) => {
    try {
        const applications = await query(
            `SELECT a.*, j.title, j.company_name, j.location, j.salary, j.status as job_status
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.user_id = ?
             ORDER BY a.applied_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications'
        });
    }
});

// ============================================
// Get Applications for Job (Recruiter Only)
// ============================================
// GET /api/applications/job/:jobId
// Gets all applications for a specific job (recruiter's own jobs only)
router.get('/job/:jobId', verifyToken, checkRole(['recruiter']), async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Verify job belongs to recruiter
        const jobs = await query('SELECT * FROM jobs WHERE id = ? AND posted_by = ?', [jobId, req.user.id]);
        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or access denied'
            });
        }

        const applications = await query(
            `SELECT a.*, u.name as applicant_name, u.email as applicant_email
             FROM applications a
             JOIN users u ON a.user_id = u.id
             WHERE a.job_id = ?
             ORDER BY a.applied_at DESC`,
            [jobId]
        );

        res.json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Get job applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications'
        });
    }
});

// ============================================
// Update Application Status (Recruiter Only)
// ============================================
// PUT /api/applications/:id/status
// Updates the status of an application
router.put('/:id/status', verifyToken, checkRole(['recruiter']), async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Get application and verify job belongs to recruiter
        const applications = await query(
            `SELECT a.* FROM applications a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.id = ? AND j.posted_by = ?`,
            [applicationId, req.user.id]
        );

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Application not found or access denied'
            });
        }

        // Update status
        await query('UPDATE applications SET status = ? WHERE id = ?', [status, applicationId]);

        res.json({
            success: true,
            message: 'Application status updated successfully'
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating application status'
        });
    }
});

module.exports = router;
