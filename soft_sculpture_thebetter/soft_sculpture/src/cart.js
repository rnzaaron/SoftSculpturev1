// Cart page functionality
import { Cart, products, formatCurrency } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const cart = new Cart();
  renderCartItems(cart);
  updateSummary(cart);

  // Handle checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.items.length > 0) {
        window.location.href = 'checkout.html';
      }
    });

    // Enable checkout button only if cart has items
    checkoutBtn.disabled = cart.items.length === 0;
  }

  // Listen for cart updates
  window.addEventListener('cartUpdated', () => {
    const updatedCart = new Cart();
    renderCartItems(updatedCart);
    updateSummary(updatedCart);
    checkoutBtn.disabled = updatedCart.items.length === 0;
  });
});

function renderCartItems(cart) {
  const container = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');

  if (cart.items.length === 0) {
    container.innerHTML = '';
    emptyCart.classList.remove('hidden');
    return;
  }

  emptyCart.classList.add('hidden');
  container.innerHTML = cart.items.map(item => `
    <div class="bg-white bg-opacity-70 rounded-lg p-6 flex justify-between items-center shadow-md hover:shadow-lg transition">
      <div class="flex-1">
        <h3 class="font-bold text-lg text-gray-800">${item.name}</h3>
        <p class="text-gray-600">₱${formatCurrency(item.price)}</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center border-2 border-gray-200 rounded-lg">
          <button class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                  onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <span class="px-4 py-2 font-semibold">${item.quantity}</span>
          <button class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                  onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>

        <div class="text-right min-w-24">
          <p class="font-bold text-gray-800">₱${formatCurrency(item.price * item.quantity)}</p>
        </div>

        <button class="ml-4 px-4 py-2 text-red-500 hover:bg-red-100 rounded-lg transition font-semibold"
                onclick="removeItem(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
}

function updateSummary(cart) {
  document.getElementById('subtotal').textContent = formatCurrency(cart.getTotal());
  document.getElementById('shipping').textContent = formatCurrency(cart.getShippingFee());
  document.getElementById('tax').textContent = formatCurrency(cart.getTax());
  document.getElementById('total').textContent = formatCurrency(cart.getFinal());
}

// Global functions for quantity and removal
window.updateQuantity = function(productId, quantity) {
  if (quantity < 1) return;
  const cart = new Cart();
  cart.updateQuantity(productId, quantity);
};

window.removeItem = function(productId) {
  const cart = new Cart();
  cart.removeItem(productId);
};
