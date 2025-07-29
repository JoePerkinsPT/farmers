// Utility Functions for British Farm Co-op
// Provides common utility functions used across the application

// Storage utilities
function getStorageData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function setStorageData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

function removeStorageData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// Message display utilities
function showMessage(message, type = 'info', duration = 5000) {
    console.log('showMessage called:', message, type, duration);
    
    // Use the consolidated MessageManager if available
    if (window.MessageManager) {
        console.log('Using MessageManager');
        window.MessageManager.showMessage(message, type, duration);
        return;
    }
    
    console.log('Using fallback message display');
    // Fallback message display
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(messageElement);
    console.log('Message element added to DOM:', messageElement);
    
    // Show message with animation
    setTimeout(() => {
        messageElement.classList.add('show');
        console.log('Message show class added');
    }, 10);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                if (messageElement.parentElement) {
                    messageElement.remove();
                }
            }, 300);
        }, duration);
    }
}

// Validation utilities
function validateField(field) {
    // Use the consolidated FormValidator if available
    if (window.FormValidator) {
        return window.FormValidator.validateField(field);
    }
    
    // Fallback validation
    const value = field.value.trim();
    const fieldName = field.name;
    const isRequired = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Check if required field is empty
    if (isRequired && !value) {
        showFieldError(field, `${getFieldLabel(fieldName)} is required.`);
        return false;
    }
    
    // Skip further validation if field is empty and not required
    if (!value) return true;
    
    // Type-specific validation
    switch (field.type) {
        case 'email':
            if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address.');
                return false;
            }
            break;
        case 'tel':
            if (!isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number.');
                return false;
            }
            break;
        case 'password':
            if (value.length < 6) {
                showFieldError(field, 'Password must be at least 6 characters long.');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        'firstName': 'First name',
        'lastName': 'Last name',
        'email': 'Email address',
        'phone': 'Phone number',
        'password': 'Password',
        'confirmPassword': 'Password confirmation',
        'addressLine1': 'Address line 1',
        'addressLine2': 'Address line 2',
        'city': 'City',
        'postcode': 'Postcode',
        'county': 'County',
        'farm-name': 'Farm name',
        'farmer-name': 'Farmer name',
        'farm-address': 'Farm address',
        'farm-type': 'Farm type',
        'farm-size': 'Farm size',
        'farm-description': 'Farm description',
        'name': 'Name',
        'message': 'Message'
    };
    
    return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
}

function isValidPostcode(postcode) {
    return /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode);
}

// Password utilities
function hashPassword(password) {
    // Simple hash for demo purposes
    // In production, use proper hashing like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

function validatePasswordMatch() {
    const passwordField = document.getElementById('signup-password');
    const confirmPasswordField = document.getElementById('confirm-password');
    
    if (!passwordField || !confirmPasswordField) return true;
    
    clearFieldError(confirmPasswordField);
    
    if (passwordField.value !== confirmPasswordField.value) {
        showFieldError(confirmPasswordField, 'Passwords do not match.');
        return false;
    }
    
    return true;
}

// ID generation utilities
function generateCustomerId() {
    return 'CUST_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateOrderId() {
    return 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Modal utilities
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Form validation utilities
function validateLoginForm() {
    const emailField = document.getElementById('login-email');
    const passwordField = document.getElementById('login-password');
    
    let isValid = true;
    
    if (emailField && !validateField(emailField)) {
        isValid = false;
    }
    
    if (passwordField && !validateField(passwordField)) {
        isValid = false;
    }
    
    return isValid;
}

function validateSignupForm() {
    const requiredFields = document.querySelectorAll('#customer-signup-form [required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check password match
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    return isValid;
}

// Make functions globally available
window.getStorageData = getStorageData;
window.setStorageData = setStorageData;
window.removeStorageData = removeStorageData;
window.showMessage = showMessage;
window.validateField = validateField;
window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;
window.getFieldLabel = getFieldLabel;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.isValidPostcode = isValidPostcode;
window.hashPassword = hashPassword;
window.validatePasswordMatch = validatePasswordMatch;
window.generateCustomerId = generateCustomerId;
window.generateOrderId = generateOrderId;
window.showModal = showModal;
window.closeModal = closeModal;
window.validateLoginForm = validateLoginForm;
window.validateSignupForm = validateSignupForm; 