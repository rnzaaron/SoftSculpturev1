// Main JavaScript file - handles cart initialization and navigation
// Import modules as needed

import { updateCartCount } from './utils.js';

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Listen for cart updates
  window.addEventListener('cartUpdated', updateCartCount);
});
