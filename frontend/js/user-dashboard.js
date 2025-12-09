// ============================================
// User Dashboard JavaScript
// ============================================
// Handles job seeker dashboard functionality

// ============================================
// Check Authentication on Page Load
// ============================================
// Verifies user is logged in and is a job seeker
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role !== 'job_seeker') {
        window.location.href = 'index.html';
        return;
    }
    
    // Display user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
    
    // Load profile info
    loadProfileInfo();
    
    // Load applications
    loadApplications();
    
    // Load saved jobs
    loadSavedJobs();
});

// ============================================
// Switch Tab
// ============================================
// Switches between dashboard tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.dashboard-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// ============================================
// Load Profile Info
// ============================================
// Loads and displays user profile information
function loadProfileInfo() {
    const user = getCurrentUser();
    
    if (user) {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileRole = document.getElementById('profileRole');
        
        if (profileName) profileName.textContent = user.name;
        if (profileEmail) profileEmail.textContent = user.email;
        if (profileRole) profileRole.textContent = user.role === 'job_seeker' ? 'Job Seeker' : 'Recruiter';
    }
}

// ============================================
// Load Applications
// ============================================
// Fetches and displays user's job applications
async function loadApplications() {
    const tableBody = document.getElementById('applicationsTableBody');
    if (!tableBody) return;
    
    try {
        const response = await makeRequest('/applications/my-applications');
        
        if (response.success && response.data.applications) {
            const applications = response.data.applications;
            
            if (applications.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No applications found</td></tr>';
            } else {
                tableBody.innerHTML = applications.map(app => `
                    <tr>
                        <td><a href="job-details.html?id=${app.job_id}" style="color: var(--primary-color);">${escapeHtml(app.title)}</a></td>
                        <td>${escapeHtml(app.company_name || 'N/A')}</td>
                        <td>${escapeHtml(app.location || 'N/A')}</td>
                        <td>${formatDate(app.applied_at)}</td>
                        <td><span class="status-badge status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
                        <td>
                            <a href="job-details.html?id=${app.job_id}" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                                View Job
                            </a>
                        </td>
                    </tr>
                `).join('');
            }
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading applications</td></tr>';
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading applications</td></tr>';
    }
}

// ============================================
// Load Saved Jobs
// ============================================
// Fetches and displays user's saved jobs
async function loadSavedJobs() {
    const savedJobsGrid = document.getElementById('savedJobsGrid');
    if (!savedJobsGrid) return;
    
    try {
        const response = await makeRequest('/saved-jobs');
        
        if (response.success && response.data.savedJobs) {
            const savedJobs = response.data.savedJobs;
            
            if (savedJobs.length === 0) {
                savedJobsGrid.innerHTML = '<div class="empty-state"><h3>No saved jobs</h3><p>Start saving jobs you're interested in!</p></div>';
            } else {
                savedJobsGrid.innerHTML = savedJobs.map(job => `
                    <div class="job-card">
                        <div class="job-card-header">
                            <div>
                                <h3 class="job-title">${escapeHtml(job.title)}</h3>
                                <p class="job-company">${escapeHtml(job.company_name || 'Company')}</p>
                            </div>
                            <span class="job-badge">${escapeHtml(job.category)}</span>
                        </div>
                        <div class="job-details">
                            <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
                            <span><i class="fas fa-dollar-sign"></i> ${escapeHtml(job.salary || 'Not specified')}</span>
                        </div>
                        <div class="job-card-footer">
                            <button class="btn-primary" onclick="viewJobDetails(${job.id})">View Details</button>
                            <button class="btn-secondary" onclick="removeSavedJob(${job.id})">Remove</button>
                        </div>
                    </div>
                `).join('');
            }
        } else {
            savedJobsGrid.innerHTML = '<div class="empty-state">Error loading saved jobs</div>';
        }
    } catch (error) {
        console.error('Error loading saved jobs:', error);
        savedJobsGrid.innerHTML = '<div class="empty-state">Error loading saved jobs</div>';
    }
}

// ============================================
// Remove Saved Job
// ============================================
// Removes a job from saved jobs list
async function removeSavedJob(jobId) {
    if (!confirm('Are you sure you want to remove this job from your saved list?')) {
        return;
    }
    
    try {
        const response = await makeRequest(`/saved-jobs/${jobId}`, 'DELETE');
        
        if (response.success) {
            alert('Job removed from saved list');
            loadSavedJobs();
        } else {
            alert('Error removing job');
        }
    } catch (error) {
        console.error('Error removing saved job:', error);
        alert('Error removing job');
    }
}

// ============================================
// View Job Details
// ============================================
// Redirects to job details page
function viewJobDetails(jobId) {
    window.location.href = `job-details.html?id=${jobId}`;
}

// ============================================
// Handle Logout
// ============================================
// Logs out the user and redirects to home page
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
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
