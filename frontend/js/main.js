// ============================================
// Main JavaScript File
// ============================================
// Contains common functions used across the application

// ============================================
// Mobile Navigation Toggle
// ============================================
// Toggles the mobile menu when hamburger icon is clicked
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
});

// ============================================
// Role Selection Function
// ============================================
// Handles role selection in login and register forms
function selectRole(role) {
    // Remove active class from all role options
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.classList.remove('active');
    });

    // Add active class to selected role
    const selectedOption = document.querySelector(`[data-role="${role}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }

    // Update hidden input field
    const roleInput = document.getElementById('role');
    if (roleInput) {
        roleInput.value = role;
    }
}

// ============================================
// Get Role from URL Parameters
// ============================================
// Extracts role from URL query parameters (used in register page)
function getRoleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    if (role === 'job_seeker' || role === 'recruiter') {
        selectRole(role);
    }
}

// ============================================
// Display Message Function
// ============================================
// Shows success or error messages to the user
function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
        color: ${type === 'success' ? '#065f46' : '#991b1b'};
        border: 1px solid ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    messageDiv.textContent = message;

    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageDiv);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ============================================
// Clear Error Messages
// ============================================
// Removes all error messages from form fields
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.textContent = '';
    });
}

// ============================================
// Show Field Error
// ============================================
// Displays an error message for a specific form field
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// ============================================
// Validate Email
// ============================================
// Validates email format using regex
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// Check Authentication Status
// ============================================
// Checks if user is logged in by checking localStorage
function isAuthenticated() {
    const user = localStorage.getItem('user');
    return user !== null;
}

// ============================================
// Get Current User
// ============================================
// Retrieves current user data from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// ============================================
// Redirect Based on Role
// ============================================
// Redirects user to appropriate dashboard based on their role
function redirectByRole(role) {
    if (role === 'job_seeker') {
        window.location.href = 'user-dashboard.html';
    } else if (role === 'recruiter') {
        window.location.href = 'recruiter-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

// ============================================
// API Base URL
// ============================================
// Base URL for backend API calls
const API_BASE_URL = 'http://localhost:3000/api';

// ============================================
// Make API Request
// ============================================
// Generic function to make API requests
async function makeRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add token if user is authenticated
    const user = getCurrentUser();
    if (user && user.token) {
        options.headers['Authorization'] = `Bearer ${user.token}`;
    }

    // Add data for POST/PUT requests
    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        return { success: response.ok, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// Format Date
// ============================================
// Formats date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ============================================
// Filter Jobs by Category
// ============================================
// Redirects to job listings page with category filter
function filterByCategory(category) {
    window.location.href = `job-listings.html?category=${encodeURIComponent(category)}`;
}

// ============================================
// Search Jobs
// ============================================
// Redirects to job listings page with search query
function searchJobs() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');

    const params = new URLSearchParams();
    
    if (searchInput && searchInput.value.trim()) {
        params.append('search', searchInput.value.trim());
    }
    if (categoryFilter && categoryFilter.value) {
        params.append('category', categoryFilter.value);
    }
    if (locationFilter && locationFilter.value) {
        params.append('location', locationFilter.value);
    }

    const queryString = params.toString();
    window.location.href = `job-listings.html${queryString ? '?' + queryString : ''}`;
}

// Initialize role selection from URL on page load
document.addEventListener('DOMContentLoaded', function() {
    getRoleFromURL();
});
