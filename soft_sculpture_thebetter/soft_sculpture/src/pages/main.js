// Main page JavaScript
import { updateCartCount } from '../utils/utils.js';

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Listen for cart updates
  window.addEventListener('cartUpdated', updateCartCount);
});
