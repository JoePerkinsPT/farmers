// Customer Dashboard JavaScript Functionality

// Global variables
let customers = getStorageData('customers', []);
let currentCustomer = getStorageData('currentCustomer', null);
let allProducts = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!currentCustomer) {
        window.location.href = 'customer-account.html';
        return;
    }
    
    loadProducts();
    loadDashboard();
    initializeModals();
});

// Logout function
function logout() {
    // Clear current customer from storage
    setStorageData('currentCustomer', null);
    setStorageData('isAdmin', false);
    
    // Update admin link visibility
    if (typeof checkAdminAuth === 'function') {
        checkAdminAuth();
    }
    
    // Show logout message
    showMessage('You have been logged out successfully.', 'success');
    
    // Redirect to account page after a short delay
    setTimeout(() => {
        window.location.href = 'customer-account.html';
    }, 1500);
}

// Navigation functionality
function initializeNavigation() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Load dashboard data
function loadDashboard() {
    if (!currentCustomer) return;
    
    // Update customer name
    document.getElementById('customer-name').textContent = `${currentCustomer.firstName} ${currentCustomer.lastName}`;
    
    // Update stats
    document.getElementById('loyalty-points').textContent = currentCustomer.loyaltyPoints || 0;
    document.getElementById('wishlist-count').textContent = currentCustomer.wishlist ? currentCustomer.wishlist.length : 0;
    document.getElementById('order-count').textContent = currentCustomer.orderHistory ? currentCustomer.orderHistory.length : 0;
    
    // Load profile information
    loadProfileInfo();
    
    // Load address information
    loadAddressInfo();
    
    // Load preferences
    loadPreferences();
    
    // Load notification settings
    loadNotificationSettings();
    
    // Load wishlist
    loadWishlist();
    
    // Load order history
    loadOrderHistory();
    
    // Load notifications
    loadNotifications();
}

// Load profile information
function loadProfileInfo() {
    document.getElementById('profile-name').textContent = `${currentCustomer.firstName} ${currentCustomer.lastName}`;
    document.getElementById('profile-email').textContent = currentCustomer.email;
    document.getElementById('profile-phone').textContent = currentCustomer.phone || 'Not provided';
    
    const dateCreated = new Date(currentCustomer.dateCreated);
    document.getElementById('profile-date').textContent = dateCreated.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Load address information
function loadAddressInfo() {
    const addressInfo = document.getElementById('address-info');
    if (currentCustomer.address) {
        const address = currentCustomer.address;
        addressInfo.innerHTML = `
            <p>${address.line1}</p>
            ${address.line2 ? `<p>${address.line2}</p>` : ''}
            <p>${address.city}, ${address.postcode}</p>
            ${address.county ? `<p>${address.county}</p>` : ''}
        `;
    } else {
        addressInfo.innerHTML = '<p>No address provided</p>';
    }
}

// Load preferences
function loadPreferences() {
    const deliveryPreference = document.getElementById('delivery-preference');
    const favoriteFarms = document.getElementById('favorite-farms');
    
    if (currentCustomer.preferences) {
        const pref = currentCustomer.preferences;
        deliveryPreference.textContent = getDeliveryPreferenceText(pref.deliveryPreferences);
        
        if (pref.favoriteFarms && pref.favoriteFarms.length > 0) {
            favoriteFarms.textContent = pref.favoriteFarms.join(', ');
        } else {
            favoriteFarms.textContent = 'None selected';
        }
    } else {
        deliveryPreference.textContent = 'Any delivery option';
        favoriteFarms.textContent = 'None selected';
    }
}

// Load notification settings
function loadNotificationSettings() {
    const notificationSettings = document.getElementById('notification-settings');
    if (currentCustomer.notifications) {
        const notif = currentCustomer.notifications;
        const enabledNotifications = [];
        
        if (notif.seasonal) enabledNotifications.push('Seasonal products');
        if (notif.restock) enabledNotifications.push('Product restock');
        if (notif.newProducts) enabledNotifications.push('New products');
        if (notif.farmUpdates) enabledNotifications.push('Farm updates');
        if (notif.promotions) enabledNotifications.push('Promotions');
        
        if (enabledNotifications.length > 0) {
            notificationSettings.innerHTML = `<p>${enabledNotifications.join(', ')}</p>`;
        } else {
            notificationSettings.innerHTML = '<p>No notifications enabled</p>';
        }
    } else {
        notificationSettings.innerHTML = '<p>No notifications enabled</p>';
    }
}

// Load wishlist
function loadWishlist() {
    const wishlistContainer = document.getElementById('wishlist-container');
    
    if (!currentCustomer.wishlist || currentCustomer.wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty. <a href="shop.html">Start shopping</a> to add items!</p>';
        return;
    }
    
    const wishlistItems = currentCustomer.wishlist.map(productId => {
        const product = allProducts.find(p => p.id === productId);
        return product;
    }).filter(Boolean);
    
    if (wishlistItems.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty. <a href="shop.html">Start shopping</a> to add items!</p>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    wishlistItems.forEach(product => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60x60?text=Product'">
            <div class="wishlist-item-info">
                <h4>${product.name}</h4>
                <p>${product.farmName}</p>
            </div>
            <div class="wishlist-item-price">£${product.price.toFixed(2)}</div>
            <div class="wishlist-item-actions">
                <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn btn-danger btn-small" onclick="removeFromWishlist(${product.id})">Remove</button>
            </div>
        `;
        fragment.appendChild(wishlistItem);
    });
    
    wishlistContainer.innerHTML = '';
    wishlistContainer.appendChild(fragment);
}

// Load order history
function loadOrderHistory() {
    const orderHistoryContainer = document.getElementById('order-history-container');
    
    if (!currentCustomer.orderHistory || currentCustomer.orderHistory.length === 0) {
        orderHistoryContainer.innerHTML = '<p>No orders yet. <a href="shop.html">Start shopping</a> to place your first order!</p>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    currentCustomer.orderHistory.slice().reverse().forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        const orderDate = new Date(order.date);
        const statusClass = getOrderStatusClass(order.status);
        
        orderItem.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="order-number">${order.id}</span>
                    <span class="order-date">${orderDate.toLocaleDateString('en-GB')}</span>
                </div>
                <span class="order-status ${statusClass}">${order.status || 'Processing'}</span>
            </div>
            <div class="order-details">
                <p><strong>Total:</strong> £${order.total.toFixed(2)}</p>
                <p><strong>Items:</strong> ${order.items ? order.items.length : 0} items</p>
            </div>
        `;
        fragment.appendChild(orderItem);
    });
    
    orderHistoryContainer.innerHTML = '';
    orderHistoryContainer.appendChild(fragment);
}

// Load notifications
function loadNotifications() {
    const notificationsContainer = document.getElementById('notifications-container');
    
    if (!currentCustomer.notifications || currentCustomer.notifications.length === 0) {
        notificationsContainer.innerHTML = '<p>No notifications yet.</p>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    currentCustomer.notifications.slice().reverse().slice(0, 10).forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
        
        const notificationDate = new Date(notification.date);
        
        notificationItem.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${notification.title}</span>
                <span class="notification-time">${notificationDate.toLocaleDateString('en-GB')}</span>
            </div>
            <div class="notification-content">${notification.message}</div>
        `;
        fragment.appendChild(notificationItem);
    });
    
    notificationsContainer.innerHTML = '';
    notificationsContainer.appendChild(fragment);
}

// Helper functions
function getDeliveryPreferenceText(preference) {
    const preferences = {
        'any': 'Any delivery option',
        'collection': 'Collection only',
        'delivery': 'Delivery only',
        'both': 'Both collection and delivery'
    };
    return preferences[preference] || 'Any delivery option';
}

function getOrderStatusClass(status) {
    const statusClasses = {
        'delivered': 'status-delivered',
        'shipped': 'status-shipped',
        'processing': 'status-processing'
    };
    return statusClasses[status] || 'status-processing';
}

// Modal functions
function initializeModals() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    // Address form
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', handleAddressSubmit);
    }
    
    // Preferences form
    const preferencesForm = document.getElementById('preferences-form');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', handlePreferencesSubmit);
    }
    
    // Notifications form
    const notificationsForm = document.getElementById('notifications-form');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', handleNotificationsSubmit);
    }
}

function editProfile() {
    const modal = document.getElementById('profile-modal');
    const form = document.getElementById('profile-form');
    
    // Populate form with current data
    document.getElementById('edit-first-name').value = currentCustomer.firstName;
    document.getElementById('edit-last-name').value = currentCustomer.lastName;
    document.getElementById('edit-email').value = currentCustomer.email;
    document.getElementById('edit-phone').value = currentCustomer.phone || '';
    
    modal.style.display = 'block';
}

function editAddress() {
    const modal = document.getElementById('address-modal');
    const form = document.getElementById('address-form');
    
    // Populate form with current data
    if (currentCustomer.address) {
        document.getElementById('edit-address-line1').value = currentCustomer.address.line1;
        document.getElementById('edit-address-line2').value = currentCustomer.address.line2 || '';
        document.getElementById('edit-city').value = currentCustomer.address.city;
        document.getElementById('edit-postcode').value = currentCustomer.address.postcode;
        document.getElementById('edit-county').value = currentCustomer.address.county || '';
    }
    
    modal.style.display = 'block';
}

function editPreferences() {
    const modal = document.getElementById('preferences-modal');
    
    // Populate form with current data
    if (currentCustomer.preferences) {
        document.getElementById('edit-delivery-preferences').value = currentCustomer.preferences.deliveryPreferences || 'any';
        
        const favoriteFarmsSelect = document.getElementById('edit-favorite-farms');
        if (currentCustomer.preferences.favoriteFarms) {
            currentCustomer.preferences.favoriteFarms.forEach(farm => {
                const option = favoriteFarmsSelect.querySelector(`option[value="${farm}"]`);
                if (option) option.selected = true;
            });
        }
    }
    
    modal.style.display = 'block';
}

function editNotifications() {
    const modal = document.getElementById('notifications-modal');
    
    // Populate form with current data
    if (currentCustomer.notifications) {
        const notif = currentCustomer.notifications;
        document.querySelector('input[value="seasonal"]').checked = notif.seasonal;
        document.querySelector('input[value="restock"]').checked = notif.restock;
        document.querySelector('input[value="new-products"]').checked = notif.newProducts;
        document.querySelector('input[value="farm-updates"]').checked = notif.farmUpdates;
        document.querySelector('input[value="promotions"]').checked = notif.promotions;
    }
    
    modal.style.display = 'block';
}



// Form submission handlers
function handleProfileSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const updates = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    if (window.customerAccount && window.customerAccount.updateCustomer) {
        window.customerAccount.updateCustomer(currentCustomer.id, updates);
        currentCustomer = window.customerAccount.currentCustomer;
        setStorageData('currentCustomer', currentCustomer);
        
        loadProfileInfo();
        closeModal('profile-modal');
        showMessage('Profile updated successfully!', 'success');
    }
}

function handleAddressSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const updates = {
        address: {
            line1: formData.get('addressLine1'),
            line2: formData.get('addressLine2'),
            city: formData.get('city'),
            postcode: formData.get('postcode'),
            county: formData.get('county')
        }
    };
    
    if (window.customerAccount && window.customerAccount.updateCustomer) {
        window.customerAccount.updateCustomer(currentCustomer.id, updates);
        currentCustomer = window.customerAccount.currentCustomer;
        setStorageData('currentCustomer', currentCustomer);
        
        loadAddressInfo();
        closeModal('address-modal');
        showMessage('Address updated successfully!', 'success');
    }
}

function handlePreferencesSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const updates = {
        preferences: {
            deliveryPreferences: formData.get('deliveryPreferences'),
            favoriteFarms: Array.from(formData.getAll('favoriteFarms'))
        }
    };
    
    if (window.customerAccount && window.customerAccount.updateCustomer) {
        window.customerAccount.updateCustomer(currentCustomer.id, updates);
        currentCustomer = window.customerAccount.currentCustomer;
        setStorageData('currentCustomer', currentCustomer);
        
        loadPreferences();
        closeModal('preferences-modal');
        showMessage('Preferences updated successfully!', 'success');
    }
}

function handleNotificationsSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const notifications = formData.getAll('notifications');
    
    const updates = {
        notifications: {
            seasonal: notifications.includes('seasonal'),
            restock: notifications.includes('restock'),
            newProducts: notifications.includes('new-products'),
            farmUpdates: notifications.includes('farm-updates'),
            promotions: notifications.includes('promotions')
        }
    };
    
    if (window.customerAccount && window.customerAccount.updateCustomer) {
        window.customerAccount.updateCustomer(currentCustomer.id, updates);
        currentCustomer = window.customerAccount.currentCustomer;
        setStorageData('currentCustomer', currentCustomer);
        
        loadNotificationSettings();
        closeModal('notifications-modal');
        showMessage('Notification settings updated successfully!', 'success');
    }
}

// Wishlist functions
function removeFromWishlist(productId) {
    if (window.customerAccount && window.customerAccount.removeFromWishlist) {
        window.customerAccount.removeFromWishlist(currentCustomer.id, productId);
        currentCustomer = window.customerAccount.currentCustomer;
        setStorageData('currentCustomer', currentCustomer);
        
        loadWishlist();
        loadDashboard(); // Update stats
        showMessage('Item removed from wishlist!', 'success');
    }
}

function addToCart(productId) {
    // This would integrate with the shop cart system
    showMessage('Item added to cart!', 'success');
}



// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}); 