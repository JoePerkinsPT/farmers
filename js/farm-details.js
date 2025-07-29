// Farm Details Page JavaScript

let currentFarm = null;

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load farm data from JSON
async function loadFarmData(farmId) {
    try {
        const response = await fetch('data/farms.json');
        const farms = await response.json();
        
        const farm = farms.find(f => f.id == farmId);
        if (farm) {
            return farm;
        } else {
            throw new Error('Farm not found');
        }
    } catch (error) {
        console.error('Error loading farm data:', error);
        return null;
    }
}

// Display farm information
function displayFarmDetails(farm) {
    // Update page title
    document.title = `${farm.name} - British Farm Co-op`;
    
    // Update farm name
    document.getElementById('farm-name').textContent = farm.name;
    
    // Update farm location
    document.getElementById('farm-location').textContent = `📍 Location: ${farm.location}`;
    
    // Update farm description
    document.getElementById('farm-description').textContent = farm.description;
    
    // Update farm address
    document.getElementById('farm-address').textContent = farm.location;
    
    // Update farm image if available
    if (farm.image) {
        document.getElementById('farm-image').src = farm.image;
        document.getElementById('farm-image').alt = farm.name;
    }
    
    // Display farm tags/categories
    displayFarmTags(farm.specialties);
    
    // Display products
    displayFarmProducts(farm.specialties);
    
    // Display categories
    displayFarmCategories(farm.specialties);
    
    // Set farm type based on specialties
    setFarmType(farm.specialties);
    
    // Set established date (placeholder)
    document.getElementById('farm-established').textContent = 'Traditional British Farm';
}

// Display farm tags
function displayFarmTags(specialties) {
    const tagsContainer = document.getElementById('farm-tags');
    const tagsHtml = specialties.map(specialty => 
        `<span class="farm-tag">${specialty}</span>`
    ).join('');
    tagsContainer.innerHTML = tagsHtml;
}

// Display farm products
function displayFarmProducts(specialties) {
    const productsContainer = document.getElementById('products-grid');
    const productsHtml = specialties.map(product => `
        <div class="product-card">
            <div class="product-icon">🌾</div>
            <h3>${product}</h3>
            <p>Traditional British ${product.toLowerCase()}</p>
        </div>
    `).join('');
    productsContainer.innerHTML = productsHtml;
}

// Display farm categories
function displayFarmCategories(specialties) {
    const categoriesContainer = document.getElementById('categories-list');
    const categories = extractCategories(specialties);
    const categoriesHtml = categories.map(category => `
        <div class="category-item">
            <span class="category-icon">🏷️</span>
            <span class="category-name">${category}</span>
        </div>
    `).join('');
    categoriesContainer.innerHTML = categoriesHtml;
}

// Extract categories from specialties (same function as in map.js)
function extractCategories(specialties) {
    const categories = [];
    const categoryKeywords = {
        'Meats': ['beef', 'lamb', 'pork', 'chicken', 'turkey', 'goose', 'venison', 'meat', 'steak', 'sausages', 'bacon'],
        'Dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'dairy'],
        'Vegetables': ['vegetables', 'potatoes', 'carrots', 'spinach', 'cauliflower', 'broccoli', 'leeks', 'organic vegetables'],
        'Fruits': ['apples', 'strawberries', 'cherries', 'pears', 'berries', 'fruits', 'pyo'],
        'Grains': ['oats', 'wheat', 'bread', 'flour', 'grains', 'sourdough'],
        'Honey': ['honey', 'local honey'],
        'Eggs': ['eggs', 'free-range eggs'],
        'Beverages': ['cider', 'juice', 'beer', 'wine', 'whisky', 'coffee'],
        'Preserves': ['jams', 'chutneys', 'preserves', 'sauces'],
        'Bakery': ['bread', 'cakes', 'pastries', 'scones', 'bakery']
    };
    
    const specialtiesText = specialties.join(' ').toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => specialtiesText.includes(keyword))) {
            categories.push(category);
        }
    }
    
    return categories.length > 0 ? categories : ['Local Produce'];
}

// Set farm type based on specialties
function setFarmType(specialties) {
    const specialtiesText = specialties.join(' ').toLowerCase();
    let farmType = 'Mixed Farm';
    
    if (specialtiesText.includes('organic')) {
        farmType = 'Organic Farm';
    } else if (specialtiesText.includes('dairy') || specialtiesText.includes('cheese')) {
        farmType = 'Dairy Farm';
    } else if (specialtiesText.includes('beef') || specialtiesText.includes('lamb') || specialtiesText.includes('pork')) {
        farmType = 'Livestock Farm';
    } else if (specialtiesText.includes('vegetables') || specialtiesText.includes('fruits')) {
        farmType = 'Arable Farm';
    }
    
    document.getElementById('farm-type').textContent = farmType;
}

// Action functions
function contactFarm() {
    alert('Contact functionality would be implemented here. For now, please use the main contact form.');
}

function viewOnMap() {
    // Navigate back to farms page and focus on this farm
    window.location.href = `farms.html#farm-map`;
}

function shopFarmProducts() {
    // Navigate to shop page with farm filter
    const farmName = currentFarm ? currentFarm.name : '';
    window.location.href = `shop.html?farm=${encodeURIComponent(farmName)}`;
}

// Initialize the page
async function initializeFarmDetails() {
    const farmId = getUrlParameter('id');
    const farmName = getUrlParameter('name');
    
    if (!farmId) {
        document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Farm Not Found</h1><p>No farm ID provided.</p><a href="farms.html">← Back to Farms</a></div>';
        return;
    }
    

    
    // Load farm data
    const farm = await loadFarmData(farmId);
    
    if (farm) {
        currentFarm = farm;
        displayFarmDetails(farm);
    } else {
        document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Farm Not Found</h1><p>The requested farm could not be found.</p><a href="farms.html">← Back to Farms</a></div>';
    }
}

// Initialize navigation
function initializeNavigation() {

    
    
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

    initializeNavigation();
    initializeFarmDetails();
}); 