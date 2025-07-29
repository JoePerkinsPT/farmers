// Simplified Farms JavaScript - Basic Functionality

// Global variables
let allFarms = [];
let currentFarms = []; // Store for popup access
let currentSlide = 0;
let totalSlides = 0;
let farmsPerView = 3; // Show 3 farms at once

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFarms();
    setupEventListeners();
});

// Load farms from JSON
async function loadFarms() {
    try {
        // Add cache busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch(`data/farms.json?t=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allFarms = await response.json();
        currentFarms = allFarms; // Store for popup access
        
        displayFarms(allFarms);
        
    } catch (error) {
        console.error('Error loading farms:', error);
        // Show error message
        const farmsContainer = document.querySelector('.farms-grid, #carouselTrack');
        if (farmsContainer) {
            farmsContainer.innerHTML = `
                <div class="error-message">
                    <p>Error loading farms. Please refresh the page.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Display farms in carousel
function displayFarms(farms) {
    const carouselTrack = document.querySelector('#carouselTrack');
    const carouselDots = document.querySelector('#carouselDots');
    
    if (!carouselTrack) {
        console.error('Carousel track not found');
        return;
    }
    
    // Clear the carousel
    carouselTrack.innerHTML = '';
    if (carouselDots) carouselDots.innerHTML = '';
    
    if (farms.length === 0) {
        carouselTrack.innerHTML = `
            <div class="no-farms">
                <p>No farms available at the moment.</p>
            </div>
        `;
        return;
    }
    
    // Create farm cards for carousel
    farms.forEach((farm, index) => {
        const farmCard = createFarmCard(farm);
        carouselTrack.appendChild(farmCard);
        
        // Create dot for this farm
        if (carouselDots) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('data-index', index);
            dot.setAttribute('aria-label', `Go to farm ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            carouselDots.appendChild(dot);
        }
    });
    
    // Initialize carousel functionality after a short delay to ensure cards are rendered
    setTimeout(() => {
        initializeCarousel(farms.length);
    }, 100);
}

// Create a farm card
function createFarmCard(farm) {
    const card = document.createElement('div');
    card.className = 'farm-card';
    card.setAttribute('data-farm-id', farm.id || farm.name);
    card.style.cursor = 'pointer';
    card.onclick = () => {
        window.location.href = `farm-details.html?id=${farm.id}&name=${encodeURIComponent(farm.name)}`;
    };
    
    // Truncate description for uniformity
    let shortDesc = farm.description;
    if (shortDesc.length > 100) {
        shortDesc = shortDesc.substring(0, 100) + '...';
    }
    
    // Limit to 3 specialties for uniformity
    let displaySpecialties = farm.specialties ? farm.specialties.slice(0, 3) : [];
    
    card.innerHTML = `
        <div class="farm-image">
            <img src="${farm.image}" alt="${farm.name}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Farm+Image'; this.alt='Image unavailable'">
        </div>
        <div class="farm-info">
            <h3>${farm.name}</h3>
            <p class="farm-location">${farm.location}</p>
            <p class="farm-description">${shortDesc}</p>
            <div class="farm-specialties">
                ${displaySpecialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
                ${farm.specialties && farm.specialties.length > 3 ? `<span class="specialty-tag more-tag">+${farm.specialties.length - 3} more</span>` : ''}
            </div>
            <div class="farm-actions">
                <button class="view-details-btn" onclick="window.location.href='farm-details.html?id=${farm.id}&name=${encodeURIComponent(farm.name)}'; event.stopPropagation();">View Details</button>
                <a href="shop.html?farm=${encodeURIComponent(farm.name)}" class="btn btn-primary" onclick="event.stopPropagation();">Shop This Farm</a>
            </div>
        </div>
    `;
    
    return card;
}

// Initialize carousel
function initializeCarousel(slideCount) {
    totalSlides = Math.ceil(slideCount / farmsPerView);
    currentSlide = 0;
    
    // Update farms per view based on screen size
    updateFarmsPerView();
    

    
    updateCarouselButtons();
    updateCarouselDots();
}

// Update farms per view based on screen size
function updateFarmsPerView() {
    const width = window.innerWidth;
    if (width < 768) {
        farmsPerView = 1;
    } else if (width < 1024) {
        farmsPerView = 2;
    } else {
        farmsPerView = 3;
    }
    
    // Update total slides
    const farms = document.querySelectorAll('#carouselTrack .farm-card');
    totalSlides = Math.ceil(farms.length / farmsPerView);
    
    // Reset to valid slide
    if (currentSlide >= totalSlides) {
        currentSlide = totalSlides - 1;
    }
}

// Go to specific slide
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    currentSlide = index;
    const carouselTrack = document.querySelector('#carouselTrack');
    
    if (carouselTrack) {
        const cards = carouselTrack.querySelectorAll('.farm-card');
        if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
            const slideWidth = (cardWidth * farmsPerView) + (gap * (farmsPerView - 1));
            const translateX = - (currentSlide * slideWidth);
            carouselTrack.style.transform = `translateX(${translateX}px)`;
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        }
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

// Update carousel buttons
function updateCarouselButtons() {
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
}

// Update carousel dots
function updateCarouselDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Carousel button event listeners
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Carousel dots event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('carousel-dot')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            goToSlide(index);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        carouselContainer.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateFarmsPerView();
        goToSlide(currentSlide); // Reset to current slide with new layout
    });
    

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

// Farm popup functionality

// Show farm popup - make it globally accessible
window.showFarmPopup = function(farmName) {
    const farm = currentFarms.find(f => f.name === farmName);
    if (!farm) {
        console.error('Farm not found:', farmName);
        return;
    }
    
    // Create popup HTML
    const popupHTML = `
        <div class="farm-popup-overlay" id="farm-popup-overlay">
            <div class="farm-popup">
                <div class="farm-popup-header">
                    <h2>${farm.name}</h2>
                    <button class="popup-close" onclick="closeFarmPopup()">&times;</button>
                </div>
                <div class="farm-popup-content">
                    <div class="farm-popup-image">
                        <img src="${farm.image}" alt="${farm.name}" 
                             onload="console.log('Image loaded successfully:', this.src)"
                             onerror="console.log('Image failed to load:', this.src); this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&crop=center'">
                    </div>
                    <div class="farm-popup-info">
                        <p class="farm-location">📍 ${farm.location}</p>
                        <p class="farm-description">${farm.description}</p>
                        ${farm.specialties ? `
                            <div class="farm-specialties">
                                <h4>Specialties:</h4>
                                <div class="specialties-list">
                                    ${farm.specialties.map(specialty => 
                                        `<span class="specialty">${specialty}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div class="farm-popup-actions">
                            <a href="shop.html?farm=${getFarmCode(farm.name)}" class="btn btn-primary">Shop This Farm</a>
                            <button class="btn btn-secondary" onclick="closeFarmPopup()">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add popup to page
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Add event listener to close on overlay click
    document.getElementById('farm-popup-overlay').addEventListener('click', function(e) {
        if (e.target.id === 'farm-popup-overlay') {
            closeFarmPopup();
        }
    });
    
    // Add escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeFarmPopup();
        }
    });
}

// Close farm popup - make it globally accessible
window.closeFarmPopup = function() {
    const popup = document.getElementById('farm-popup-overlay');
    if (popup) {
        popup.remove();
    }
}

// Show feature popup - make it globally accessible
window.showFeaturePopup = function(featureName, farmName) {
    const farm = currentFarms.find(f => f.name === farmName);
    if (!farm) {
        console.error('Farm not found:', farmName);
        return;
    }
    
    // Create popup HTML with feature context
    const popupHTML = `
        <div class="farm-popup-overlay" id="farm-popup-overlay">
            <div class="farm-popup">
                <div class="farm-popup-header">
                    <h2>${featureName} - ${farm.name}</h2>
                    <button class="popup-close" onclick="closeFarmPopup()">&times;</button>
                </div>
                <div class="farm-popup-content">
                    <div class="farm-popup-image">
                        <img src="${farm.image}" alt="${farm.name}" 
                             onload="console.log('Image loaded successfully:', this.src)"
                             onerror="console.log('Image failed to load:', this.src); this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&crop=center'">
                    </div>
                    <div class="farm-popup-info">
                        <p class="farm-location">📍 ${farm.location}</p>
                        <p class="farm-description">${farm.description}</p>
                        ${farm.specialties ? `
                            <div class="farm-specialties">
                                <h4>Specialties:</h4>
                                <div class="specialties-list">
                                    ${farm.specialties.map(specialty => 
                                        `<span class="specialty">${specialty}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div class="farm-popup-actions">
                            <a href="shop.html?farm=${getFarmCode(farm.name)}" class="btn btn-primary">Shop This Farm</a>
                            <button class="btn btn-secondary" onclick="closeFarmPopup()">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add popup to page
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Add event listener to close on overlay click
    document.getElementById('farm-popup-overlay').addEventListener('click', function(e) {
        if (e.target.id === 'farm-popup-overlay') {
            closeFarmPopup();
        }
    });
    
    // Add escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeFarmPopup();
        }
    });
}