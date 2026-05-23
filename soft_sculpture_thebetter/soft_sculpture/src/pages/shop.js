// Shop page functionality
import { Cart, products, formatCurrency, updateCartCount } from '../utils/utils.js';

let filteredProducts = [...products];

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  setupFilterButtons();
  setupAddToCart();
  updateCartCount();
});

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => {
        btn.classList.remove('bg-pink-400', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
      });
      button.classList.add('bg-pink-400', 'text-white');
      button.classList.remove('bg-gray-200', 'text-gray-700');

      // Filter products
      const category = button.dataset.category;
      if (category === 'all') {
        filteredProducts = [...products];
      } else {
        filteredProducts = products.filter(p => p.category === category);
      }

      renderProducts(filteredProducts);
      setupAddToCart();
    });
  });
}

function renderProducts(items) {
  const grid = document.getElementById('productsGrid');
  const noProducts = document.getElementById('noProducts');

  if (items.length === 0) {
    grid.innerHTML = '';
    noProducts.classList.remove('hidden');
    return;
  }

  noProducts.classList.add('hidden');
  grid.innerHTML = items.map(product => `
    <div class="bg-white bg-opacity-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
      <!-- Product image placeholder: Replace with /assets/product-${product.id}.jpg -->
      <div class="w-full h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
        <p class="text-gray-500 text-center text-sm">
          Product Image<br>
          ${product.name}
        </p>
      </div>

      <div class="p-4">
        <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">${product.name}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>

        <div class="flex items-center justify-between mb-4">
          <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            ₱${formatCurrency(product.price)}
          </span>
          <span class="text-yellow-400">★${product.rating}</span>
        </div>

        <button class="add-to-cart-btn w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition font-semibold"
                data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

function setupAddToCart() {
  const buttons = document.querySelectorAll('.add-to-cart-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.dataset.productId);
      const cart = new Cart();
      cart.addItem(productId, 1);

      // Show feedback
      button.textContent = '✓ Added!';
      button.classList.add('bg-green-500');
      button.classList.remove('bg-gradient-to-r', 'from-pink-400', 'to-purple-400');

      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('bg-green-500');
        button.classList.add('bg-gradient-to-r', 'from-pink-400', 'to-purple-400');
      }, 1500);

      updateCartCount();
    });
  });
}
