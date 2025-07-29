// Template Loader for British Farm Co-op
// Loads shared header and footer templates into pages

/**
 * Load a template file and insert it into the DOM
 * @param {string} id - ID of the element to insert template into
 * @param {string} url - Path to the template file
 */
function loadTemplate(id, url) {
  return fetch(url)
    .then(res => res.text())
    .then(html => { 
      document.getElementById(id).innerHTML = html; 
      return html;
    })
    .catch(error => {
      console.error(`Error loading template ${url}:`, error);
    });
}

/**
 * Initialize mobile navigation functionality
 */
function initializeMobileNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  console.log('Initializing mobile navigation...');
  console.log('navToggle:', navToggle);
  console.log('navMenu:', navMenu);
  
  if (navToggle && navMenu) {
    console.log('Adding click event to nav toggle');
    
    // Remove any existing event listeners to prevent duplicates
    navToggle.removeEventListener('click', navToggle.clickHandler);
    
    // Create a new click handler
    navToggle.clickHandler = function(event) {
      event.preventDefault();
      console.log('Nav toggle clicked');
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      console.log('Menu active:', navMenu.classList.contains('active'));
    };
    
    navToggle.addEventListener('click', navToggle.clickHandler);

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('active');
      }
    });
    
    console.log('Mobile navigation initialized successfully');
  } else {
    console.error('Navigation elements not found! Will retry...');
    // Retry after a short delay
    setTimeout(() => {
      initializeMobileNavigation();
    }, 200);
  }
}

/**
 * Check admin authentication and show/hide admin link
 */
function checkAdminAuth() {
  const adminNavItem = document.getElementById('admin-nav-item');
  const currentUser = getStorageData('currentCustomer', null);
  const isAdmin = getStorageData('isAdmin', false);
  
  if (adminNavItem) {
    if (isAdmin && currentUser && currentUser.role === 'admin') {
      adminNavItem.style.display = 'block';
      console.log('Admin link shown for authenticated admin');
    } else {
      adminNavItem.style.display = 'none';
      console.log('Admin link hidden - not authenticated as admin');
    }
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load header and footer templates
  Promise.all([
    loadTemplate('site-header', 'templates/header.html'),
    loadTemplate('site-footer', 'templates/footer.html')
  ]).then(() => {
    console.log('Templates loaded successfully');
    // Initialize mobile navigation after templates are loaded
    initializeMobileNavigation();
    
    // Check admin authentication and show/hide admin link
    checkAdminAuth();
    
    // Retry initialization after a short delay to ensure DOM is fully updated
    setTimeout(() => {
      console.log('Retrying mobile navigation initialization...');
      initializeMobileNavigation();
      checkAdminAuth();
    }, 100);
  }).catch(error => {
    console.error('Error loading templates:', error);
  });
}); 