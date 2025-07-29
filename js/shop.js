// Simplified Shop JavaScript - Basic Functionality

// Global variables
let allProducts = [];
let filteredProducts = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    // checkUrlParameters() is now called after products are loaded
});

// Load products from JSON
async function loadProducts() {
    try {

        // Add cache busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch(`data/products.json?t=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        
        // Replace all Unsplash images with reliable placeholders
        allProducts.forEach(product => {
            if (product.image && product.image.includes('unsplash.com')) {
                const category = product.category || 'Product';
                const name = product.name || 'Product';
                const color = getCategoryColor(category);
                product.image = `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(name)}`;
            }
        });
        
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
        updateProductCount(filteredProducts.length);
        
        // Check URL parameters after products are loaded
        checkUrlParameters();
        
    } catch (error) {
        console.error('Error loading products:', error);
        
        // Fallback: Create some test products to verify display works
        allProducts = [
            {
                id: "test_001",
                name: "Test Organic Carrots",
                description: "Test organic carrots for debugging.",
                price: 2.50,
                unit: "per kg",
                category: "Vegetables",
                farmName: "Test Farm",
                availability: "In Stock",
                season: "All Year",
                image: "https://via.placeholder.com/400x300/1A3C34/FFFFFF?text=Test+Carrots",
                rating: 4.5,
                reviews: 10
            },
            {
                id: "test_002",
                name: "Test Free-Range Eggs",
                description: "Test free-range eggs for debugging.",
                price: 3.50,
                unit: "per dozen",
                category: "Dairy & Eggs",
                farmName: "Test Farm",
                availability: "In Stock",
                season: "All Year",
                image: "https://via.placeholder.com/400x300/1A3C34/FFFFFF?text=Test+Eggs",
                rating: 4.8,
                reviews: 15
            }
        ];
        
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
        updateProductCount(filteredProducts.length);
        
        // Check URL parameters after fallback products are loaded
        checkUrlParameters();
        
        // Show error message
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <p>Error loading products from server. Showing test products instead.</p>
                <p>Error: ${error.message}</p>
                <button onclick="loadProducts()" class="btn btn-primary">Retry Loading</button>
            `;
            productsGrid.insertBefore(errorDiv, productsGrid.firstChild);
        }
    }
}

// Display products in grid
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) {
        console.error('Products grid not found');
        return;
    }
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>No products found matching your filters.</p>
                <button class="btn btn-secondary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    const productsHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x300/1A3C34/FFFFFF?text=${encodeURIComponent(product.name)}'"
                     onload="this.style.opacity='1'" style="opacity: 0; transition: opacity 0.3s ease;">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-farm">${product.farmName}</span>
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-availability ${getAvailabilityClass(product.availability)}">
                    ${product.availability}
                </div>
                <div class="product-price">
                    <span class="price">£${product.price.toFixed(2)} ${product.unit}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    productsGrid.innerHTML = productsHTML;
}

// Update product count display
function updateProductCount(count) {
    const countElement = document.getElementById('product-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Get category color for placeholder images
function getCategoryColor(category) {
    const categoryColors = {
        'Vegetables': '228B22',
        'Dairy & Eggs': '87CEEB',
        'Meat': '8B4513',
        'Bakery': 'D2B48C',
        'Pantry': 'FFA500',
        'Homeware': '696969',
        'Fruits': 'FF6347',
        'default': '1A3C34'
    };
    return categoryColors[category] || categoryColors.default;
}

// Get availability CSS class
function getAvailabilityClass(availability) {
    switch (availability) {
        case 'In Stock': return 'in-stock';
        case 'Limited': return 'limited-stock';
        case 'Out of Stock': return 'out-of-stock';
        default: return '';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
        // Enhanced touch support for mobile
        filter.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        filter.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.checked = !this.checked;
            applyFilters();
        });
    });

    // Farm filters
    const farmFilters = document.querySelectorAll('.farm-filter');
    farmFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
        // Enhanced touch support for mobile
        filter.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        filter.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.checked = !this.checked;
            applyFilters();
        });
    });

    // Availability filters
    const availabilityFilters = document.querySelectorAll('.availability-filter');
    availabilityFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
        // Enhanced touch support for mobile
        filter.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        filter.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.checked = !this.checked;
            applyFilters();
        });
    });

    // Delivery filters
    const deliveryFilters = document.querySelectorAll('.delivery-filter');
    deliveryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
        // Enhanced touch support for mobile
        filter.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        filter.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.checked = !this.checked;
            applyFilters();
        });
    });

    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Clear filters button
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
        // Enhanced touch support for mobile
        clearFiltersBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        clearFiltersBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            clearFilters();
        });
    }

        // Add to cart buttons - enhanced mobile support
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            const productId = e.target.dataset.productId;

            addToCartFromShop(productId);
        }
    });

    // Enhanced touch support for add to cart buttons
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            e.target.style.transform = 'scale(0.95)';
        }
    });

        document.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            e.target.style.transform = '';
            const productId = e.target.dataset.productId;

            addToCartFromShop(productId);
        }
    });

    // Mobile-specific optimizations
    if ('ontouchstart' in window) {

        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Improve scroll performance
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.cart-sidebar')) {
                e.stopPropagation();
            }
        }, { passive: true });
    }
}

// Apply filters
function applyFilters() {
    let filtered = [...allProducts];
    
    // Category filters
    const activeCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(filter => filter.value);
    
    if (activeCategories.length > 0) {
        filtered = filtered.filter(product => activeCategories.includes(product.category));
    }
    
    // Farm filters
    const activeFarms = Array.from(document.querySelectorAll('.farm-filter:checked'))
        .map(filter => filter.value);
    
    if (activeFarms.length > 0) {
        filtered = filtered.filter(product => {
            const farmCode = getFarmCode(product.farmName);
            return activeFarms.includes(farmCode);
        });
    }
    
    // Availability filters
    const activeAvailability = Array.from(document.querySelectorAll('.availability-filter:checked'))
        .map(filter => filter.value);
    
    if (activeAvailability.length > 0) {
        filtered = filtered.filter(product => activeAvailability.includes(product.availability));
    }
    
    // Sort products
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        filtered = sortProducts(filtered, sortSelect.value);
    }
    
    filteredProducts = filtered;
    displayProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
}

// Sort products
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'farm':
            return sorted.sort((a, b) => a.farmName.localeCompare(b.farmName));
        case 'category':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        default:
            return sorted;
    }
}

// Clear all filters
function clearFilters() {
    // Uncheck all filter checkboxes
    document.querySelectorAll('.category-filter, .farm-filter, .availability-filter').forEach(filter => {
        filter.checked = false;
    });
    
    // Reset sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = 'name';
    }
    
    // Show all products
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
}

// Get farm code from farm name
function getFarmCode(farmName) {
    const farmMap = {
        'Devon Valley Farm': 'devon',
        'Kent Apple Orchard': 'kent',
        'Yorkshire Beef Farm': 'yorkshire',
        'Cornwall Vegetable Farm': 'cornwall',
        'Scottish Highland Farm': 'scottish',
        'Welsh Mountain Farm': 'welsh',
        'Diddly Squat Farm Shop': 'diddly-squat',
        'Murton Farm Shop': 'murton',
        'Gower Salt Marsh Lamb': 'gower-salt-marsh',
        'Forage Farm Shop': 'forage',
        'Highland Farm Shop': 'highland',
        'Kent Apple Farm Shop': 'kent-apple',
        'Cornwall Coastal Farm Shop': 'cornwall-coastal',
        'Cumbria Dairy Farm Shop': 'cumbria-dairy',
        'Somerset Cider Farm Shop': 'somerset-cider',
        'Herefordshire Beef Farm Shop': 'herefordshire-beef',
        'Sussex Apple Farm Shop': 'sussex-apple',
        'Lancashire Dairy Farm Shop': 'lancashire-dairy',
        'Scottish Highland Farm Shop': 'scottish-highland',
        'Welsh Mountain Farm Shop': 'welsh-mountain',
        'Norfolk Broads Farm Shop': 'norfolk-broads'
    };
    return farmMap[farmName] || 'other';
}

// Add to cart function for shop page
function addToCartFromShop(productId) {
    if (typeof window.addToCart === 'function') {
        window.addToCart(productId);
    } else {
        console.error('🛒 Cart functionality not found! Make sure cart.js is loaded before shop.js.');
        alert('Cart functionality not found! Please refresh the page.');
    }
}

// Check URL parameters and apply filters
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const farmParam = urlParams.get('farm');
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    const productParam = urlParams.get('product');
    

    
    if (farmParam) {
        // Find and check the corresponding farm filter checkbox
        const farmFilter = document.querySelector(`.farm-filter[value="${farmParam}"]`);
        if (farmFilter) {
            farmFilter.checked = true;
        }
    }
    
    if (categoryParam) {
        // Decode the category parameter (handle URL encoding)
        const decodedCategory = decodeURIComponent(categoryParam);
        // Find and check the corresponding category filter checkbox
        const categoryFilter = document.querySelector(`.category-filter[value="${decodedCategory}"]`);
        if (categoryFilter) {
            categoryFilter.checked = true;
            } else {
            // List available category filters for debugging
            const availableCategories = Array.from(document.querySelectorAll('.category-filter')).map(f => f.value);
            // Try to find a partial match
            const partialMatch = availableCategories.find(cat => 
                cat.toLowerCase().includes(decodedCategory.toLowerCase()) ||
                decodedCategory.toLowerCase().includes(cat.toLowerCase())
            );
            if (partialMatch) {
                const partialFilter = document.querySelector(`.category-filter[value="${partialMatch}"]`);
                if (partialFilter) {
                    partialFilter.checked = true;
                    }
            }
        }
    }
    
    if (searchParam) {
        // Decode the search parameter
        const decodedSearch = decodeURIComponent(searchParam);
        // Apply search filter to products with a delay to ensure products are loaded
        setTimeout(() => {
            if (allProducts.length > 0) {
                const searchResults = allProducts.filter(product => 
                    product.name.toLowerCase().includes(decodedSearch.toLowerCase()) ||
                    product.description.toLowerCase().includes(decodedSearch.toLowerCase()) ||
                    product.category.toLowerCase().includes(decodedSearch.toLowerCase())
                );
                
                filteredProducts = searchResults;
                displayProducts(filteredProducts);
                updateProductCount(filteredProducts.length);
            } else {
                setTimeout(() => {
                    const searchResults = allProducts.filter(product => 
                        product.name.toLowerCase().includes(decodedSearch.toLowerCase()) ||
                        product.description.toLowerCase().includes(decodedSearch.toLowerCase()) ||
                        product.category.toLowerCase().includes(decodedSearch.toLowerCase())
                    );
                    
                    filteredProducts = searchResults;
                    displayProducts(filteredProducts);
                    updateProductCount(filteredProducts.length);
                }, 500);
            }
        }, 100);
    }
    
    if (productParam) {
        // Decode the product parameter
        const decodedProduct = decodeURIComponent(productParam);
        // Apply product search filter with a delay
        setTimeout(() => {
            if (allProducts.length > 0) {
                const productResults = allProducts.filter(product => 
                    product.name.toLowerCase().includes(decodedProduct.toLowerCase()) ||
                    product.description.toLowerCase().includes(decodedProduct.toLowerCase())
                );
                
                filteredProducts = productResults;
                displayProducts(filteredProducts);
                updateProductCount(filteredProducts.length);
            } else {
                setTimeout(() => {
                    const productResults = allProducts.filter(product => 
                        product.name.toLowerCase().includes(decodedProduct.toLowerCase()) ||
                        product.description.toLowerCase().includes(decodedProduct.toLowerCase())
                    );
                    
                    filteredProducts = productResults;
                    displayProducts(filteredProducts);
                    updateProductCount(filteredProducts.length);
                }, 500);
            }
        }, 100);
    }
    
    // Apply filters after a short delay to ensure products are loaded
    if (farmParam || categoryParam) {
        setTimeout(() => {
            applyFilters();
        }, 100);
    }
} 