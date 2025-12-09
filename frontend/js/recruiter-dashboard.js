// ============================================
// Recruiter Dashboard JavaScript
// ============================================
// Handles recruiter dashboard functionality

// ============================================
// Check Authentication on Page Load
// ============================================
// Verifies user is logged in and is a recruiter
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role !== 'recruiter') {
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
    
    // Load jobs
    loadMyJobs();
    
    // Load jobs for applications dropdown
    loadJobsForApplications();
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
        if (profileRole) profileRole.textContent = user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker';
    }
}

// ============================================
// Load My Jobs
// ============================================
// Fetches and displays recruiter's job postings
async function loadMyJobs() {
    const tableBody = document.getElementById('jobsTableBody');
    if (!tableBody) return;
    
    try {
        const response = await makeRequest('/jobs/recruiter/my-jobs');
        
        if (response.success && response.data.jobs) {
            const jobs = response.data.jobs;
            
            if (jobs.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No jobs posted yet. Post your first job!</td></tr>';
            } else {
                tableBody.innerHTML = jobs.map(job => `
                    <tr>
                        <td><strong>${escapeHtml(job.title)}</strong></td>
                        <td>${escapeHtml(job.category)}</td>
                        <td>${escapeHtml(job.location)}</td>
                        <td>${job.application_count || 0}</td>
                        <td><span class="status-badge status-${job.status}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span></td>
                        <td>${formatDate(job.created_at)}</td>
                        <td>
                            <button class="btn-secondary" onclick="viewJobApplications(${job.id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-right: 0.5rem;">
                                View Applications
                            </button>
                            <button class="btn-primary" onclick="editJob(${job.id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-right: 0.5rem;">
                                Edit
                            </button>
                            <button class="btn-secondary" onclick="deleteJob(${job.id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: #ef4444; border-color: #ef4444;">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        } else {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error loading jobs</td></tr>';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error loading jobs</td></tr>';
    }
}

// ============================================
// Load Jobs for Applications Dropdown
// ============================================
// Loads jobs for the applications dropdown
async function loadJobsForApplications() {
    const jobSelect = document.getElementById('jobSelect');
    if (!jobSelect) return;
    
    try {
        const response = await makeRequest('/jobs/recruiter/my-jobs');
        
        if (response.success && response.data.jobs) {
            const jobs = response.data.jobs;
            
            jobSelect.innerHTML = '<option value="">Select a job to view applications</option>' +
                jobs.map(job => `<option value="${job.id}">${escapeHtml(job.title)}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// ============================================
// Load Applications for Job
// ============================================
// Fetches and displays applications for selected job
async function loadApplicationsForJob() {
    const jobId = document.getElementById('jobSelect').value;
    const tableBody = document.getElementById('applicationsTableBody');
    
    if (!jobId) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Select a job to view applications</td></tr>';
        return;
    }
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading applications...</td></tr>';
    
    try {
        const response = await makeRequest(`/applications/job/${jobId}`);
        
        if (response.success && response.data.applications) {
            const applications = response.data.applications;
            
            if (applications.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No applications for this job</td></tr>';
            } else {
                tableBody.innerHTML = applications.map(app => `
                    <tr>
                        <td>${escapeHtml(app.applicant_name)}</td>
                        <td>${escapeHtml(app.applicant_email)}</td>
                        <td>${formatDate(app.applied_at)}</td>
                        <td><span class="status-badge status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
                        <td>
                            <select onchange="updateApplicationStatus(${app.id}, this.value)" style="padding: 0.5rem; border-radius: 4px;">
                                <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="reviewed" ${app.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                                <option value="accepted" ${app.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                                <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        </td>
                    </tr>
                `).join('');
            }
        } else {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading applications</td></tr>';
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading applications</td></tr>';
    }
}

// ============================================
// Update Application Status
// ============================================
// Updates the status of an application
async function updateApplicationStatus(applicationId, status) {
    try {
        const response = await makeRequest(`/applications/${applicationId}/status`, 'PUT', { status });
        
        if (response.success) {
            alert('Application status updated successfully');
            loadApplicationsForJob();
        } else {
            alert('Error updating application status');
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        alert('Error updating application status');
    }
}

// ============================================
// Show Post Job Modal
// ============================================
// Displays the post job modal
function showPostJobModal() {
    const modal = document.getElementById('postJobModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// ============================================
// Close Post Job Modal
// ============================================
// Closes the post job modal
function closePostJobModal() {
    const modal = document.getElementById('postJobModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('postJobForm').reset();
    }
}

// ============================================
// Handle Post Job
// ============================================
// Handles job posting form submission
async function handlePostJob(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        title: form.jobTitle.value.trim(),
        company_name: form.companyName.value.trim(),
        description: form.jobDescription.value.trim(),
        category: form.jobCategory.value,
        location: form.jobLocation.value.trim(),
        salary: form.jobSalary.value.trim()
    };
    
    // Validate form
    if (!formData.title || !formData.company_name || !formData.description || 
        !formData.category || !formData.location || !formData.salary) {
        alert('Please fill in all fields');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
    
    try {
        const response = await makeRequest('/jobs', 'POST', formData);
        
        if (response.success) {
            alert('Job posted successfully!');
            closePostJobModal();
            loadMyJobs();
            loadJobsForApplications();
        } else {
            alert(response.data?.message || 'Error posting job');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error posting job:', error);
        alert('Error posting job. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================
// View Job Applications
// ============================================
// Switches to applications tab and loads applications for job
function viewJobApplications(jobId) {
    switchTab('applications');
    document.getElementById('jobSelect').value = jobId;
    loadApplicationsForJob();
}

// ============================================
// Edit Job
// ============================================
// Opens edit job modal (simplified - can be enhanced)
function editJob(jobId) {
    alert('Edit functionality can be enhanced. Job ID: ' + jobId);
}

// ============================================
// Delete Job
// ============================================
// Deletes a job posting
async function deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await makeRequest(`/jobs/${jobId}`, 'DELETE');
        
        if (response.success) {
            alert('Job deleted successfully');
            loadMyJobs();
            loadJobsForApplications();
        } else {
            alert('Error deleting job');
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
    }
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
