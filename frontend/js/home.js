// ============================================
// Home Page JavaScript
// ============================================
// Handles home page functionality including loading recent jobs

// ============================================
// Load Recent Jobs
// ============================================
// Fetches and displays recent job postings on the home page
async function loadRecentJobs() {
    const jobsGrid = document.getElementById('recentJobs');
    if (!jobsGrid) return;

    try {
        // Make API request to get recent jobs
        const response = await makeRequest('/jobs?limit=6&status=active');

        if (response.success && response.data.jobs) {
            const jobs = response.data.jobs || [];
            
            if (jobs.length === 0) {
                jobsGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-briefcase"></i>
                        <p>No jobs available at the moment. Check back later!</p>
                    </div>
                `;
                return;
            }

            // Render job cards
            jobsGrid.innerHTML = jobs.map(job => createJobCard(job)).join('');
        } else {
            jobsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load jobs. Please try again later.</p>
                </div>
            `;
        }
    } catch (error) {
        jobsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading jobs. Please check your connection.</p>
            </div>
        `;
    }
}

// ============================================
// Create Job Card HTML
// ============================================
// Generates HTML for a job card component
function createJobCard(job) {
    const formattedDate = formatDate(job.created_at);
    
    return `
        <div class="job-card" onclick="window.location.href='job-details.html?id=${job.id}'">
            <div class="job-card-header">
                <div>
                    <h3 class="job-title">${escapeHtml(job.title)}</h3>
                    <p class="job-company">${escapeHtml(job.company_name)}</p>
                </div>
                <span class="job-badge">${escapeHtml(job.category)}</span>
            </div>
            <div class="job-details">
                <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
                <span><i class="fas fa-dollar-sign"></i> ${escapeHtml(job.salary)}</span>
            </div>
            <p style="color: var(--text-light); font-size: 0.9rem; margin: 1rem 0;">
                ${escapeHtml(job.description.substring(0, 100))}...
            </p>
            <div class="job-card-footer">
                <span style="color: var(--text-light); font-size: 0.85rem;">
                    <i class="fas fa-clock"></i> ${formattedDate}
                </span>
                <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                    View Details
                </button>
            </div>
        </div>
    `;
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

// ============================================
// Initialize Home Page
// ============================================
// Initializes home page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadRecentJobs();
});
