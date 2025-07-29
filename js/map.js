// OpenStreetMap Integration with Leaflet.js for Fresh Farm Co-op


let map;
let markers = [];
let currentPopup = null;
let farmLocations = [];
let userMarker = null; // Track user location marker

// Farm coordinates mapping for all 58 real farms
const farmCoordinates = {
    // England
    "Diddly Squat Farm Shop": [51.8500, -1.3500], // Chipping Norton, Oxfordshire
    "Daylesford Organic": [51.9288, -1.6423], // Daylesford, Gloucestershire
    "Chatsworth Estate Farm Shop": [53.2276, -1.6116], // Pilsley, Derbyshire
    "Cowdray Farm Shop": [50.9948, -0.7313], // Midhurst, West Sussex
    "Doddington Hall Farm Shop": [53.2187, -0.6522], // Doddington, Lincolnshire
    "Battlefield 1403": [52.7475, -2.7185], // Shrewsbury, Shropshire
    "Alder Carr Farm Shop": [52.1500, 1.1000], // Creeting St. Mary, Suffolk
    "Kimbers Farm Shop": [51.0500, -2.4000], // Charlton Musgrove, Somerset
    "Apley Farm Shop": [52.5500, -2.4000], // Bridgnorth, Shropshire
    "Arrow Farm Shop": [53.3000, -1.2000], // Worksop, Nottinghamshire
    "Ashlyns Farm Shop": [51.7000, 0.2000], // North Weald, Essex
    "Downland Produce": [51.2000, -1.8000], // Wiltshire
    "Dews Meadow Farm Shop": [51.6000, -1.4000], // East Hanney, Oxfordshire
    "Aunt Fanny's Farm Shop & Cafe": [51.0000, -2.3000], // Gillingham, Dorset
    "Barr Farm": [54.0000, -1.5000], // North Yorkshire

    // Wales
    "Murton Farm Shop": [51.6000, -4.1200], // Swansea, Wales
    "Gower Salt Marsh Lamb": [51.6000, -4.1000], // Swansea, Wales
    "Forage Farm Shop": [51.4600, -3.4500], // Cowbridge, Vale of Glamorgan
    "Rhug Estate": [52.9817, -3.4119], // Corwen, Denbighshire
    "Hawarden Estate Farm Shop": [53.2000, -3.0000], // Flintshire
    "Beacons Farm Shop": [51.9000, -3.4000], // Brecon, Powys
    "Gate 2 Plate Farm Shop": [51.8000, -5.0000], // Haverfordwest
    "Lewis's Farm Shop": [53.0000, -3.0000], // Eyton, Wrexham
    "Square Farm Shop": [51.8000, -2.7000], // Monmouth, Gwent
    "Slade Farm Organics": [51.5000, -3.6000], // St Brides Major, Vale of Glamorgan

    // Scotland
    "Rothiemurchus Estate Farm Shop": [57.1500, -3.8000], // Aviemore, Highlands
    "Connage Highland Dairy": [57.6000, -4.0000], // Ardersier
    "The Ethical Dairy": [54.9000, -4.2000], // Gatehouse of Fleet
    "Craigie's Farm Deli & Cafe": [55.9900, -3.4000], // South Queensferry
    "Hardiesmill": [55.7000, -2.5000], // Gordon
    "Peel Farm": [56.6000, -3.0000], // Kirriemuir
    "Galloway Farmhouse Cheese": [54.8000, -4.5000], // Sorbie
    "Carmichael Venison & Farmhouse Kitchen": [55.6000, -3.5000], // Biggar
    "Loch Arthur Creamery, Farm Shop and Cafe": [55.0000, -3.8000], // Beeswing
    "Isle of Mull Cheese": [56.4000, -6.0000], // Isle of Mull
    "Ardross Farm": [56.2000, -2.8000], // Elie, Fife
    "Craigies Deli & Farm Shop": [55.9900, -3.4000], // Queensferry, Edinburgh
    "Balgove Larder": [56.3000, -2.8000], // St Andrews, Fife
    "Grow Wild": [56.0000, -3.6000], // Linlithgow
    "The Heron Farm Shop": [55.7000, -4.1000], // Strathaven, South Lanarkshire
    "Bowhouse": [56.2000, -2.7000], // St Monans, Fife
    "Loch Leven's Larder": [56.2000, -3.4000], // Kinross
    "Blair Drummond Smiddy Farm Shop": [56.2000, -4.0000], // Stirling
    "Barra Berries": [57.3000, -2.3000], // Oldmeldrum, Inverurie
    "Balgone Estate": [56.0000, -2.6000], // East Lothian
    "Westerton Farmers": [56.8000, -2.5000], // Laurencekirk, Aberdeenshire
    "Glenforsa": [56.4000, -5.8000], // Isle of Mull
    "Wilson's Farm & Kitchen": [55.6000, -2.4000], // Kelso, Scottish Borders
    "Long Island Retreats and Larder": [57.2000, -7.3000], // South Uist
    "Solsgirth Home Farm": [56.2000, -3.8000], // Stirlingshire
    "Balmakewan Farm Shop & Tea Room": [57.0000, -2.5000], // Aberdeenshire
    "Barnhill Farmshop": [55.9000, -4.3000], // Glasgow

    // Northern Ireland
    "Broughgammon Farm": [55.2000, -6.2000], // Ballycastle, County Antrim
    "Hillstown Farm Shop": [54.9000, -6.3000], // Ahoghill, County Antrim
    "Millbank Farm Shop": [54.5000, -5.7000], // Killinchy, County Down
    "McKee's Country Store, Farm Shop & Restaurant": [54.6000, -5.6000], // Newtownards, County Down
    "Ballykenver Farm Shop and Kitchen": [55.1000, -6.3000], // Armoy, County Antrim

    // New farms
    "Darts Farm": [50.685, -3.449], // Topsham, Devon
    "Castle Farm": [51.333, 0.183], // Shoreham, Kent
    "Garson Farm": [51.348, -0.383], // Esher, Surrey
    "Millet's Farm Centre": [51.700, -1.400], // Frilford, Abingdon
    "River Cottage Kitchen and Store": [50.750, -2.983], // Axminster, Devon
    "Strawberry Fields": [50.643, -4.283], // Lifton, Devon
    "Farmer Copleys": [53.700, -1.333], // Pontefract, West Yorkshire
    "Brunswick Organic Nursery Shop": [53.920, -1.090], // Bishopthorpe, York
    "Fordhall Farm Shop": [52.883, -2.417], // Market Drayton, Shropshire
    "Marshall’s Farm Shop": [57.233, -2.350], // Kintore, Aberdeenshire
    "Gloagburn Farm Shop": [56.435, -3.517] // Perthshire
};

// Load farms from JSON file with enhanced error handling
async function loadFarmLocations() {
    try {
        // Add cache busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch(`data/farms.json?t=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const farms = await response.json();
        
        // Convert JSON farms to map format with coordinates
        farmLocations = farms.map(farm => {
            const coordinates = farmCoordinates[farm.name];
            if (!coordinates) {
                console.warn(`No coordinates found for farm: ${farm.name}`);
                return null;
            }
            
            const farmData = {
                id: farm.id,
                name: farm.name,
                position: coordinates,
                products: farm.specialties || [],
                categories: extractCategories(farm.specialties || []),
                description: farm.description,
                contact: "Contact farm directly", // Placeholder
                address: farm.location,
                image: farm.image
            };
            
            return farmData;
        }).filter(farm => farm !== null);
        return farmLocations;
        
    } catch (error) {
        console.error('Error loading farm locations:', error);
        // Show user-friendly error message
        showErrorMessage('Unable to load farm data. Please refresh the page and try again.');
        return [];
    }
}

// Show error message to user
function showErrorMessage(message) {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'map-error-message';
        errorDiv.innerHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 5px; margin: 10px; text-align: center;">
                <strong>⚠️ Error:</strong> ${message}
            </div>
        `;
        mapContainer.appendChild(errorDiv);
    }
}

// Extract categories from specialties with enhanced logic
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

// Initialize the map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for template loader to complete and then initialize map
    setTimeout(initMap, 1000);
});

// Initialize the map with enhanced error handling
async function initMap() {
    // Check if map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found!');
        showErrorMessage('Map element not found. Please check the page structure.');
        return;
    }
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet not loaded!');
        showErrorMessage('Map library not loaded. Please check your internet connection and refresh the page.');
        return;
    }
    
    try {
        // Load farm locations from JSON
        await loadFarmLocations();
        
        if (farmLocations.length === 0) {
            showErrorMessage('No farm data available. Please try refreshing the page.');
            return;
        }
        
        // Create map centered on UK (London area)
        map = L.map('map').setView([52.3555, -1.1743], 6);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        // Add farm markers
        addFarmMarkers();

        // Initialize map controls
        initializeMapControls();
        
    } catch (error) {
        console.error('Error initializing map:', error);
        showErrorMessage('Failed to initialize map. Please refresh the page and try again.');
    }
}

// Add farm markers to the map with enhanced popup handling
function addFarmMarkers() {
    if (!farmLocations || farmLocations.length === 0) {
        console.error('No farm locations available!');
        return;
    }
    
    farmLocations.forEach((farm, index) => {
        
        if (!farm.position || !Array.isArray(farm.position) || farm.position.length !== 2) {
            console.error(`Invalid position for farm ${farm.name}:`, farm.position);
            return;
        }
        
        // Create custom icon for farm markers
        const farmIcon = L.divIcon({
            className: 'farm-marker',
            html: '<div style="background-color: #1A3C34; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🌾</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker(farm.position, { icon: farmIcon })
            .addTo(map)
            .bindPopup(createPopupContent(farm), {
                maxWidth: 350,
                className: 'farm-popup'
            });

        // Add click listener to marker with enhanced popup management
        marker.on('click', () => {
            if (currentPopup && currentPopup !== marker) {
                currentPopup.closePopup();
            }
            currentPopup = marker;
        });

        markers.push(marker);
    });
}

// Create enhanced popup content for farm
function createPopupContent(farm) {
    const productsHtml = farm.products.map(product => 
        `<span class="product-tag" style="display: inline-block; background: #e8f5e8; color: #2e7d32; padding: 2px 8px; margin: 2px; border-radius: 12px; font-size: 0.8em;">${product}</span>`
    ).join('');

    const categoriesHtml = farm.categories.map(category => 
        `<span class="category-tag" style="display: inline-block; background: #fff3e0; color: #f57c00; padding: 2px 8px; margin: 2px; border-radius: 12px; font-size: 0.8em;">${category}</span>`
    ).join('');

    const popupContent = `
        <div class="farm-info-window" style="font-family: Arial, sans-serif;">
            <div class="farm-info-content">
                <div class="farm-info-header" style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span class="farm-icon" style="font-size: 24px; margin-right: 10px;">🌾</span>
                    <h4 class="farm-name" style="margin: 0; color: #1A3C34;">${farm.name}</h4>
                </div>
                <p style="margin: 0.5rem 0; color: #666; font-size: 0.9em; line-height: 1.4;">${farm.description}</p>
                <p style="margin: 0.5rem 0; font-size: 0.85rem; color: #888;">
                    <strong>📍 Address:</strong> ${farm.address}
                </p>
                <div class="farm-categories" style="margin: 0.5rem 0;">
                    <strong style="color: #1A3C34;">Categories:</strong><br>
                    ${categoriesHtml}
                </div>
                <div class="farm-products" style="margin: 0.5rem 0;">
                    <strong style="color: #1A3C34;">Available Products:</strong><br>
                    ${productsHtml}
                </div>
                <div style="margin-top: 15px; text-align: center;">
                    <button onclick="viewFarmDetails(${farm.id}, '${farm.name}')" 
                            style="background: #1A3C34; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9em; transition: background 0.3s;">
                        🏪 View Farm Details
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return popupContent;
}

// Initialize map controls with enhanced functionality
function initializeMapControls() {
    const categoryFilter = document.getElementById('map-category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMapMarkers);
    }
    
    // Add location finder button with enhanced functionality
    const findNearMeBtn = document.getElementById('find-near-me');
    if (findNearMeBtn) {
        findNearMeBtn.addEventListener('click', handleFindNearMe);
    }

    // Add search functionality
    const searchInput = document.getElementById('farm-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchFarms(e.target.value);
        });
    }
}

// Enhanced filter map markers by category
function filterMapMarkers() {
    const selectedCategory = document.getElementById('map-category-filter').value;
    
    markers.forEach((marker, index) => {
        const farm = farmLocations[index];
        const hasCategory = selectedCategory === 'all' || farm.categories.includes(selectedCategory);
        
        if (hasCategory) {
            marker.addTo(map);
        } else {
            marker.removeFrom(map);
        }
    });

    // Show/hide no results message
    const visibleMarkers = markers.filter(marker => map.hasLayer(marker));
    showNoResultsMessage(visibleMarkers.length === 0 && selectedCategory !== 'all');
}

// Show no results message
function showNoResultsMessage(show) {
    let noResultsDiv = document.getElementById('no-results-message');
    
    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'no-results-message';
        noResultsDiv.innerHTML = `
            <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 10px; text-align: center;">
                <strong>🔍 No farms found</strong><br>
                Try selecting a different category or search term.
            </div>
        `;
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.appendChild(noResultsDiv);
        }
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

// Enhanced get user's location and center map
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = [position.coords.latitude, position.coords.longitude];
                
                map.setView(userLocation, 12);
                
                // Remove existing user marker if any
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                // Add user location marker
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background-color: #2196F3; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                userMarker = L.marker(userLocation, { icon: userIcon })
                    .addTo(map)
                    .bindPopup('<strong>Your Location</strong>')
                    .openPopup();
            },
            (error) => {
                showErrorMessage('Unable to find your location. Please check your browser settings and try again.');
            }
        );
    } else {
        showErrorMessage('Geolocation is not supported by your browser.');
    }
}

// Enhanced search for farms by name or product
function searchFarms(query) {
    if (!query.trim()) {
        // Show all markers if search is empty
        markers.forEach(marker => marker.addTo(map));
        showNoResultsMessage(false);
        return;
    }

    const filteredFarms = farmLocations.filter(farm => 
        farm.name.toLowerCase().includes(query.toLowerCase()) ||
        farm.products.some(product => 
            product.toLowerCase().includes(query.toLowerCase())
        ) ||
        farm.description.toLowerCase().includes(query.toLowerCase())
    );
    
    // Clear existing markers
    markers.forEach(marker => marker.removeFrom(map));
    
    // Add filtered markers
    filteredFarms.forEach(farm => {
        const marker = markers.find(m => {
            const popupContent = m.getPopup().getContent();
            return popupContent.includes(farm.name);
        });
        if (marker) {
            marker.addTo(map);
        }
    });

    // Show no results message if needed
    showNoResultsMessage(filteredFarms.length === 0);
}

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Find nearest farms to user location
function findNearestFarms(userLat, userLon, limit = 5) {
    const farmsWithDistance = farmLocations.map(farm => ({
        ...farm,
        distance: calculateDistance(userLat, userLon, farm.position[0], farm.position[1])
    }));
    
    return farmsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
}

// Enhanced handle "Find Farms Near Me" button click
function handleFindNearMe() {
    const button = document.getElementById('find-near-me');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span>⏳</span> Finding location...';
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                
                // Center map on user location
                map.setView([userLat, userLon], 10);
                
                // Remove existing user marker if any
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                // Add user location marker
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background-color: #2196F3; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                userMarker = L.marker([userLat, userLon], { icon: userIcon })
                    .addTo(map)
                    .bindPopup('<strong>Your Location</strong>')
                    .openPopup();
                
                // Find and highlight nearest farms
                const nearestFarms = findNearestFarms(userLat, userLon, 5);
                // Ensure all markers are visible after geolocation
                markers.forEach((marker, index) => {
                    if (!map.hasLayer(marker)) {
                        marker.addTo(map);
                    }
                });
                
                // Show nearest farms info
                showNearestFarmsInfo(nearestFarms);
                
                // Reset button
                if (button) {
                    button.disabled = false;
                    button.innerHTML = '<span>📍</span> Find Farms Near Me';
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to find your location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'Please check your browser settings and try again.';
                }
                showErrorMessage(errorMessage);
                
                // Reset button
                if (button) {
                    button.disabled = false;
                    button.innerHTML = '<span>📍</span> Find Farms Near Me';
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        showErrorMessage('Geolocation is not supported by your browser.');
        if (button) {
            button.disabled = false;
            button.innerHTML = '<span>📍</span> Find Farms Near Me';
        }
    }
}

// Enhanced show nearest farms information with better UI
function showNearestFarmsInfo(nearestFarms) {
    // Remove existing info panel if it exists
    const existingPanel = document.getElementById('nearest-farms-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Create enhanced info panel
    const panel = document.createElement('div');
    panel.id = 'nearest-farms-panel';
    panel.className = 'nearest-farms-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        max-height: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        overflow: hidden;
        font-family: Arial, sans-serif;
    `;
    
    panel.innerHTML = `
        <div class="panel-header" style="background: #1A3C34; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
            <h4 style="margin: 0; font-size: 16px;">🌾 Nearest Farms to You</h4>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0;">×</button>
        </div>
        <div class="panel-content" style="max-height: 350px; overflow-y: auto; padding: 0;">
            ${nearestFarms.map((farm, index) => `
                <div class="nearest-farm-item" style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="focusOnFarm('${farm.name}')">
                    <div style="display: flex; align-items: flex-start;">
                        <div class="farm-rank" style="background: #1A3C34; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${index + 1}</div>
                        <div class="farm-details" style="flex: 1;">
                            <h5 style="margin: 0 0 5px 0; color: #1A3C34; font-size: 14px;">${farm.name}</h5>
                            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">📍 ${farm.distance.toFixed(1)} km away</p>
                            <p class="farm-description" style="margin: 0 0 5px 0; color: #888; font-size: 11px; line-height: 1.3;">${farm.description.substring(0, 100)}${farm.description.length > 100 ? '...' : ''}</p>
                            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                ${farm.categories.slice(0, 3).map(category => 
                                    `<span style="background: #e8f5e8; color: #2e7d32; padding: 2px 6px; border-radius: 10px; font-size: 10px;">${category}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add panel to body so it floats over everything
    document.body.appendChild(panel);
}

// Function to focus on a specific farm
function focusOnFarm(farmName) {
    const farm = farmLocations.find(f => f.name === farmName);
    if (farm) {
        map.setView(farm.position, 14);
        const marker = markers.find(m => {
            const popupContent = m.getPopup().getContent();
            return popupContent.includes(farmName);
        });
        if (marker) {
            marker.openPopup();
        }
    }
}

// Function to view farm details page
function viewFarmDetails(farmId, farmName) {
    // Create farm details URL with farm ID and name
    const farmDetailsUrl = `farm-details.html?id=${farmId}&name=${encodeURIComponent(farmName)}`;
    
    // Navigate to farm details page
    window.location.href = farmDetailsUrl;
}

// Export functions for use in other modules
window.farmMap = {
    initMap,
    getUserLocation,
    searchFarms,
    findNearestFarms,
    filterMapMarkers,
    focusOnFarm,
    viewFarmDetails
};

// Make viewFarmDetails globally available
window.viewFarmDetails = viewFarmDetails; 