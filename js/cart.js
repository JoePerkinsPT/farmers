/**
 * Shopping Cart Functionality
 * 
 * This module handles all shopping cart operations for the Great British Farm Co-op website.
 * It provides a complete e-commerce cart system with local storage persistence,
 * quantity management, and responsive UI components.
 * 
 * FEATURES:
 * - Add/remove items from cart
 * - Quantity adjustment with +/- controls
 * - Local storage persistence
 * - Floating cart button with item count
 * - Responsive cart sidebar
 * - Cart notifications
 * - Automatic cleanup on non-shop pages
 * 
 * USAGE:
 * - Call addToCart(productId) to add items
 * - Call removeFromCart(productId) to remove items
 * - Call updateCartItemQuantity(productId, 'increase'|'decrease') to adjust quantities
 * - Cart automatically persists between page visits
 * 
 * @author Joe Perkins
 * @studentId 2417880
 * @version 1.0.0
 * @since 2024
 */

// Cart functionality for the British Farm Co-op website

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = 0;

/**
 * Clean up cart sidebars on pages where they shouldn't be
 * Removes cart UI elements from non-shop pages to prevent confusion
 */
function cleanupCartSidebars() {
    if (!shouldShowCart()) {
        const existingCartSidebars = document.querySelectorAll('.cart-sidebar');
        existingCartSidebars.forEach(sidebar => {
            console.log('🛒 Removing cart sidebar from page where it shouldn\'t be');
            sidebar.remove();
        });
    }
}

/**
 * Check if we're on a page that should have cart functionality
 * Determines whether cart UI elements should be displayed
 * @returns {boolean} True if cart should be shown on current page
 */
function shouldShowCart() {
    // Check if we're on the shop page
    if (window.location.pathname.includes('shop.html')) {
        return true;
    }
    
    // Check if there's already a cart sidebar in the HTML
    const existingCartSidebar = document.getElementById('cart-sidebar');
    if (existingCartSidebar) {
        return true;
    }
    
    // Check if there's a cart toggle button
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
        return true;
    }
    
    return false;
}

/**
 * Initialize cart functionality
 * Sets up cart display and updates item counts
 */
function initCart() {
    updateCartCount();
    updateFloatingCartCount();
}

// Immediate cleanup - remove any existing cart sidebars on pages where they shouldn't be
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupCartSidebars);
} else {
    cleanupCartSidebars();
}

/**
 * Add item to cart
 * Handles adding products to cart with quantity management
 * @param {string} productId - Unique identifier for the product
 */
function addToCart(productId) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increment quantity if item already exists
        existingItem.quantity += 1;
    } else {
        // Get product details from the product data
        const product = getProductById(productId);
        
        if (product) {
            // Add new item to cart with initial quantity of 1
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                unit: product.unit,
                image: product.image,
                farmName: product.farmName,
                quantity: 1
            });
        } else {
            console.error('🛒 Product not found for ID:', productId);
        }
    }
    
    // Persist changes and update UI
    saveCart();
    updateCartCount();
    updateFloatingCartCount();
    showCartNotification('Item added to cart!');
}

/**
 * Remove item from cart
 * Completely removes a product from the cart
 * @param {string} productId - Unique identifier for the product to remove
 */
function removeFromCart(productId) {
    // Filter out the item with matching ID
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateFloatingCartCount();
    updateCartDisplay();
}

/**
 * Update cart item quantity
 * Handles quantity increases and decreases with validation
 * @param {string} productId - Unique identifier for the product
 * @param {string} action - Either 'increase' or 'decrease'
 */
function updateCartItemQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (action === 'increase') {
            // Increment quantity
            item.quantity += 1;
        } else if (action === 'decrease') {
            // Decrement quantity
            item.quantity -= 1;
            // Remove item if quantity reaches zero
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
        }
        
        // Persist changes and update UI
        saveCart();
        updateCartCount();
        updateFloatingCartCount();
        updateCartDisplay();
    }
}

/**
 * Get product by ID from available product data
 * Searches multiple data sources to find product information
 * @param {string} productId - Unique identifier for the product
 * @returns {Object|null} Product object or null if not found
 */
function getProductById(productId) {
    // Try global allProducts array first (most common case)
    if (window.allProducts && Array.isArray(window.allProducts)) {
        return window.allProducts.find(p => String(p.id) === String(productId));
    }
    // Fallback to cached products if available
    if (typeof filteredProducts !== 'undefined' && Array.isArray(filteredProducts)) {
        return filteredProducts.find(p => String(p.id) === String(productId));
    }
    return null;
}

// Expose addToCart for shop.js
window.addToCart = addToCart;

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
}

// Update floating cart count
function updateFloatingCartCount() {
    const floatingCartCount = document.querySelector('.cart-toggle .cart-count');
    if (floatingCartCount) {
        floatingCartCount.textContent = cartCount;
    }
}

// Create cart sidebar if it doesn't exist
function createCartSidebar() {
    // Only create cart sidebar if we're on a page that should have it
    if (!shouldShowCart()) {
        console.log('🛒 Cart sidebar not needed on this page');
        return null;
    }
    
    const cartSidebar = document.createElement('div');
    cartSidebar.className = 'cart-sidebar';
    cartSidebar.id = 'cart-sidebar';
    cartSidebar.innerHTML = `
        <div class="cart-header">
            <h3>Shopping Cart</h3>
            <button class="cart-close" id="cart-close">&times;</button>
        </div>
        <div class="cart-items" id="cart-items">
            <!-- Cart items will be loaded here -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-amount">£0.00</span>
            </div>
            <button class="btn btn-primary checkout-btn">Proceed to Checkout</button>
        </div>
    `;
    
    document.body.appendChild(cartSidebar);
    return cartSidebar;
}

// Toggle cart sidebar
function toggleCart() {
    // Only allow cart toggle on pages that should have cart functionality
    if (!shouldShowCart()) {
        console.log('🛒 Cart functionality not available on this page');
        return;
    }
    
    let cartSidebar = document.getElementById('cart-sidebar');
    
    if (!cartSidebar) {
        cartSidebar = createCartSidebar();
    }
    
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        updateCartDisplay();
        
        // Add body scroll lock for mobile
        if (cartSidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    } else {
        console.error('🛒 Failed to create cart sidebar!');
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.querySelector('.total-amount');
    
    if (!cartItems) {
        console.error('🛒 Cart items element not found!');
        return;
    }
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '£0.00';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50x50?text=Product'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>£${item.price.toFixed(2)} ${item.unit}</p>
                    <p class="cart-item-farm">From ${item.farmName}</p>
                </div>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateCartItemQuantity('${item.id}', 'decrease')">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartItemQuantity('${item.id}', 'increase')">+</button>
                <button onclick="removeFromCart('${item.id}')" class="remove-btn">×</button>
            </div>
            <div class="cart-item-total">
                £${itemTotal.toFixed(2)}
            </div>
        `;
        fragment.appendChild(itemElement);
    });
    
    cartItems.innerHTML = '';
    cartItems.appendChild(fragment);
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = `£${total.toFixed(2)}`;
    }
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        // Clean up any existing cart sidebars first
        cleanupCartSidebars();
        
        initCart();
        
        // Setup floating cart toggle only if it exists
        const floatingCartToggle = document.getElementById('cart-toggle');
        if (floatingCartToggle) {
            // Remove any existing listeners
            const newFloatingToggle = floatingCartToggle.cloneNode(true);
            floatingCartToggle.parentNode.replaceChild(newFloatingToggle, floatingCartToggle);
            
            // Add event listeners
            newFloatingToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleCart();
            });
            
            // Add touch event for mobile
            newFloatingToggle.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleCart();
            });
        }
        
        // Setup cart close button only if it exists
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', function() {
                closeCart();
            });
            
            // Add touch event for mobile
            cartClose.addEventListener('touchend', function(e) {
                e.preventDefault();
                closeCart();
            });
        }
        
        // Close cart when clicking outside (only if cart sidebar exists)
        document.addEventListener('click', function(e) {
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                if (!cartSidebar.contains(e.target) && 
                    !e.target.closest('.cart-toggle')) {
                    closeCart();
                }
            }
        });
        
        // Close cart on escape key (only if cart sidebar exists)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const cartSidebar = document.getElementById('cart-sidebar');
                if (cartSidebar && cartSidebar.classList.contains('active')) {
                    closeCart();
                }
            }
        });
        
    }, 100);
}); 