// ============================================
// Job Portal - Authentication JavaScript
// Handles login and registration functionality
// ============================================

// ============================================
// Registration Form Handler
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllErrors(registerForm);
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                role: document.querySelector('input[name="role"]:checked')?.value
            };
            
            // Validate form data
            let isValid = true;
            
            // Validate name
            if (!formData.name || formData.name.length < 2) {
                showFieldError('name', 'Name must be at least 2 characters long');
                isValid = false;
            }
            
            // Validate email
            if (!formData.email || !isValidEmail(formData.email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (!formData.password || formData.password.length < 6) {
                showFieldError('password', 'Password must be at least 6 characters long');
                isValid = false;
            }
            
            // Validate password confirmation
            if (formData.password !== formData.confirmPassword) {
                showFieldError('confirmPassword', 'Passwords do not match');
                isValid = false;
            }
            
            // Validate role
            if (!formData.role) {
                showFieldError('role', 'Please select a role');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Submit registration
            try {
                const response = await apiRequest('/auth/register', 'POST', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });
                
                showMessage('Registration successful! Redirecting to login...', 'success');
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } catch (error) {
                showMessage(error.message || 'Registration failed. Please try again.', 'error');
            }
        });
    }
});

// ============================================
// Login Form Handler
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllErrors(loginForm);
            
            // Get form data
            const formData = {
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                role: document.getElementById('role').value
            };
            
            // Validate form data
            let isValid = true;
            
            // Validate email
            if (!formData.email || !isValidEmail(formData.email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (!formData.password) {
                showFieldError('password', 'Please enter your password');
                isValid = false;
            }
            
            // Validate role
            if (!formData.role) {
                showFieldError('role', 'Please select your role');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Submit login
            try {
                const response = await apiRequest('/auth/login', 'POST', formData);
                
                // Store token and user data
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect based on user role
                setTimeout(() => {
                    redirectByRole(response.user.role);
                }, 1000);
                
            } catch (error) {
                showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
            }
        });
    }
});

// ============================================
// Logout Function
// ============================================
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

