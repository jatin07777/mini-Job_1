// ============================================
// Registration Page JavaScript
// ============================================
// Handles user registration and account creation

// ============================================
// Handle Registration Form Submission
// ============================================
// Processes registration form submission and creates new user account
async function handleRegister(event) {
    event.preventDefault();
    clearErrors();

    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        role: document.getElementById('role').value
    };

    // Check terms acceptance
    const termsCheckbox = document.querySelector('input[name="terms"]');
    if (!termsCheckbox.checked) {
        showFieldError('terms', 'You must agree to the terms and conditions');
        return;
    }

    // Validate form data
    if (!validateRegisterForm(formData)) {
        return;
    }

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    try {
        // Prepare data for API (remove confirmPassword)
        const apiData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role
        };

        // Make API request to register endpoint
        const response = await makeRequest('/auth/register', 'POST', apiData);

        if (response.success && response.data.success) {
            // Show success message
            showMessage('Account created successfully! Redirecting to login...', 'success');

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Show error message
            const errorMsg = response.data?.message || 'Registration failed. Please try again.';
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
// Validate Registration Form
// ============================================
// Validates registration form inputs before submission
function validateRegisterForm(formData) {
    let isValid = true;

    // Validate name
    if (!formData.name) {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else if (formData.name.length < 3) {
        showFieldError('name', 'Name must be at least 3 characters');
        isValid = false;
    }

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

    // Validate confirm password
    if (!formData.confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    return isValid;
}

// ============================================
// Real-time Password Match Validation
// ============================================
// Validates password match as user types
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            if (passwordInput.value && confirmPasswordInput.value) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    showFieldError('confirmPassword', 'Passwords do not match');
                } else {
                    showFieldError('confirmPassword', '');
                }
            }
        });
    }
});

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


