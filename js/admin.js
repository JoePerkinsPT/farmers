// Admin JavaScript with Authentication Protection

// Global variables
let products = [];
let currentUser = getStorageData('currentCustomer', null);
let isAdmin = getStorageData('isAdmin', false);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    
    // Check admin authentication
    if (!isAdmin || !currentUser || currentUser.role !== 'admin') {
        console.log('Access denied - not authenticated as admin');
        showMessage('Access denied. Admin privileges required.', 'error');
        setTimeout(() => {
            window.location.href = 'customer-account.html';
        }, 2000);
        return;
    }
    
    console.log('Admin authenticated:', currentUser);
    
    // Hide loading screen and show admin content
    const authLoading = document.getElementById('auth-loading');
    const adminContent = document.getElementById('admin-content');
    
    if (authLoading) {
        authLoading.style.display = 'none';
    }
    
    if (adminContent) {
        adminContent.style.display = 'block';
    }
    
    loadProducts();
    setupBasicEventListeners();
    setupAdminUI();
});

// Load products from JSON
async function loadProducts() {
    try {
        console.log('Loading products for admin...');
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        products = await response.json();
        console.log('Products loaded:', products.length);
        
        renderTable();
        
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products. Please try again later.');
    }
}

// Setup basic event listeners
function setupBasicEventListeners() {
    // Product form
    const productForm = document.getElementById('product-form');
    if (productForm) {
    productForm.addEventListener('submit', handleFormSubmit);
    }

    // Clear form button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }
    
    console.log('Admin basic event listeners setup complete');
}

// Setup admin UI elements
function setupAdminUI() {
    // Add admin header with user info and logout
    const adminHeader = document.querySelector('.admin-header');
    if (adminHeader && currentUser) {
        const adminInfo = document.createElement('div');
        adminInfo.className = 'admin-info';
        adminInfo.innerHTML = `
            <div class="admin-user">
                <span class="admin-name">Welcome, ${currentUser.firstName} ${currentUser.lastName}</span>
                <button class="btn btn-secondary logout-btn" onclick="adminLogout()">
                    <span class="logout-icon">🚪</span>
                    Logout
                </button>
            </div>
        `;
        adminHeader.appendChild(adminInfo);
    }
}

// Admin logout function
function adminLogout() {
    // Clear admin session
    setStorageData('currentCustomer', null);
    setStorageData('isAdmin', false);
    
    // Update admin link visibility
    if (typeof checkAdminAuth === 'function') {
        checkAdminAuth();
    }
    
    showMessage('Admin logged out successfully.', 'success');
    
    setTimeout(() => {
        window.location.href = 'customer-account.html';
    }, 1500);
}



// Add product
function addProduct(productData) {
    products.push(productData);
    renderTable();
    console.log('Product added:', productData.name);
}

// Clear form
function clearForm() {
    const form = document.getElementById('product-form');
    if (form) {
        form.reset();
    }
}

// Render table
function renderTable() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No products found.</td></tr>';
        return;
    }
    
    const tableHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/50x50?text=Product'"
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"
                     loading="lazy">
            </td>
            <td>${product.name}</td>
            <td>${product.farmName}</td>
            <td>${product.category}</td>
            <td>£${product.price.toFixed(2)} ${product.unit}</td>
            <td>${product.availability}</td>
            <td>
                <button onclick="deleteProduct(${product.id})" class="btn btn-small btn-danger">Delete</button>
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = tableHTML;
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        renderTable();
        console.log('Product deleted:', id);
        showMessage('Product deleted successfully!', 'success');
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = {
        id: Date.now(),
        name: formData.get('name'),
        farmName: formData.get('farm-name'),
        category: formData.get('category'),
        availability: formData.get('availability'),
        price: parseFloat(formData.get('price')),
        unit: formData.get('unit'),
        image: formData.get('image'),
        description: formData.get('description'),
        harvestDate: formData.get('harvest-date') || null,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 20) + 1,
        season: 'All Year'
    };
    
    addProduct(productData);
    clearForm();
    alert('Product saved successfully!');
}

// Add product
function addProduct(productData) {
    products.push(productData);
    renderTable();
    console.log('Product added:', productData.name);
}

// Clear form
function clearForm() {
    const form = document.getElementById('product-form');
    if (form) {
        form.reset();
    }
}

// Render table
function renderTable() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No products found.</td></tr>';
        return;
    }
    
    const tableHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/50x50?text=Product'"
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td>${product.name}</td>
        <td>${product.farmName}</td>
        <td>${product.category}</td>
            <td>£${product.price.toFixed(2)} ${product.unit}</td>
            <td>${product.availability}</td>
        <td>
                <button onclick="deleteProduct(${product.id})" class="btn btn-small btn-danger">Delete</button>
        </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = tableHTML;
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
                    renderTable();
        console.log('Product deleted:', id);
    }
} 