// js/farm.js
import { loadProducts, loadFarms } from './data.js';
import { showMessage } from './utils.js';

async function initFarmPage() {
  const params = new URLSearchParams(window.location.search);
  const farmId = params.get('id');

  if (!farmId) {
    document.querySelector('.farm-details').innerHTML = '<p>Farm not found.</p>';
    return;
  }

  try {
    const farms = await loadFarms();
    const farm = farms.find(f => f.id === parseInt(farmId));
    if (!farm) {
      document.querySelector('.farm-details').innerHTML = '<p>Farm not found.</p>';
      return;
    }

    document.getElementById('farm-name').textContent = farm.name;
    document.getElementById('farm-image').src = farm.image;
    document.getElementById('farm-description').textContent = farm.description;

    const products = await loadProducts();
    const farmProducts = products.filter(p => p.farmName === farm.name);
    const container = document.getElementById('farm-products');
    container.innerHTML = '';

    if (farmProducts.length === 0) {
      container.innerHTML = '<p>No products from this farm.</p>';
      return;
    }

    farmProducts.forEach(product => {
      const card = `
        <div class="product-card">
          <img class="lazy" data-src="${product.image}" src="assets/images/placeholder.jpg" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>£${product.price.toFixed(2)} / ${product.unit}</p>
          <p>${product.availability}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', card);
    });

    lazyLoadImages(); // From main.js
  } catch (error) {
    showMessage('Error loading farm details.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', initFarmPage); 