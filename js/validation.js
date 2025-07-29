// Consolidated Form Validation System
// Replaces duplicate validation functions across all files

class FormValidator {
    /**
     * Validate a form field with comprehensive validation rules
     * @param {HTMLElement} field - The form field to validate
     * @returns {boolean} - Whether the field is valid
     */
    static validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (isRequired && !value) {
            this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required.`);
            return false;
        }
        
        // Skip further validation if field is empty and not required
        if (!value) return true;
        
        // Type-specific validation
        switch (fieldType) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address.');
                    return false;
                }
                break;
            case 'tel':
                if (!this.isValidPhone(value)) {
                    this.showFieldError(field, 'Please enter a valid phone number.');
                    return false;
                }
                break;
            case 'password':
                if (value.length < 6) {
                    this.showFieldError(field, 'Password must be at least 6 characters long.');
                    return false;
                }
                break;
        }
        
        // Custom validation for specific fields
        if (fieldName === 'postcode' && !this.isValidPostcode(value)) {
            this.showFieldError(field, 'Please enter a valid UK postcode.');
            return false;
        }
        
        // Name validation (first name, last name, farm name, farmer name)
        if (['firstName', 'lastName', 'farm-name', 'farmer-name'].includes(fieldName)) {
            if (value.length < 2) {
                this.showFieldError(field, 'Name must be at least 2 characters long.');
                return false;
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value.length < 10) {
            this.showFieldError(field, 'Message must be at least 10 characters long.');
            return false;
        }
        
        // Farm description validation
        if (fieldName === 'farm-description' && value.length < 20) {
            this.showFieldError(field, 'Farm description must be at least 20 characters long.');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show field error message
     * @param {HTMLElement} field - The form field
     * @param {string} message - Error message
     */
    static showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    /**
     * Clear field error message
     * @param {HTMLElement} field - The form field
     */
    static clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Get human-readable field label
     * @param {string} fieldName - Field name
     * @returns {string} - Human-readable label
     */
    static getFieldLabel(fieldName) {
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
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    static isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - Whether phone is valid
     */
    static isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
    }
    
    /**
     * Validate UK postcode format
     * @param {string} postcode - Postcode to validate
     * @returns {boolean} - Whether postcode is valid
     */
    static isValidPostcode(postcode) {
        return /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode);
    }
    
    /**
     * Validate password match
     * @param {HTMLElement} passwordField - Password field
     * @param {HTMLElement} confirmField - Confirm password field
     * @returns {boolean} - Whether passwords match
     */
    static validatePasswordMatch(passwordField, confirmField) {
        if (!passwordField || !confirmField) return true;
        
        this.clearFieldError(confirmField);
        
        if (passwordField.value !== confirmField.value) {
            this.showFieldError(confirmField, 'Passwords do not match.');
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate entire form
     * @param {HTMLFormElement} form - Form to validate
     * @returns {boolean} - Whether form is valid
     */
    static validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Special validation for password confirmation
        const passwordField = form.querySelector('input[name="password"]');
        const confirmPasswordField = form.querySelector('input[name="confirmPassword"]');
        if (passwordField && confirmPasswordField) {
            if (!this.validatePasswordMatch(passwordField, confirmPasswordField)) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    /**
     * Initialize form validation with real-time validation
     * @param {HTMLFormElement} form - Form to initialize
     */
    static initializeForm(form) {
        // Add real-time validation to all fields
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                FormValidator.validateField(this);
            });
            
            field.addEventListener('input', function() {
                FormValidator.clearFieldError(this);
            });
        });
        
        // Add form submission validation
        form.addEventListener('submit', function(e) {
            if (!FormValidator.validateForm(this)) {
                e.preventDefault();
                return false;
            }
        });
    }
}

// Make FormValidator globally available
window.FormValidator = FormValidator; 