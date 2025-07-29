// Comprehensive UK Seasonal Calendar JavaScript
console.log('🚀 Calendar.js loaded successfully - version 1002');

// UK Seasonal Produce Data
const seasonalData = {
    january: {
        meat: ['Duck (end)', 'Goose (end)', 'Rabbit', 'Turkey', 'Venison'],
        vegetables: ['Brussels sprouts', 'Carrots', 'Cauliflower', 'Celeriac', 'Kale', 'Leeks', 'Mushrooms (wild)', 'Parsnips', 'Potatoes (main crop)', 'Rhubarb (start)', 'Savoy cabbage', 'Shallots', 'Swedes', 'Turnips'],
        fruits: ['Apples (Bramley)', 'Clementines', 'Kiwi fruit (mid-Jan)', 'Lemons (start)', 'Oranges (start)', 'Passion fruit', 'Pears', 'Pomegranate']
    },
    february: {
        meat: ['Rabbit', 'Turkey (end)', 'Venison (end)'],
        vegetables: ['Brussels sprouts (end)', 'Cauliflower', 'Celeriac', 'Kale (end)', 'Leeks', 'Mushrooms (wild) (end)', 'Parsnips (end)', 'Potatoes (main crop) (end)', 'Purple sprouting broccoli (start)', 'Rhubarb', 'Shallots', 'Swedes (end)', 'Turnips (end)'],
        fruits: ['Apples (Bramley) (end)', 'Clementines (end)', 'Kiwi fruit', 'Lemons', 'Oranges', 'Passion fruit', 'Pears (end)', 'Pomegranates']
    },
    march: {
        meat: ['Rabbit', 'Turkey'],
        vegetables: ['Cauliflower', 'Celeriac (end)', 'Leeks (end)', 'Peppers (start)', 'Purple sprouting broccoli', 'Rhubarb', 'Shallots (end)', 'Spinach (mid-Mar)', 'Spring onions (start)'],
        fruits: ['Kiwi fruit', 'Lemons (end main)', 'Oranges (end main)', 'Passion fruit (end)', 'Pomegranates (end)']
    },
    april: {
        meat: ['Lamb (start)', 'Rabbit', 'Turkey'],
        vegetables: ['Asparagus (start)', 'Cauliflower (end)', 'Peppers', 'Purple sprouting broccoli (end)', 'Rhubarb', 'Spinach', 'Spring onions'],
        fruits: ['Apricot (start)', 'Kiwi fruit', 'Rhubarb']
    },
    may: {
        meat: ['Lamb', 'Rabbit (best Jul-Dec)'],
        vegetables: ['Asparagus', 'Aubergines (late May)', 'Carrots (late May)', 'New potatoes (start)', 'Peas (start)', 'Peppers', 'Rhubarb (end)', 'Rocket (start)', 'Spinach', 'Spring onions', 'Watercress (start)'],
        fruits: ['Apricots', 'Cherries (start)', 'Kiwi fruit']
    },
    june: {
        meat: ['Lamb', 'Rabbit (best Jul-Dec)'],
        vegetables: ['Artichokes (globe) (start)', 'Asparagus', 'Aubergines', 'Broad beans (mid-Jun)', 'Carrots', 'Courgettes (start)', 'Fennel (start)', 'New potatoes', 'Pak choi (end Jun)', 'Peas', 'Peppers', 'Rocket', 'Spinach (end main)', 'Spring onions', 'Turnips (summer)', 'Watercress'],
        fruits: ['Cherries', 'Currants', 'Gooseberries', 'Raspberries', 'Strawberries']
    },
    july: {
        meat: ['Lamb', 'Rabbit'],
        vegetables: ['Beetroot', 'Cabbage', 'Carrots', 'Courgettes and summer squash', 'Cucumbers', 'Fennel', 'French beans', 'Lettuce and other salad leaves', 'New potatoes', 'Peas and mangetout', 'Radish', 'Runner beans', 'Spinach', 'Spring onions', 'Shallots', 'Tomatoes'],
        fruits: ['Blueberries', 'Cherries', 'Currants', 'Gooseberries', 'Loganberries', 'Raspberries', 'Tayberries']
    },
    august: {
        meat: ['Lamb', 'Rabbit'],
        vegetables: ['Aubergines', 'Beetroot', 'Cabbage', 'Cauliflower', 'Carrots', 'Celery', 'Chard', 'Courgettes and summer squash', 'Cucumbers', 'Fennel', 'French beans', 'Lettuce and other salad leaves', 'Peas and mangetout', 'Peppers and chilies', 'Potatoes', 'Runner beans', 'Spring onions', 'Sweetcorn', 'Tomatoes'],
        fruits: ['Blackberries', 'Blueberries', 'Plums', 'Raspberries']
    },
    september: {
        meat: ['Lamb', 'Rabbit', 'Game (start)'],
        vegetables: ['Autumn-fruiting raspberries', 'Beetroot', 'Broccoli', 'Cabbage', 'Cauliflower', 'Carrots', 'Celery', 'Chard', 'Courgettes and summer squash', 'Cucumbers', 'Fennel', 'French beans', 'Lettuce and other salad leaves', 'Peppers and chilies', 'Potatoes', 'Runner beans', 'Spinach', 'Sweetcorn', 'Shallots', 'Onions', 'Garlic', 'Tomatoes'],
        fruits: ['Apples', 'Blackberries', 'Pears', 'Plums']
    },
    october: {
        meat: ['Lamb', 'Rabbit', 'Game'],
        vegetables: ['Autumn-fruiting raspberries', 'Beetroot', 'Broccoli', 'Cabbage', 'Carrots', 'Cauliflower', 'Celeriac', 'Celery', 'Chard', 'Chilies', 'Jerusalem artichokes', 'Kale', 'Kohl rabi', 'Leeks', 'Marrow', 'Onions and shallots', 'Pak choi', 'Parsnips', 'Potatoes (maincrop)', 'Rocket', 'Spinach', 'Swede', 'Turnip'],
        fruits: ['Apples', 'Pears', 'Quince']
    },
    november: {
        meat: ['Beef', 'Lamb', 'Pork', 'Game'],
        vegetables: ['Brussels sprouts', 'Cabbage', 'Carrots', 'Cauliflower', 'Celeriac', 'Celery', 'Chicory', 'Jerusalem artichokes', 'Kale', 'Leeks', 'Mushrooms', 'Onions', 'Parsnips', 'Potatoes', 'Swedes', 'Turnips', 'Winter squash'],
        fruits: ['Apples', 'Clementines', 'Oranges', 'Pears']
    },
    december: {
        meat: ['Beef', 'Lamb', 'Pork', 'Game'],
        vegetables: ['Brussels sprouts', 'Carrots', 'Cauliflower', 'Celeriac', 'Kale', 'Leeks', 'Parsnips', 'Potatoes', 'Swedes', 'Turnips'],
        fruits: ['Apples', 'Clementines', 'Grapefruit', 'Oranges']
    }
};

// Season to months mapping
const seasonMonths = {
    spring: ['march', 'april', 'may'],
    summer: ['june', 'july', 'august'],
    autumn: ['september', 'october', 'november'],
    winter: ['december', 'january', 'february']
};

// Month names for display
const monthNames = {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December'
};

// Year-round produce
const yearRoundProduce = {
    dairy: {
        name: 'Dairy & Eggs',
        products: ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream', 'Ice cream', 'Eggs'],
        shopLink: 'shop.html?category=Dairy & Eggs'
    },
    bread: {
        name: 'Bread & Bakery',
        products: ['Fresh bread', 'Artisan bread', 'Sourdough', 'Cakes', 'Pastries'],
        shopLink: 'shop.html?search=bread'
    },
    honey: {
        name: 'Honey & Sweeteners',
        products: ['Local honey', 'Heather honey', 'Raw honey'],
        shopLink: 'shop.html?search=honey'
    },
    flour: {
        name: 'Flour & Grains',
        products: ['Organic flour', 'Whole grains', 'Baking ingredients'],
        shopLink: 'shop.html?search=flour'
    }
};

let currentSeason = 'spring';
let currentMonth = 'march';
let allProducts = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calendar page loaded - version 1002');
    
    // Set current season and month based on actual date
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    
    // Determine current season
    if (currentMonthIndex >= 2 && currentMonthIndex <= 4) {
        currentSeason = 'spring';
    } else if (currentMonthIndex >= 5 && currentMonthIndex <= 7) {
        currentSeason = 'summer';
    } else if (currentMonthIndex >= 8 && currentMonthIndex <= 10) {
        currentSeason = 'autumn';
    } else {
        currentSeason = 'winter';
    }
    
    // Set current month within the season
    const seasonMonthsList = seasonMonths[currentSeason];
    const monthNamesList = ['january', 'february', 'march', 'april', 'may', 'june', 
                           'july', 'august', 'september', 'october', 'november', 'december'];
    currentMonth = monthNamesList[currentMonthIndex];
    
    // Update active season tab
    updateActiveSeasonTab(currentSeason);
    
    // Generate month tabs for current season
    generateMonthTabs(currentSeason);
    
    // Update active month tab
    updateActiveMonthTab(currentMonth);
    
    // Load products and setup event listeners
    loadProducts();
    setupEventListeners();
    displaySeasonalProduce(currentMonth);
});

// Load products from JSON
async function loadProducts() {
    try {
        console.log('Loading products for calendar...');
        const timestamp = new Date().getTime();
        const response = await fetch(`data/products.json?t=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        console.log('Products loaded:', allProducts.length);
        
    } catch (error) {
        console.error('Error loading products:', error);
        // Continue without products - calendar will still work
    }
}

// Setup event listeners
function setupEventListeners() {
    // Season tab event listeners
    const seasonTabs = document.querySelectorAll('.season-tab');
    seasonTabs.forEach(tab => {
        const clickHandler = function() {
            // Remove active class from all season tabs
            seasonTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const selectedSeason = this.getAttribute('data-season');
            currentSeason = selectedSeason;
            
            // Generate month tabs for selected season
            generateMonthTabs(selectedSeason);
            
            // Set current month to first month of the season
            const seasonMonthsList = seasonMonths[selectedSeason];
            if (seasonMonthsList.length > 0) {
                currentMonth = seasonMonthsList[0];
                updateActiveMonthTab(currentMonth);
                displaySeasonalProduce(currentMonth);
            }
        };
        
        tab.addEventListener('click', clickHandler);
        tab.addEventListener('touchend', function(e) {
            e.preventDefault();
            clickHandler.call(this);
        });
    });
    
    console.log('Calendar event listeners setup complete');
}

// Generate month tabs for a season
function generateMonthTabs(season) {
    const monthTabsContainer = document.getElementById('month-tabs');
    if (!monthTabsContainer) return;
    
    const seasonMonthsList = seasonMonths[season];
    const monthTabsHTML = seasonMonthsList.map(month => `
        <button class="month-tab ${month === currentMonth ? 'active' : ''}" data-month="${month}">
            ${monthNames[month]}
        </button>
    `).join('');
    
    monthTabsContainer.innerHTML = monthTabsHTML;
    
    // Add event listeners to new month tabs
    const monthTabs = monthTabsContainer.querySelectorAll('.month-tab');
    monthTabs.forEach(tab => {
        const clickHandler = function() {
            // Remove active class from all month tabs
            monthTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const selectedMonth = this.getAttribute('data-month');
            currentMonth = selectedMonth;
            displaySeasonalProduce(selectedMonth);
        };
        
        tab.addEventListener('click', clickHandler);
        tab.addEventListener('touchend', function(e) {
            e.preventDefault();
            clickHandler.call(this);
        });
    });
}

// Update active season tab
function updateActiveSeasonTab(season) {
    const seasonTabs = document.querySelectorAll('.season-tab');
    seasonTabs.forEach(tab => {
        if (tab.getAttribute('data-season') === season) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Update active month tab
function updateActiveMonthTab(month) {
    const monthTabs = document.querySelectorAll('.month-tab');
    monthTabs.forEach(tab => {
        if (tab.getAttribute('data-month') === month) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Display seasonal produce for selected month
function displaySeasonalProduce(month) {
    console.log(`Displaying seasonal produce for ${month}`);
    
    const monthData = seasonalData[month];
    if (!monthData) {
        console.error(`No data found for month: ${month}`);
        return;
    }
    
    // Display meat items - use correct category name
    displayProduceItems('meat-items', monthData.meat, 'Meat');
    
    // Display vegetable items - use correct category name
    displayProduceItems('vegetables-items', monthData.vegetables, 'Vegetables');
    
    // Display fruit items - fruits don't have their own category, so use search
    displayProduceItems('fruits-items', monthData.fruits, 'Fruits');
}

// Display produce items with shop links
function displayProduceItems(containerId, items, category) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found`);
        return;
    }
    
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="empty-produce">
                <p>No ${category.toLowerCase()} in season this month.</p>
            </div>
        `;
        return;
    }
    
    const itemsHTML = items.map(item => {
        // Clean up item name for search
        const cleanItem = item.replace(/\([^)]*\)/g, '').trim();
        
        // Find matching products in our database
        const matchingProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(cleanItem.toLowerCase()) ||
            cleanItem.toLowerCase().includes(product.name.toLowerCase())
        );
        
        // Create shop link if we have matching products
        let shopLink = '';
        if (matchingProducts.length > 0) {
            const firstProduct = matchingProducts[0];
            
            // For fruits, use search since there's no Fruits category
            if (category === 'Fruits') {
                shopLink = `
                    <a href="shop.html?search=${encodeURIComponent(cleanItem)}" 
                       class="produce-item-link" title="Shop for ${cleanItem}">
                        🛒
                    </a>
                `;
            } else {
                // For meat and vegetables, use category filter
                shopLink = `
                    <a href="shop.html?category=${encodeURIComponent(category)}&search=${encodeURIComponent(cleanItem)}" 
                       class="produce-item-link" title="Shop for ${cleanItem}">
                        🛒
                    </a>
                `;
            }
        }
        
        return `
            <div class="produce-item">
                <span class="produce-name">${item}</span>
                ${shopLink}
            </div>
        `;
    }).join('');
    
    container.innerHTML = itemsHTML;
}

// Get current month name
function getCurrentMonthName() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[new Date().getMonth()];
}

// Show loading state
function showLoading(show) {
    const containers = ['meat-items', 'vegetables-items', 'fruits-items'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            if (show) {
                container.innerHTML = `
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Loading seasonal produce...</p>
                    </div>
                `;
            }
        }
    });
}

// Show error message
function showError(message) {
    console.error('Calendar error:', message);
    
    const containers = ['meat-items', 'vegetables-items', 'fruits-items'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <p>Error: ${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">Retry</button>
                </div>
            `;
        }
    });
} 