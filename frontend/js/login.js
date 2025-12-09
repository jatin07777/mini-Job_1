// ============================================
// Login Page JavaScript
// ============================================
// Handles user authentication and login functionality

// ============================================
// Handle Login Form Submission
// ============================================
// Processes login form submission and authenticates user
async function handleLogin(event) {
    event.preventDefault();
    clearErrors();

    // Get form data
    const formData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };

    // Validate form data
    if (!validateLoginForm(formData)) {
        return;
    }

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
        // Make API request to login endpoint
        const response = await makeRequest('/auth/login', 'POST', formData);

        if (response.success && response.data.success) {
            // Store user data in localStorage
            const userData = {
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                role: response.data.user.role,
                token: response.data.token
            };
            localStorage.setItem('user', JSON.stringify(userData));

            // Show success message
            showMessage('Login successful! Redirecting...', 'success');

            // Redirect to appropriate dashboard
            setTimeout(() => {
                redirectByRole(userData.role);
            }, 1000);
        } else {
            // Show error message
            const errorMsg = response.data?.message || 'Login failed. Please check your credentials.';
            showMessage(errorMsg, 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// ============================================
// Validate Login Form
// ============================================
// Validates login form inputs before submission
function validateLoginForm(formData) {
    let isValid = true;

    // Validate email
    if (!formData.email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!formData.password) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (formData.password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}

// ============================================
// Check if Already Logged In
// ============================================
// Redirects user if they are already authenticated
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        redirectByRole(user.role);
    }
});


