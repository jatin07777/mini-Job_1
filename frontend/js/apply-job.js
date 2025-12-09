// ============================================
// Apply Job Page JavaScript
// ============================================
// Handles job application submission

// ============================================
// Load Job Info on Page Load
// ============================================
// Fetches job information when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user || user.role !== 'job_seeker') {
        alert('Please login as a job seeker to apply for jobs');
        window.location.href = 'login.html';
        return;
    }
    
    loadJobInfo();
});

// ============================================
// Load Job Info Function
// ============================================
// Fetches job information and displays it
async function loadJobInfo() {
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    
    if (!jobId) {
        showMessage('Job ID not provided', 'error');
        return;
    }
    
    const jobInfoCard = document.getElementById('jobInfoCard');
    const jobTitle = document.getElementById('jobTitle');
    const jobCompany = document.getElementById('jobCompany');
    const jobLocation = document.getElementById('jobLocation');
    
    try {
        const response = await makeRequest(`/jobs/${jobId}`);
        
        if (response.success && response.data.job) {
            const job = response.data.job;
            
            if (jobInfoCard) jobInfoCard.style.display = 'block';
            if (jobTitle) jobTitle.textContent = job.title;
            if (jobCompany) jobCompany.textContent = job.company_name || 'Company';
            if (jobLocation) jobLocation.textContent = job.location;
            
            // Store job ID for form submission
            document.getElementById('applyForm').dataset.jobId = jobId;
            
            // Check if already applied
            checkIfAlreadyApplied(jobId);
        } else {
            showMessage('Job not found', 'error');
        }
    } catch (error) {
        console.error('Error loading job info:', error);
        showMessage('Error loading job information', 'error');
    }
}

// ============================================
// Handle Apply Form Submission
// ============================================
// Handles job application form submission
async function handleApply(event) {
    event.preventDefault();
    
    clearErrors();
    
    const form = event.target;
    const jobId = form.dataset.jobId;
    const coverLetter = document.getElementById('coverLetter').value.trim();
    
    // Validate cover letter
    if (coverLetter.length < 20) {
        showFieldError('coverLetter', 'Cover letter must be at least 20 characters');
        return;
    }
    
    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    try {
        const response = await makeRequest('/applications', 'POST', {
            job_id: parseInt(jobId),
            cover_letter: coverLetter
        });
        
        if (response.success) {
            showMessage('Application submitted successfully!', 'success');
            form.reset();
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 2000);
        } else {
            showMessage(response.data?.message || 'Error submitting application', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        showMessage('Error submitting application. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================
// Check If Already Applied
// ============================================
// Checks if user has already applied for this job
async function checkIfAlreadyApplied(jobId) {
    try {
        const response = await makeRequest('/applications/my-applications');
        
        if (response.success && response.data.applications) {
            const hasApplied = response.data.applications.some(app => app.job_id == jobId);
            
            if (hasApplied) {
                showMessage('You have already applied for this job', 'error');
                const form = document.getElementById('applyForm');
                if (form) {
                    form.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error checking application status:', error);
    }
}
