// ============================================
// Job Details Page JavaScript
// ============================================
// Handles job details display and application

// ============================================
// Load Job Details on Page Load
// ============================================
// Fetches and displays job details when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadJobDetails();
});

// ============================================
// Load Job Details Function
// ============================================
// Fetches job details from API and displays them
async function loadJobDetails() {
    const container = document.getElementById('jobDetailsContainer');
    if (!container) return;
    
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (!jobId) {
        container.innerHTML = '<div class="empty-state"><h3>Job ID not provided</h3></div>';
        return;
    }
    
    container.innerHTML = '<div class="loading">Loading job details...</div>';
    
    try {
        const response = await makeRequest(`/jobs/${jobId}`);
        
        if (response.success && response.data.job) {
            const job = response.data.job;
            container.innerHTML = createJobDetailsHTML(job);
            
            // Check if user is logged in and is a job seeker
            const user = getCurrentUser();
            if (user && user.role === 'job_seeker') {
                checkApplicationStatus(jobId);
            }
        } else {
            container.innerHTML = '<div class="empty-state"><h3>Job not found</h3><p>The job you are looking for does not exist.</p></div>';
        }
    } catch (error) {
        console.error('Error loading job details:', error);
        container.innerHTML = '<div class="empty-state"><h3>Error loading job details</h3><p>Please try again later.</p></div>';
    }
}

// ============================================
// Create Job Details HTML
// ============================================
// Creates HTML for job details page
function createJobDetailsHTML(job) {
    const user = getCurrentUser();
    const isJobSeeker = user && user.role === 'job_seeker';
    const isRecruiter = user && user.role === 'recruiter';
    
    let actionButtons = '';
    
    if (isJobSeeker) {
        actionButtons = `
            <button class="btn-primary" id="applyBtn" onclick="applyForJob(${job.id})">
                <i class="fas fa-paper-plane"></i> Apply Now
            </button>
            <button class="btn-secondary" id="saveBtn" onclick="saveJob(${job.id})">
                <i class="fas fa-bookmark"></i> Save Job
            </button>
        `;
    } else if (!user) {
        actionButtons = `
            <a href="login.html?redirect=job-details.html?id=${job.id}" class="btn-primary">
                <i class="fas fa-sign-in-alt"></i> Login to Apply
            </a>
        `;
    }
    
    return `
        <div class="job-details-card">
            <div class="job-details-header">
                <div>
                    <h1>${escapeHtml(job.title)}</h1>
                    <p class="job-company-large">${escapeHtml(job.company_name || 'Company')}</p>
                    <div class="job-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
                        <span><i class="fas fa-dollar-sign"></i> ${escapeHtml(job.salary || 'Not specified')}</span>
                        <span><i class="fas fa-tag"></i> ${escapeHtml(job.category)}</span>
                    </div>
                </div>
                <div class="job-actions">
                    ${actionButtons}
                </div>
            </div>
            
            <div class="job-description-section">
                <h2>Job Description</h2>
                <div class="job-description-content">
                    ${escapeHtml(job.description).replace(/\n/g, '<br>')}
                </div>
            </div>
            
            <div class="job-info-section">
                <div class="info-item">
                    <h3><i class="fas fa-building"></i> Company</h3>
                    <p>${escapeHtml(job.company_name || 'Not specified')}</p>
                </div>
                <div class="info-item">
                    <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
                    <p>${escapeHtml(job.location)}</p>
                </div>
                <div class="info-item">
                    <h3><i class="fas fa-dollar-sign"></i> Salary</h3>
                    <p>${escapeHtml(job.salary || 'Not specified')}</p>
                </div>
                <div class="info-item">
                    <h3><i class="fas fa-tag"></i> Category</h3>
                    <p>${escapeHtml(job.category)}</p>
                </div>
                <div class="info-item">
                    <h3><i class="fas fa-calendar"></i> Posted</h3>
                    <p>${formatDate(job.created_at)}</p>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Apply for Job
// ============================================
// Redirects to apply job page
function applyForJob(jobId) {
    window.location.href = `apply-job.html?jobId=${jobId}`;
}

// ============================================
// Save Job
// ============================================
// Saves job to user's saved jobs list
async function saveJob(jobId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'job_seeker') {
        alert('Please login as a job seeker to save jobs');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await makeRequest('/saved-jobs', 'POST', { job_id: jobId });
        
        if (response.success) {
            alert('Job saved successfully!');
            const saveBtn = document.getElementById('saveBtn');
            if (saveBtn) {
                saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
                saveBtn.disabled = true;
            }
        } else {
            alert(response.data?.message || 'Error saving job');
        }
    } catch (error) {
        console.error('Error saving job:', error);
        alert('Error saving job. Please try again.');
    }
}

// ============================================
// Check Application Status
// ============================================
// Checks if user has already applied for this job
async function checkApplicationStatus(jobId) {
    try {
        const response = await makeRequest('/applications/my-applications');
        
        if (response.success && response.data.applications) {
            const hasApplied = response.data.applications.some(app => app.job_id == jobId);
            
            if (hasApplied) {
                const applyBtn = document.getElementById('applyBtn');
                if (applyBtn) {
                    applyBtn.innerHTML = '<i class="fas fa-check"></i> Already Applied';
                    applyBtn.disabled = true;
                    applyBtn.style.background = 'var(--secondary-color)';
                }
            }
        }
    } catch (error) {
        console.error('Error checking application status:', error);
    }
}

// ============================================
// Escape HTML
// ============================================
// Prevents XSS attacks by escaping HTML characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
