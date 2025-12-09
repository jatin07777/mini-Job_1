// ============================================
// Job Listings Page JavaScript
// ============================================
// Handles job listings display, search, and filtering

// ============================================
// Load Jobs on Page Load
// ============================================
// Fetches and displays jobs when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadJobs();
    
    // Apply filters from URL parameters
    applyFiltersFromURL();
});

// ============================================
// Load Jobs Function
// ============================================
// Fetches jobs from API and displays them
async function loadJobs() {
    const jobsGrid = document.getElementById('jobsGrid');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!jobsGrid) return;
    
    jobsGrid.innerHTML = '<div class="loading">Loading jobs...</div>';
    
    try {
        // Get filter parameters
        const params = new URLSearchParams(window.location.search);
        const searchParams = {};
        
        if (params.get('search')) searchParams.search = params.get('search');
        if (params.get('category')) searchParams.category = params.get('category');
        if (params.get('location')) searchParams.location = params.get('location');
        
        // Build query string
        const queryString = new URLSearchParams(searchParams).toString();
        const endpoint = `/jobs${queryString ? '?' + queryString : ''}`;
        
        const response = await makeRequest(endpoint);
        
        if (response.success && response.data.jobs) {
            const jobs = response.data.jobs;
            
            // Update results count
            if (resultsCount) {
                resultsCount.textContent = `Found ${jobs.length} job${jobs.length !== 1 ? 's' : ''}`;
            }
            
            // Display jobs
            if (jobs.length === 0) {
                jobsGrid.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
            } else {
                jobsGrid.style.display = 'grid';
                if (emptyState) emptyState.style.display = 'none';
                jobsGrid.innerHTML = jobs.map(job => createJobCard(job)).join('');
            }
        } else {
            jobsGrid.innerHTML = '<div class="empty-state">Error loading jobs. Please try again.</div>';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        jobsGrid.innerHTML = '<div class="empty-state">Error loading jobs. Please try again.</div>';
    }
}

// ============================================
// Create Job Card HTML
// ============================================
// Creates HTML for a single job card
function createJobCard(job) {
    return `
        <div class="job-card" onclick="viewJobDetails(${job.id})">
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
            <p class="job-description">${escapeHtml(job.description.substring(0, 150))}...</p>
            <div class="job-card-footer">
                <span style="color: var(--text-light); font-size: 0.9rem;">
                    <i class="fas fa-clock"></i> ${formatDate(job.created_at)}
                </span>
                <button class="btn-primary" onclick="event.stopPropagation(); viewJobDetails(${job.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
}

// ============================================
// View Job Details
// ============================================
// Redirects to job details page
function viewJobDetails(jobId) {
    window.location.href = `job-details.html?id=${jobId}`;
}

// ============================================
// Apply Filters
// ============================================
// Applies filters and reloads jobs
function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const location = document.getElementById('locationFilter')?.value || '';
    const salary = document.getElementById('salaryFilter')?.value || '';
    const search = document.getElementById('searchInput')?.value || '';
    
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (search) params.append('search', search);
    if (salary) params.append('salary', salary);
    
    const queryString = params.toString();
    window.location.href = `job-listings.html${queryString ? '?' + queryString : ''}`;
}

// ============================================
// Apply Filters from URL
// ============================================
// Sets filter values from URL parameters
function applyFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('category')) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.value = params.get('category');
    }
    
    if (params.get('location')) {
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) locationFilter.value = params.get('location');
    }
    
    if (params.get('search')) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = params.get('search');
    }
}

// ============================================
// Handle Search
// ============================================
// Handles search input with debounce
let searchTimeout;
function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters();
    }, 500);
}

// ============================================
// Clear Filters
// ============================================
// Clears all filters and reloads jobs
function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('salaryFilter').value = '';
    document.getElementById('searchInput').value = '';
    window.location.href = 'job-listings.html';
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
