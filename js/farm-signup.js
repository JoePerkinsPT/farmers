// Farm Signup Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('farm-signup-form');
    const clearBtn = document.getElementById('clear-form');
    const messageContainer = document.getElementById('message-container');

    // Form validation
    function validateForm() {
        let isValid = true;
        const errors = {};

        // Farm name validation
        const farmName = document.getElementById('farm-name').value.trim();
        if (!farmName) {
            errors['farm-name'] = 'Farm name is required';
            isValid = false;
        }

        // Farmer name validation
        const farmerName = document.getElementById('farmer-name').value.trim();
        if (!farmerName) {
            errors['farmer-name'] = 'Farmer name is required';
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors['email'] = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors['email'] = 'Please enter a valid email address';
            isValid = false;
        }

        // Phone validation
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            errors['phone'] = 'Phone number is required';
            isValid = false;
        }

        // Farm address validation
        const farmAddress = document.getElementById('farm-address').value.trim();
        if (!farmAddress) {
            errors['farm-address'] = 'Farm address is required';
            isValid = false;
        }

        // Farm type validation
        const farmType = document.getElementById('farm-type').value;
        if (!farmType) {
            errors['farm-type'] = 'Please select a farm type';
            isValid = false;
        }

        // Farm size validation
        const farmSize = document.getElementById('farm-size').value;
        if (!farmSize || farmSize < 1) {
            errors['farm-size'] = 'Please enter a valid farm size';
            isValid = false;
        }

        // Products validation
        const productCheckboxes = document.querySelectorAll('input[name="products"]:checked');
        if (productCheckboxes.length === 0) {
            errors['products'] = 'Please select at least one product type';
            isValid = false;
        }

        // Farm description validation
        const farmDescription = document.getElementById('farm-description').value.trim();
        if (!farmDescription) {
            errors['farm-description'] = 'Farm description is required';
            isValid = false;
        }

        // Terms validation
        const terms = document.getElementById('terms').checked;
        if (!terms) {
            errors['terms'] = 'You must agree to the terms and conditions';
            isValid = false;
        }

        // Display errors
        clearErrors();
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
                errorElement.textContent = errors[field];
            }
        });

        return isValid;
    }

    // Clear all error messages
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    // Show success/error message
    function showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        messageContainer.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Generate farm HTML template
    function generateFarmHTML(farmData) {
        const farmSlug = farmData.farmName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const currentYear = new Date().getFullYear();
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${farmData.farmName} - British Farm Co-op</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/farm-page.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <h1>🇬🇧 Great British Farm Co-op</h1>
                    <p>Traditional UK Farm Products from Our Community</p>
                </div>
                <nav class="nav">
                    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-menu" id="nav-menu">
                        <li><a href="../index.html" class="nav-link">Home</a></li>
                        <li><a href="../farms.html" class="nav-link">Our Farms</a></li>
                        <li><a href="../shop.html" class="nav-link">Shop Online</a></li>
                        <li><a href="../calendar.html" class="nav-link">Seasonal Calendar</a></li>
                        <li><a href="../farm-signup.html" class="nav-link">Join Our Co-op</a></li>
                        <li><a href="../index.html#farm-map" class="nav-link">Farm Map</a></li>
                        <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
                        <li><a href="../admin.html" class="nav-link admin-link">Admin</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main>
        <section class="farm-hero">
            <div class="container">
                <div class="farm-hero-content">
                    <div class="farm-hero-image">
                        <img src="${farmData.farmPhoto || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop'}" alt="${farmData.farmName}">
                    </div>
                    <div class="farm-hero-info">
                        <h1>${farmData.farmName}</h1>
                        <p class="farm-location">📍 ${farmData.farmAddress}</p>
                        <p class="farm-description">${farmData.farmDescription}</p>
                        <div class="farm-stats">
                            <div class="stat">
                                <span class="stat-number">${farmData.farmSize}</span>
                                <span class="stat-label">Acres</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${farmData.farmType}</span>
                                <span class="stat-label">Type</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${farmData.products.length}</span>
                                <span class="stat-label">Products</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="farm-story">
            <div class="container">
                <div class="story-content">
                    <h2>Our Story</h2>
                    <p>${farmData.farmDescription}</p>
                    
                    <div class="farm-values">
                        <div class="value">
                            <h3>👨‍🌾 Traditional</h3>
                            <p>We maintain traditional British farming practices passed down through generations.</p>
                        </div>
                        <div class="value">
                            <h3>🌱 Sustainable</h3>
                            <p>We use sustainable farming methods that protect our land for future generations.</p>
                        </div>
                        <div class="value">
                            <h3>🤝 Community</h3>
                            <p>We're proud to be part of the British Farm Co-op community.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="farm-products">
            <div class="container">
                <div class="section-header">
                    <h2>Our Products</h2>
                    <p>Traditional British products from ${farmData.farmName}</p>
                </div>

                <div class="products-grid">
                    <!-- Products will be loaded dynamically from JSON -->
                </div>

                <div class="shop-all-products">
                    <a href="../shop.html?farm=${farmSlug}" class="btn btn-secondary">Shop All ${farmData.farmName} Products</a>
                </div>
            </div>
        </section>

        <section class="farm-visit">
            <div class="container">
                <div class="visit-content">
                    <div class="visit-info">
                        <h2>Visit Our Farm</h2>
                        <p>We welcome visitors to our farm! Come and see how we make our traditional British products.</p>
                        
                        <div class="visit-details">
                            <div class="detail">
                                <h3>📍 Location</h3>
                                <p>${farmData.farmAddress}</p>
                            </div>
                            
                            <div class="detail">
                                <h3>📞 Contact</h3>
                                <p>Phone: ${farmData.phone}<br>Email: ${farmData.email}</p>
                            </div>
                            
                            <div class="detail">
                                <h3>👨‍🌾 Farmer</h3>
                                <p>${farmData.farmerName}</p>
                            </div>
                        </div>
                        
                        <div class="visit-actions">
                            <a href="tel:${farmData.phone.replace(/\s/g, '')}" class="btn btn-primary">Call Us</a>
                            <a href="mailto:${farmData.email}" class="btn btn-secondary">Email Us</a>
                        </div>
                    </div>
                    
                    <div class="visit-image">
                        <img src="${farmData.farmPhoto || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=400&fit=crop'}" alt="Farm Visit">
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>British Farm Co-op</h3>
                    <p>Bringing traditional UK farm products to our community since 2020.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="../farms.html">Our Farms</a></li>
                        <li><a href="../shop.html">Shop Online</a></li>
                        <li><a href="../index.html#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Farm Categories</h4>
                    <ul>
                        <li><a href="../shop.html?category=Meat">Meat</a></li>
                        <li><a href="../shop.html?category=Vegetables">Vegetables</a></li>
                        <li><a href="../shop.html?category=Dairy & Eggs">Dairy & Eggs</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${currentYear} British Farm Co-op. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../js/farm.js"></script>
</body>
</html>`;
    }

    // Create farm HTML file (simulated - in real app this would be server-side)
    function createFarmHTMLFile(farmData) {
        const farmSlug = farmData.farmName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const htmlContent = generateFarmHTML(farmData);
        
        // Store the HTML content in localStorage for admin to access
        const farmFiles = JSON.parse(localStorage.getItem('farmFiles') || '{}');
        farmFiles[farmSlug] = {
            filename: `${farmSlug}.html`,
            content: htmlContent,
            farmData: farmData,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        localStorage.setItem('farmFiles', JSON.stringify(farmFiles));
        
        return farmSlug;
    }

    // Notify admin of new farm application
    function notifyAdmin(farmData, farmSlug) {
        const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        notifications.push({
            id: Date.now(),
            type: 'farm_application',
            farmName: farmData.farmName,
            farmerName: farmData.farmerName,
            email: farmData.email,
            farmSlug: farmSlug,
            status: 'pending',
            createdAt: new Date().toISOString(),
            message: `New farm application from ${farmData.farmName} by ${farmData.farmerName}`
        });
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('Please correct the errors above.', 'error');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const farmData = {
            farmName: formData.get('farm-name'),
            farmerName: formData.get('farmer-name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            farmAddress: formData.get('farm-address'),
            farmType: formData.get('farm-type'),
            farmSize: formData.get('farm-size'),
            products: Array.from(formData.getAll('products')),
            certifications: Array.from(formData.getAll('certifications')),
            farmDescription: formData.get('farm-description'),
            farmPhoto: formData.get('farm-photo'),
            applicationDate: new Date().toISOString(),
            status: 'pending'
        };

        // Generate farm HTML template
        const farmSlug = createFarmHTMLFile(farmData);
        
        // Save farm application to localStorage
        saveFarmApplication(farmData);
        
        // Notify admin
        notifyAdmin(farmData, farmSlug);
        
        // Show success message
        showMessage(`Thank you! Your farm application has been submitted successfully. We will review your application and contact you within 5-7 business days. Your farm page template has been created and is pending admin approval.`, 'success');
        
        // Reset form
        form.reset();
        clearErrors();
    });

    // Handle clear form button
    clearBtn.addEventListener('click', function() {
        form.reset();
        clearErrors();
    });

    // Save farm application to localStorage
    function saveFarmApplication(farmData) {
        let applications = JSON.parse(localStorage.getItem('farmApplications') || '[]');
        applications.push({
            id: Date.now(),
            ...farmData
        });
        localStorage.setItem('farmApplications', JSON.stringify(applications));
    }


});

// Add some CSS for the signup page
const style = document.createElement('style');
style.textContent = `
    .signup-section {
        padding: 4rem 0;
    }

    .signup-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .signup-info {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 2rem;
        border-radius: 15px;
        border: 2px solid #dee2e6;
    }

    .benefits {
        display: grid;
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .benefit {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 10px;
        border: 1px solid #e9ecef;
    }

    .benefit-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .benefit h4 {
        margin-bottom: 0.5rem;
        color: #1A3C34;
    }

    .benefit p {
        margin: 0;
        color: #6c757d;
        font-size: 0.9rem;
    }

    .signup-form-container {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        border: 2px solid #dee2e6;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .signup-form h3 {
        margin-bottom: 2rem;
        color: #1A3C34;
        text-align: center;
    }

    .checkbox-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .link {
        color: #1A3C34;
        text-decoration: underline;
    }

    .link:hover {
        color: #2C5A4F;
    }

    @media (max-width: 768px) {
        .signup-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .checkbox-group {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style); 