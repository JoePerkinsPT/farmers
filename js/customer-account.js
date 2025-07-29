// Customer Account JavaScript Functionality (Combined Login/Signup)

// Global variables
let customers = getStorageData('customers', []);
let currentCustomer = getStorageData('currentCustomer', null);

// DOM elements
const loginForm = document.getElementById('customer-login-form');
const signupForm = document.getElementById('customer-signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the customer account page
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeLoginForm();
    initializeSignupForm();
    initializeForgotPasswordForm();
    
    // Check if user is already logged in
    if (currentCustomer) {
        window.location.href = 'customer-dashboard.html';
    }
});

// Initialize tab functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);
    
    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeContent.classList.add('active');
    }
}

// Initialize login form
function initializeLoginForm() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        
        // Add real-time validation
        const emailField = document.getElementById('login-email');
        if (emailField) {
            emailField.addEventListener('blur', function() {
                validateEmail(this);
            });
        }
    }
}

// Initialize signup form
function initializeSignupForm() {
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
        
        // Add real-time validation
        const requiredFields = signupForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        // Password confirmation validation
        const passwordField = document.getElementById('signup-password');
        const confirmPasswordField = document.getElementById('confirm-password');
        
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('input', function() {
                validatePasswordMatch();
            });
        }
        
        // Email validation
        const emailField = document.getElementById('signup-email');
        if (emailField) {
            emailField.addEventListener('blur', function() {
                validateEmail(this);
            });
        }
    }
}

// Initialize forgot password form
function initializeForgotPasswordForm() {
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
    }
}

// Handle login form submission
function handleLoginSubmit(event) {
    event.preventDefault();
    
    if (!validateLoginForm()) {
        showMessage('Please correct the errors in the form.', 'error');
        return;
    }
    
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Check for admin login first
    if (email === 'admin@britishfarm.co.uk' && password === 'admin123') {
        // Admin login successful
        const adminUser = {
            id: 'ADMIN_001',
            firstName: 'Admin',
            lastName: 'User',
            email: email,
            role: 'admin',
            dateCreated: new Date().toISOString()
        };
        
        setStorageData('currentCustomer', adminUser);
        setStorageData('isAdmin', true);
        
        // Update admin link visibility
        if (typeof checkAdminAuth === 'function') {
            checkAdminAuth();
        }
        
        showMessage('Admin login successful! Redirecting to admin panel...', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
        return;
    }
    
    // Find customer by email
    const customer = customers.find(c => c.email === email);
    
    if (!customer) {
        showMessage('No account found with this email address.', 'error');
        return;
    }
    
    // Verify password (simple hash comparison for demo)
    if (customer.password !== hashPassword(password)) {
        showMessage('Invalid password. Please try again.', 'error');
        return;
    }
    
    // Customer login successful
    setStorageData('currentCustomer', customer);
    setStorageData('isAdmin', false);
    
    // Update admin link visibility
    if (typeof checkAdminAuth === 'function') {
        checkAdminAuth();
    }
    
    showMessage('Login successful! Redirecting to your dashboard...', 'success');
    
    setTimeout(() => {
        window.location.href = 'customer-dashboard.html';
    }, 1500);
}

// Handle signup form submission
function handleSignupSubmit(event) {
    event.preventDefault();
    
    if (!validateSignupForm()) {
        showMessage('Please correct the errors in the form.', 'error');
        return;
    }
    
    const formData = new FormData(signupForm);
    const customerData = {
        id: generateCustomerId(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: hashPassword(formData.get('password')),
        address: {
            line1: formData.get('addressLine1'),
            line2: formData.get('addressLine2'),
            city: formData.get('city'),
            postcode: formData.get('postcode'),
            county: formData.get('county')
        },
        preferences: {
            deliveryPreferences: formData.get('deliveryPreferences'),
            favoriteFarms: Array.from(formData.getAll('favoriteFarms'))
        },
        notifications: {
            seasonal: formData.has('notifications') && formData.getAll('notifications').includes('seasonal'),
            restock: formData.has('notifications') && formData.getAll('notifications').includes('restock'),
            newProducts: formData.has('notifications') && formData.getAll('notifications').includes('new-products'),
            farmUpdates: formData.has('notifications') && formData.getAll('notifications').includes('farm-updates'),
            promotions: formData.has('notifications') && formData.getAll('notifications').includes('promotions')
        },
        marketing: formData.has('marketing'),
        terms: formData.has('terms'),
        privacy: formData.has('privacy'),
        dateCreated: new Date().toISOString(),
        wishlist: [],
        orderHistory: [],
        loyaltyPoints: 0,
        notifications: []
    };
    
    // Check if email already exists
    if (customers.some(customer => customer.email === customerData.email)) {
        showMessage('An account with this email already exists.', 'error');
        return;
    }
    
    // Add customer to storage
    customers.push(customerData);
    setStorageData('customers', customers);
    
    // Log in the new customer
    currentCustomer = customerData;
    setStorageData('currentCustomer', currentCustomer);
    
    // Show success message and redirect
    showMessage('Account created successfully! Welcome to the British Farm Co-op community.', 'success');
    
    setTimeout(() => {
        window.location.href = 'customer-dashboard.html';
    }, 2000);
}

// Handle forgot password form submission
function handleForgotPasswordSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(forgotPasswordForm);
    const email = formData.get('email');
    
    // Check if email exists
    const customer = customers.find(c => c.email === email);
    
    if (!customer) {
        showMessage('No account found with this email address.', 'error');
        return;
    }
    
    // In a real application, this would send an email
    // For demo purposes, we'll just show a success message
    showMessage('Password reset link sent to your email address.', 'success');
    closeModal('forgot-password-modal');
    
    // Clear the form
    forgotPasswordForm.reset();
}

// Validate login form
function validateLoginForm() {
    let isValid = true;
    
    const emailField = document.getElementById('login-email');
    const passwordField = document.getElementById('login-password');
    
    // Validate email
    if (!validateEmail(emailField)) {
        isValid = false;
    }
    
    // Validate password
    if (!passwordField.value.trim()) {
        showFieldError(passwordField, 'Password is required.');
        isValid = false;
    } else {
        clearFieldError(passwordField);
    }
    
    return isValid;
}

// Validate signup form
function validateSignupForm() {
    let isValid = true;
    const requiredFields = signupForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    if (!validateEmail(document.getElementById('signup-email'))) {
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
    }
    
    // Specific field validations
    if (isValid && value) {
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long.';
                }
                break;
            case 'phone':
                if (value && !isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                }
                break;
            case 'postcode':
                if (!isValidPostcode(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid UK postcode.';
                }
                break;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Validate email
function validateEmail(field) {
    const email = field.value.trim();
    let isValid = true;
    
    clearFieldError(field);
    
    if (!email) {
        isValid = false;
        showFieldError(field, 'Email address is required.');
    } else if (!isValidEmail(email)) {
        isValid = false;
        showFieldError(field, 'Please enter a valid email address.');
    }
    
    return isValid;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    
    if (!password || !confirmPassword) return true;
    
    clearFieldError(confirmPassword);
    
    if (password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Passwords do not match.');
        return false;
    }
    
    return true;
}

// Show forgot password modal
function showForgotPassword() {
    openModal('forgot-password-modal');
} 