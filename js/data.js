// Consolidated Data Loading System
// Replaces duplicate data loading functions across all files

class DataManager {
    /**
     * Load products from JSON with enhanced error handling and image replacement
     * @param {boolean} cacheBust - Whether to add cache busting parameter
     * @returns {Promise<Array>} - Array of products
     */
    static async loadProducts(cacheBust = true) {
  try {
            const url = cacheBust ? 
                `data/products.json?t=${new Date().getTime()}` : 
                'data/products.json';
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            
            // Replace Unsplash images with reliable placeholders
            products.forEach(product => {
                if (product.image && product.image.includes('unsplash.com')) {
                    const category = product.category || 'Product';
                    const name = product.name || 'Product';
                    const color = this.getCategoryColor(category);
                    product.image = `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(name)}`;
                }
            });
            
            return products;
        } catch (error) {
            console.error('Error loading products:', error);
            
            // Return fallback products for better UX
            return [
                {
                    id: "fallback_001",
                    name: "Sample Organic Carrots",
                    description: "Fresh organic carrots for demonstration purposes.",
                    price: 2.50,
                    unit: "per kg",
                    category: "Vegetables",
                    farmName: "Sample Farm",
                    availability: "In Stock",
                    season: "All Year",
                    image: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Sample+Carrots",
                    rating: 4.5,
                    reviews: 10
                },
                {
                    id: "fallback_002",
                    name: "Sample Free-Range Eggs",
                    description: "Fresh free-range eggs for demonstration purposes.",
                    price: 3.50,
                    unit: "per dozen",
                    category: "Dairy & Eggs",
                    farmName: "Sample Farm",
                    availability: "In Stock",
                    season: "All Year",
                    image: "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Sample+Eggs",
                    rating: 4.8,
                    reviews: 15
                }
            ];
        }
    }
    
    /**
     * Load farms from JSON with enhanced error handling
     * @param {boolean} cacheBust - Whether to add cache busting parameter
     * @returns {Promise<Array>} - Array of farms
     */
    static async loadFarms(cacheBust = true) {
        try {
            const url = cacheBust ? 
                `data/farms.json?t=${new Date().getTime()}` : 
                'data/farms.json';
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
    return await response.json();
  } catch (error) {
            console.error('Error loading farms:', error);
    return [];
  }
}

    /**
     * Load farm locations for map display
     * @param {boolean} cacheBust - Whether to add cache busting parameter
     * @returns {Promise<Array>} - Array of farm locations with coordinates
     */
    static async loadFarmLocations(cacheBust = true) {
  try {
            const farms = await this.loadFarms(cacheBust);
            
            // Farm coordinates mapping (simplified for demo)
            const farmCoordinates = {
                'Devon Valley Farm': [50.7, -3.5],
                'Kent Apple Orchard': [51.3, 0.5],
                'Yorkshire Beef Farm': [54.0, -1.5],
                'Cornwall Vegetable Farm': [50.3, -4.8],
                'Scottish Highland Farm': [57.1, -4.2],
                'Murton Farm Shop': [55.8, -2.5],
                'Gower Salt Marsh Lamb': [51.6, -4.1],
                'Forage Farm Shop': [52.2, -0.9]
            };
            
            // Convert farms to map format with coordinates
            return farms.map(farm => {
                const coordinates = farmCoordinates[farm.name];
                if (!coordinates) {
                    console.warn(`No coordinates found for farm: ${farm.name}`);
                    return null;
                }
                
                return {
                    id: farm.id,
                    name: farm.name,
                    position: coordinates,
                    products: farm.specialties || [],
                    categories: this.extractCategories(farm.specialties || []),
                    description: farm.description,
                    contact: "Contact farm directly",
                    address: farm.location,
                    image: farm.image
                };
            }).filter(farm => farm !== null);
            
  } catch (error) {
            console.error('Error loading farm locations:', error);
    return [];
  }
} 
    
    /**
     * Get category color for placeholder images
     * @param {string} category - Product category
     * @returns {string} - Hex color code
     */
    static getCategoryColor(category) {
        const colors = {
            'Vegetables': '4CAF50',
            'Fruits': 'FF9800',
            'Meat': 'F44336',
            'Dairy & Eggs': '2196F3',
            'Bakery': '795548',
            'Pantry': '9C27B0',
            'Grains': '8BC34A',
            'Herbs': '4CAF50',
            'Honey': 'FFC107'
        };
        return colors[category] || '1A3C34';
    }
    
    /**
     * Extract categories from farm specialties
     * @param {Array} specialties - Farm specialties array
     * @returns {Array} - Array of categories
     */
    static extractCategories(specialties) {
        const categoryMap = {
            'carrots': 'Vegetables',
            'potatoes': 'Vegetables',
            'tomatoes': 'Vegetables',
            'apples': 'Fruits',
            'berries': 'Fruits',
            'beef': 'Meat',
            'lamb': 'Meat',
            'pork': 'Meat',
            'eggs': 'Dairy & Eggs',
            'milk': 'Dairy & Eggs',
            'cheese': 'Dairy & Eggs',
            'bread': 'Bakery',
            'honey': 'Pantry'
        };
        
        return specialties.map(specialty => {
            const lowerSpecialty = specialty.toLowerCase();
            for (const [key, category] of Object.entries(categoryMap)) {
                if (lowerSpecialty.includes(key)) {
                    return category;
                }
            }
            return 'Other';
        }).filter((category, index, arr) => arr.indexOf(category) === index);
    }
    
    /**
     * Load data with loading indicator
     * @param {Function} loaderFunction - Function to load data
     * @param {string} loadingMessage - Message to show while loading
     * @returns {Promise<Array>} - Loaded data
     */
    static async loadWithIndicator(loaderFunction, loadingMessage = 'Loading...') {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'data-loading';
        loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${loadingMessage}</p>
        `;
        
        // Add loading styles if not present
        if (!document.querySelector('#data-loading-styles')) {
            const styles = document.createElement('style');
            styles.id = 'data-loading-styles';
            styles.textContent = `
                .data-loading {
                    text-align: center;
                    padding: 2rem;
                    color: #6c757d;
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #1A3C34;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Show loading indicator
        const container = document.querySelector('.container') || document.body;
        container.appendChild(loadingElement);
        
        try {
            const data = await loaderFunction();
            loadingElement.remove();
            return data;
        } catch (error) {
            loadingElement.remove();
            throw error;
        }
    }
    
    /**
     * Cache data in localStorage for offline use
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} expiryHours - Hours until cache expires
     */
    static cacheData(key, data, expiryHours = 24) {
        try {
            const cacheItem = {
                data: data,
                timestamp: Date.now(),
                expiry: Date.now() + (expiryHours * 60 * 60 * 1000)
            };
            localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Error caching data:', error);
        }
    }
    
    /**
     * Get cached data from localStorage
     * @param {string} key - Cache key
     * @returns {any|null} - Cached data or null if expired/not found
     */
    static getCachedData(key) {
        try {
            const cached = localStorage.getItem(`cache_${key}`);
            if (!cached) return null;
            
            const cacheItem = JSON.parse(cached);
            if (Date.now() > cacheItem.expiry) {
                localStorage.removeItem(`cache_${key}`);
                return null;
            }
            
            return cacheItem.data;
        } catch (error) {
            console.error('Error getting cached data:', error);
            return null;
        }
    }
    
    /**
     * Load products with caching
     * @param {boolean} useCache - Whether to use cached data
     * @returns {Promise<Array>} - Array of products
     */
    static async loadProductsWithCache(useCache = true) {
        if (useCache) {
            const cached = this.getCachedData('products');
            if (cached) {
                return cached;
            }
        }
        
        const products = await this.loadProducts();
        this.cacheData('products', products, 6); // Cache for 6 hours
        return products;
    }
    
    /**
     * Load farms with caching
     * @param {boolean} useCache - Whether to use cached data
     * @returns {Promise<Array>} - Array of farms
     */
    static async loadFarmsWithCache(useCache = true) {
        if (useCache) {
            const cached = this.getCachedData('farms');
            if (cached) {
                return cached;
            }
        }
        
        const farms = await this.loadFarms();
        this.cacheData('farms', farms, 12); // Cache for 12 hours
        return farms;
    }
}

// Make functions globally available for backward compatibility
window.loadProducts = DataManager.loadProducts.bind(DataManager);
window.loadFarms = DataManager.loadFarms.bind(DataManager);
window.loadFarmLocations = DataManager.loadFarmLocations.bind(DataManager);
window.loadProductsWithCache = DataManager.loadProductsWithCache.bind(DataManager);
window.loadFarmsWithCache = DataManager.loadFarmsWithCache.bind(DataManager);

// Make the class globally available
window.DataManager = DataManager; 