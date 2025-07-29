/**
 * Farm Co-op Application Module
 * Main application controller for the Great British Farm Co-op website
 * Handles product display, filtering, carousel functionality, and user interactions
 * 
 * @author Joe Perkins
 * @studentId 2417880
 * @version 1.0.0
 * @since 2024
 */
const FarmCoop = {
    /**
     * Application state management
     * @type {Object}
     */
    state: {
        /** @type {Array} All products loaded from data source */
        allProducts: [],
        /** @type {Array} Products filtered by user selections */
        filteredProducts: [],
        /** @type {string} Currently selected product category */
        currentCategory: 'all',
        /** @type {number} Current carousel slide index */
        currentCarouselIndex: 0
    },

    /**
     * Cached DOM elements for performance optimization
     * @type {Object}
     */
    elements: {
        /** @type {HTMLElement|null} Product list container */
        productList: null,
        /** @type {HTMLElement|null} Loading indicator */
        loading: null,
        /** @type {HTMLElement|null} No products message container */
        noProducts: null,
        /** @type {HTMLElement|null} Season filter dropdown */
        seasonFilter: null,
        /** @type {HTMLElement|null} Availability filter dropdown */
        availabilityFilter: null,
        /** @type {HTMLElement|null} Sort by dropdown */
        sortBy: null,
        /** @type {HTMLElement|null} Contact form element */
        contactForm: null
    },

    /**
     * Initialize the application
     * Sets up DOM caching, loads data, and initializes page-specific features
     */
    init() {
        this.cacheElements();
        this.loadProducts();
        this.initializeFilters();
        this.initializeContactForm();
        this.initializeFooterLinks();
        this.initializeMapFeatures();
        
        // Page-specific initialization
        if (window.location.pathname.includes('index.html')) {
            // Product carousel is handled by displayProducts function
        }
        if (window.location.pathname.includes('farms.html')) {
            this.initFarmCarousel();
            this.initMap();
        }
    },

    /**
     * Cache DOM elements for better performance
     * Reduces DOM queries by storing frequently accessed elements
     */
    cacheElements() {
        this.elements.productList = document.getElementById('product-list');
        this.elements.loading = document.getElementById('loading');
        this.elements.noProducts = document.getElementById('no-products');
        this.elements.seasonFilter = document.getElementById('season-filter');
        this.elements.availabilityFilter = document.getElementById('availability-filter');
        this.elements.sortBy = document.getElementById('sort-by');
        this.elements.contactForm = document.getElementById('contact-form');
    },

    /**
     * Load products from JSON data source
     * Fetches product data and updates application state
     * @async
     */
    async loadProducts() {
        try {
            this.showLoading(true);
            this.state.allProducts = await loadProductsData();
            this.state.filteredProducts = [...this.state.allProducts];
            
            this.displayProducts(this.state.filteredProducts);
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products. Please try again later.');
            this.showLoading(false);
        }
    },

    /**
     * Display products in the carousel
     * Creates product cards and initializes carousel functionality
     * @param {Array} products - Array of product objects to display
     */
    displayProducts(products) {
        const carouselTrack = document.querySelector('#productCarouselTrack');
        const carouselDots = document.querySelector('#productCarouselDots');
        
        if (!carouselTrack) return;

        // Clear the carousel
        carouselTrack.innerHTML = '';
        if (carouselDots) carouselDots.innerHTML = '';

        if (products.length === 0) {
            this.showNoProducts();
            return;
        }

        // Create product cards
        products.forEach((product, index) => {
            const card = this.createProductCard(product);
            carouselTrack.appendChild(card);
        });

        // Initialize carousel if needed
        if (products.length > 4) {
            this.initializeProductsCarousel(products.length);
        }
    },

    /**
     * Create a product card element
     * Generates HTML for individual product display
     * @param {Object} product - Product object with name, description, price, etc.
     * @returns {HTMLElement} Product card DOM element
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">£${product.price} ${product.unit}</div>
                <div class="product-meta">
                    <span class="product-category">${product.category}</span>
                    <span class="product-availability ${this.getAvailabilityClass(product.availability)}">
                        ${product.availability}
                    </span>
                </div>
                ${product.rating ? `
                    <div class="product-rating">
                        ${this.createRatingStars(product.rating)}
                        <span class="review-count">(${product.reviews} reviews)</span>
                    </div>
                ` : ''}
                <div class="product-farm">From: ${product.farmName}</div>
            </div>
        `;
        return card;
    },

    /**
     * Create rating stars display
     * Converts numerical rating to star symbols
     * @param {number} rating - Product rating (0-5)
     * @returns {string} HTML string with star symbols
     */
    createRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    },

    /**
     * Get CSS class for availability status
     * Maps availability text to CSS classes for styling
     * @param {string} availability - Availability status text
     * @returns {string} CSS class name
     */
    getAvailabilityClass(availability) {
        switch (availability.toLowerCase()) {
            case 'in stock': return 'availability-in-stock';
            case 'out of stock': return 'availability-out-of-stock';
            case 'limited': return 'availability-limited';
            default: return '';
        }
    },

    /**
     * Show or hide loading state
     * Controls loading indicator visibility
     * @param {boolean} show - Whether to show loading indicator
     */
    showLoading(show) {
        if (this.elements.loading) {
            this.elements.loading.style.display = show ? 'block' : 'none';
        }
    },

    /**
     * Show no products message
     * Displays message when no products match filters
     */
    showNoProducts() {
        if (this.elements.noProducts) {
            this.elements.noProducts.style.display = 'block';
        }
    },

    /**
     * Show error message
     * Handles error display to user
     * @param {string} message - Error message to display
     */
    showError(message) {
        console.error(message);
        // You can implement a proper error display system here
    },

    /**
     * Initialize filters (placeholder - implement as needed)
     * Sets up product filtering functionality
     */
    initializeFilters() {
        // Filter initialization logic
    },

    /**
     * Initialize contact form (placeholder - implement as needed)
     * Sets up contact form validation and submission
     */
    initializeContactForm() {
        // Contact form initialization logic
    },

    /**
     * Initialize footer links (placeholder - implement as needed)
     * Sets up footer navigation functionality
     */
    initializeFooterLinks() {
        // Footer links initialization logic
    },

    /**
     * Initialize map features (placeholder - implement as needed)
     * Sets up interactive map functionality
     */
    initializeMapFeatures() {
        // Map features initialization logic
    },

    /**
     * Initialize farm carousel
     * Loads farm data and creates carousel display
     * @async
     */
    async initFarmCarousel() {
        try {
            const farms = await loadFarms();
            const container = document.querySelector('#farm-carousel .products');
            if (!container) return;
            
            container.innerHTML = '';

            if (farms.length === 0) {
                container.innerHTML = '<p>No farms available.</p>';
                return;
            }

            farms.forEach(farm => {
                const card = `
                    <div class="farm-card">
                        <img class="lazy" data-src="${farm.image}" src="assets/images/farm-placeholder.jpg" alt="${farm.name}">
                        <h3>${farm.name}</h3>
                        <p>${farm.description}</p>
                        <a href="farm.html?id=${farm.id}" class="btn">View Farm</a>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', card);
            });

            this.lazyLoadImages();
            this.setupCarouselNavigation('#farm-carousel');
        } catch (error) {
            showMessage('Failed to load farms for carousel.', 'error');
        }
    },

    /**
     * Initialize map
     * Sets up and configures the Leaflet map for displaying farm locations
     * @async
     */
    async initMap() {
        try {
            const farms = await loadFarms();
            const map = L.map('farm-map').setView([54.5, -2.5], 6); // UK center

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            farms.forEach(farm => {
                if (farm.lat && farm.lng) {
                    L.marker([farm.lat, farm.lng]).addTo(map).bindPopup(`
                        <b>${farm.name}</b><br>${farm.description}<br>
                        <a href="farm.html?id=${farm.id}">View Details</a>
                    `);
                }
            });
        } catch (error) {
            showMessage('Failed to load map.', 'error');
        }
    },

    /**
     * Lazy load images
     * Observes images and loads them when they come into the viewport
     */
    lazyLoadImages() {
        const images = document.querySelectorAll('img.lazy');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => observer.observe(img));
    },

    /**
     * Setup carousel navigation
     * Configures navigation buttons and dots for a carousel container
     * @param {string} containerSelector - Selector for the carousel container
     */
    setupCarouselNavigation(containerSelector) {
        const container = document.querySelector(containerSelector);
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const itemsContainer = container.querySelector('.products');

        if (!prevBtn || !nextBtn || !itemsContainer) return;

        const itemWidth = itemsContainer.children[0]?.offsetWidth + 20; // Include margin
        const visibleItems = Math.floor(container.offsetWidth / itemWidth) || 1;
        const maxIndex = itemsContainer.children.length - visibleItems;

        const goPrev = () => {
            this.state.currentCarouselIndex = Math.max(this.state.currentCarouselIndex - 1, 0);
            itemsContainer.style.transform = `translateX(-${this.state.currentCarouselIndex * itemWidth}px)`;
        };

        const goNext = () => {
            this.state.currentCarouselIndex = Math.min(this.state.currentCarouselIndex + 1, maxIndex);
            itemsContainer.style.transform = `translateX(-${this.state.currentCarouselIndex * itemWidth}px)`;
        };

        // Handle both click and touch events
        prevBtn.addEventListener('click', goPrev);
        prevBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            goPrev();
        });

        nextBtn.addEventListener('click', goNext);
        nextBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            goNext();
        });

        // Reset on resize
        window.addEventListener('resize', () => {
            this.state.currentCarouselIndex = 0;
            itemsContainer.style.transform = 'translateX(0)';
        });
    }
};



// Load data functions directly
async function loadProductsData() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

async function loadFarms() {
    try {
        const response = await fetch('data/farms.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error loading farms:', error);
        return [];
    }
}

function showMessage(message, type = 'info') {
    // You can implement a proper message display system here
}

let currentCarouselIndex = 0;

// Shared Carousel Navigation Function
function setupCarouselNavigation(containerSelector) {
  const container = document.querySelector(containerSelector);
  const prevBtn = container.querySelector('.prev');
  const nextBtn = container.querySelector('.next');
  const itemsContainer = container.querySelector('.products');

  if (!prevBtn || !nextBtn || !itemsContainer) return;

  const itemWidth = itemsContainer.children[0]?.offsetWidth + 20; // Include margin
  const visibleItems = Math.floor(container.offsetWidth / itemWidth) || 1;
  const maxIndex = itemsContainer.children.length - visibleItems;

  const goPrev = () => {
    currentCarouselIndex = Math.max(currentCarouselIndex - 1, 0);
    itemsContainer.style.transform = `translateX(-${currentCarouselIndex * itemWidth}px)`;
  };

  const goNext = () => {
    currentCarouselIndex = Math.min(currentCarouselIndex + 1, maxIndex);
    itemsContainer.style.transform = `translateX(-${currentCarouselIndex * itemWidth}px)`;
  };

  // Handle both click and touch events
  prevBtn.addEventListener('click', goPrev);
  prevBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    goPrev();
  });

  nextBtn.addEventListener('click', goNext);
  nextBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    goNext();
  });

  // Reset on resize
  window.addEventListener('resize', () => {
    currentCarouselIndex = 0;
    itemsContainer.style.transform = 'translateX(0)';
  });
}

// Product Carousel functionality removed - replaced with seasonal highlights

// Farm Carousel in farms.html
async function initFarmCarousel() {
  try {
    const farms = await loadFarms();
    const container = document.querySelector('#farm-carousel .products'); // Adjust selector
    container.innerHTML = '';

    if (farms.length === 0) {
      container.innerHTML = '<p>No farms available.</p>';
      return;
    }

    farms.forEach(farm => {
      const card = `
        <div class="farm-card">
          <img class="lazy" data-src="${farm.image}" src="assets/images/farm-placeholder.jpg" alt="${farm.name}">
          <h3>${farm.name}</h3>
          <p>${farm.description}</p>
          <a href="farm.html?id=${farm.id}" class="btn">View Farm</a>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', card);
    });

    lazyLoadImages();
    setupCarouselNavigation('#farm-carousel');
  } catch (error) {
    showMessage('Failed to load farms for carousel.', 'error');
  }
}

// Lazy Loading for Images
function lazyLoadImages() {
  const images = document.querySelectorAll('img.lazy');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
}

// Map Initialization
async function initMap() {
  try {
    const farms = await loadFarms();
    const map = L.map('farm-map').setView([54.5, -2.5], 6); // UK center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    farms.forEach(farm => {
      if (farm.lat && farm.lng) {
        L.marker([farm.lat, farm.lng]).addTo(map).bindPopup(`
          <b>${farm.name}</b><br>${farm.description}<br>
          <a href="farm.html?id=${farm.id}">View Details</a>
        `);
      }
    });
  } catch (error) {
    showMessage('Failed to load map.', 'error');
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    FarmCoop.init();
});



// Load products from JSON file
async function loadProducts() {
    try {
        showLoading(true);
        allProducts = await loadProductsData();
        filteredProducts = [...allProducts];
        
        displayProducts(filteredProducts);
        showLoading(false);
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please try again later.');
        showLoading(false);
    }
}

// Display products in the carousel
function displayProducts(products) {
    const carouselTrack = document.querySelector('#productCarouselTrack');
    const carouselDots = document.querySelector('#productCarouselDots');
    
    if (!carouselTrack) return;

    // Clear the carousel
    carouselTrack.innerHTML = '';
    if (carouselDots) carouselDots.innerHTML = '';

    if (products.length === 0) {
        showNoProducts();
        return;
    }

    // Create product cards for carousel
    products.forEach((product, index) => {
        const productCard = createProductCard(product);
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

    // Initialize carousel functionality
    initializeProductsCarousel(products.length);
}

// Initialize products carousel
function initializeProductsCarousel(productCount) {
    const carouselTrack = document.querySelector('#productCarouselTrack');
    const carouselDots = document.querySelector('#productCarouselDots');
    
    if (!carouselTrack) return;
    
    let currentSlide = 0;
    const productsPerView = 4; // Show 4 products at once
    const totalSlides = Math.ceil(productCount / productsPerView);
    
    // Update carousel buttons
    function updateCarouselButtons() {
        const prevBtn = document.querySelector('#productPrevBtn');
        const nextBtn = document.querySelector('#productNextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentSlide === totalSlides - 1;
        }
    }
    
    // Update carousel dots
    function updateCarouselDots() {
        const dots = document.querySelectorAll('#productCarouselDots .carousel-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        currentSlide = index;
        const cards = carouselTrack.querySelectorAll('.product-card');
        if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
            const slideWidth = (cardWidth * productsPerView) + (gap * (productsPerView - 1));
            const translateX = - (currentSlide * slideWidth);
            carouselTrack.style.transform = `translateX(${translateX}px)`;
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        }
        
        updateCarouselButtons();
        updateCarouselDots();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Setup event listeners
    const prevBtn = document.querySelector('#productPrevBtn');
    const nextBtn = document.querySelector('#productNextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Carousel dots event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('carousel-dot') && e.target.closest('#productCarouselDots')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            goToSlide(index);
        }
    });
    
    // Initialize
    updateCarouselButtons();
    updateCarouselDots();
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const availabilityClass = getAvailabilityClass(product.availability);
    const ratingStars = createRatingStars(product.rating);
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
                            <div class="product-price">£${product.price.toFixed(2)} ${product.unit}</div>
            <div class="product-meta">
                <span class="product-category">${product.category}</span>
                <span class="product-availability ${availabilityClass}">${product.availability}</span>
            </div>
            <p class="product-farm">From ${product.farmName}</p>
            ${product.rating ? `
                <div class="product-rating">
                    ${ratingStars}
                    <span class="rating-text">${product.rating.toFixed(1)} (${product.reviews} reviews)</span>
                </div>
            ` : ''}
        </div>
    `;

    return card;
}

// Create rating stars
function createRatingStars(rating) {
    if (!rating) return '';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '☆';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return `<span class="stars">${stars}</span>`;
}

// Get availability CSS class
function getAvailabilityClass(availability) {
    switch (availability) {
        case 'In Stock':
            return 'availability-in-stock';
        case 'Out of Stock':
            return 'availability-out-of-stock';
        case 'Limited':
            return 'availability-limited';
        default:
            return '';
    }
}

// Initialize filters
function initializeFilters() {
    // Initialize category carousel
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get the category from data attribute
            currentCategory = this.getAttribute('data-category');
            
            // Filter products
            filterProducts();
        });
    });
    
    // Set "All Products" as active by default
    const allProductsCard = document.querySelector('.category-card[data-category="all"]');
    if (allProductsCard) {
        allProductsCard.classList.add('active');
    }
    
    if (seasonFilter) {
        seasonFilter.addEventListener('change', filterProducts);
    }
    
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', filterProducts);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterProducts);
    }
}

// Filter and sort products
function filterProducts() {
    let filtered = [...allProducts];

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === currentCategory);
    }

    // Filter by season
    const selectedSeason = seasonFilter ? seasonFilter.value : 'all';
    if (selectedSeason !== 'all') {
        filtered = filtered.filter(product => product.season === selectedSeason);
    }

    // Filter by availability
    const selectedAvailability = availabilityFilter ? availabilityFilter.value : 'all';
    if (selectedAvailability !== 'all') {
        filtered = filtered.filter(product => product.availability === selectedAvailability);
    }

    // Sort products
    const sortValue = sortBy ? sortBy.value : 'name';
    filtered = sortProducts(filtered, sortValue);

    filteredProducts = filtered;
    displayProducts(filteredProducts);
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
        case 'category':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        case 'season':
            return sorted.sort((a, b) => a.season.localeCompare(b.season));
        default:
            return sorted;
    }
}

// Show/hide loading state
function showLoading(show) {
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
    if (productList) {
        productList.style.display = show ? 'none' : 'grid';
    }
}

// Show no products message
function showNoProducts() {
    if (noProducts) {
        noProducts.style.display = 'block';
    }
    if (productList) {
        productList.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background-color: #e74c3c;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        text-align: center;
    `;
    
    if (productList && productList.parentNode) {
        productList.parentNode.insertBefore(errorDiv, productList);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize contact form
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            handleContactFormSubmission();
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
}

// Validate contact form
function validateContactForm() {
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');
    
    let isValid = true;
    
    // Validate name
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showFieldError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showFieldError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                showFieldError(field, 'Name is required');
            } else if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(field, 'Email is required');
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError(field, 'Message is required');
            } else if (value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters');
            } else {
                clearFieldError(field);
            }
            break;
    }
}

// Show field error
function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.style.borderColor = '#e74c3c';
}

// Clear field error
function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.style.borderColor = '#e0e0e0';
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle contact form submission
function handleContactFormSubmission() {
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessMessage('Thank you for your message! We\'ll get back to you soon.');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background-color: #27ae60;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        text-align: center;
    `;
    
    if (contactForm && contactForm.parentNode) {
        contactForm.parentNode.insertBefore(successDiv, contactForm);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }
}

// Initialize footer category links
function initializeFooterLinks() {
    const footerCategoryLinks = document.querySelectorAll('.footer-section a[data-category]');
    
    footerCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.getAttribute('data-category');
            
            // Set the category filter
            if (categoryFilter) {
                categoryFilter.value = category;
            }
            
            // Filter products
            filterProducts();
            
            // Scroll to products section
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Initialize map features
function initializeMapFeatures() {
    // Add location button to map section
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const locationButton = document.createElement('button');
        locationButton.className = 'btn btn-primary';
        locationButton.textContent = '📍 Find My Location';
        locationButton.style.marginTop = '1rem';
        locationButton.addEventListener('click', () => {
            if (window.farmMap && window.farmMap.getUserLocation) {
                window.farmMap.getUserLocation();
            }
        });
        
        const mapControls = mapContainer.querySelector('.map-controls');
        if (mapControls) {
            mapControls.appendChild(locationButton);
        }
    }
}

// Add CSS for rating stars
const style = document.createElement('style');
style.textContent = `
    .product-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .stars {
        color: #f39c12;
        font-size: 1.1rem;
    }
    
    .rating-text {
        font-size: 0.9rem;
        color: #7f8c8d;
    }
    
    .success-message {
        background-color: #27ae60;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Product Carousel Functions removed - replaced with seasonal highlights 