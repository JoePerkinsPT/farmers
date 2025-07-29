// Consolidated Product Display System
// Replaces duplicate product display functions across all files

class ProductDisplay {
    /**
     * Create a product card element with consistent styling
     * @param {Object} product - Product object
     * @param {string} displayType - Display type: 'grid', 'carousel', 'list'
     * @returns {HTMLElement} - Product card element
     */
    static createProductCard(product, displayType = 'grid') {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        const availabilityClass = this.getAvailabilityClass(product.availability);
        const ratingStars = this.createRatingStars(product.rating);
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x300/1A3C34/FFFFFF?text=${encodeURIComponent(product.name)}'"
                     onload="this.style.opacity='1'" style="opacity: 0; transition: opacity 0.3s ease;">
                ${product.rating ? `
                    <div class="product-badge">
                        ${product.rating.toFixed(1)} ★
                    </div>
                ` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-farm">${product.farmName}</span>
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-availability ${availabilityClass}">
                    ${product.availability}
                </div>
                <div class="product-price">
                    <span class="price">£${product.price.toFixed(2)} ${product.unit}</span>
                </div>
                ${product.rating ? `
                    <div class="product-rating">
                        ${ratingStars}
                        <span class="rating-text">${product.rating.toFixed(1)} (${product.reviews} reviews)</span>
                    </div>
                ` : ''}
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                        ♡
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    /**
     * Display products in a container
     * @param {Array} products - Array of products
     * @param {string} containerId - Container element ID
     * @param {string} displayType - Display type: 'grid', 'carousel', 'list'
     */
    static displayProducts(products, containerId, displayType = 'grid') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        if (products.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <p>No products found matching your filters.</p>
                    <button class="btn btn-secondary" onclick="clearFilters()">Clear Filters</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        products.forEach(product => {
            const card = this.createProductCard(product, displayType);
            container.appendChild(card);
        });
    }
    
    /**
     * Display products in carousel format
     * @param {Array} products - Array of products
     * @param {string} carouselTrackId - Carousel track element ID
     * @param {string} carouselDotsId - Carousel dots element ID
     */
    static displayProductsCarousel(products, carouselTrackId, carouselDotsId = null) {
        const carouselTrack = document.getElementById(carouselTrackId);
        const carouselDots = carouselDotsId ? document.getElementById(carouselDotsId) : null;
        
        if (!carouselTrack) {
            console.error(`Carousel track ${carouselTrackId} not found`);
            return;
        }
        
        // Clear the carousel
        carouselTrack.innerHTML = '';
        if (carouselDots) carouselDots.innerHTML = '';
        
        if (products.length === 0) {
            carouselTrack.innerHTML = `
                <div class="no-products">
                    <p>No products available at the moment.</p>
                </div>
            `;
            return;
        }
        
        // Create product cards for carousel
        products.forEach((product, index) => {
            const productCard = this.createProductCard(product, 'carousel');
            carouselTrack.appendChild(productCard);
            
            // Create dot for this product group (every 4 products)
            if (carouselDots && index % 4 === 0) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('data-index', Math.floor(index / 4));
                dot.setAttribute('aria-label', `Go to product group ${Math.floor(index / 4) + 1}`);
                if (index === 0) dot.classList.add('active');
                carouselDots.appendChild(dot);
            }
        });
    }
    
    /**
     * Get availability CSS class
     * @param {string} availability - Availability status
     * @returns {string} - CSS class name
     */
    static getAvailabilityClass(availability) {
        const classes = {
            'In Stock': 'in-stock',
            'Limited': 'low-stock',
            'Out of Stock': 'out-of-stock',
            'Pre-order': 'pre-order'
        };
        return classes[availability] || 'in-stock';
    }
    
    /**
     * Create rating stars HTML
     * @param {number} rating - Product rating
     * @returns {string} - Stars HTML
     */
    static createRatingStars(rating) {
        if (!rating) return '';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }
    
    /**
     * Update product count display
     * @param {number} count - Number of products
     * @param {string} countElementId - Count element ID
     */
    static updateProductCount(count, countElementId = 'product-count') {
        const countElement = document.getElementById(countElementId);
        if (countElement) {
            countElement.textContent = `${count} product${count !== 1 ? 's' : ''}`;
        }
    }
    
    /**
     * Show loading state for products
     * @param {string} containerId - Container element ID
     */
    static showLoadingState(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading products...</p>
                </div>
            `;
        }
    }
    
    /**
     * Show error state for products
     * @param {string} containerId - Container element ID
     * @param {string} errorMessage - Error message
     */
    static showErrorState(containerId, errorMessage = 'Error loading products') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <p>${errorMessage}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }
    
    /**
     * Filter products by criteria
     * @param {Array} products - Array of products
     * @param {Object} filters - Filter criteria
     * @returns {Array} - Filtered products
     */
    static filterProducts(products, filters) {
        return products.filter(product => {
            // Category filter
            if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
                return false;
            }
            
            // Price filter
            if (filters.minPrice && product.price < filters.minPrice) {
                return false;
            }
            if (filters.maxPrice && product.price > filters.maxPrice) {
                return false;
            }
            
            // Availability filter
            if (filters.availability && filters.availability !== 'all' && product.availability !== filters.availability) {
                return false;
            }
            
            // Farm filter
            if (filters.farm && product.farmName !== filters.farm) {
                return false;
            }
            
            // Search filter
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const productText = `${product.name} ${product.description} ${product.farmName} ${product.category}`.toLowerCase();
                if (!productText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    /**
     * Sort products by criteria
     * @param {Array} products - Array of products
     * @param {string} sortBy - Sort criteria
     * @returns {Array} - Sorted products
     */
    static sortProducts(products, sortBy) {
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'reviews':
                sortedProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
                break;
            default:
                // Default sort by name
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return sortedProducts;
    }
    
    /**
     * Initialize product display with event listeners
     * @param {string} containerId - Container element ID
     * @param {Array} products - Array of products
     */
    static initializeProductDisplay(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Add click event listeners to product cards
        container.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.getAttribute('data-product-id');
            
            // Handle add to cart button
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productId = e.target.getAttribute('data-product-id');
                if (typeof addToCartFromShop === 'function') {
                    addToCartFromShop(productId);
                }
            }
            
            // Handle wishlist button
            if (e.target.classList.contains('wishlist-btn')) {
                e.preventDefault();
                const productId = e.target.getAttribute('data-product-id');
                if (typeof toggleWishlist === 'function') {
                    toggleWishlist(productId);
                }
            }
        });
        
        // Add hover effects
        container.addEventListener('mouseenter', function(e) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                productCard.style.transform = 'translateY(-5px)';
            }
        });
        
        container.addEventListener('mouseleave', function(e) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                productCard.style.transform = 'translateY(0)';
            }
        });
    }
}

// Make ProductDisplay globally available
window.ProductDisplay = ProductDisplay; 