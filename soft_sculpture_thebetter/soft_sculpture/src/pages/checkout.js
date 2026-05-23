// Checkout page functionality
import { Cart, formatCurrency, generateOrderId, updateCartCount, session, storage } from '../utils/utils.js';

let cart;

document.addEventListener('DOMContentLoaded', () => {
  cart = new Cart();

  // Check if cart has items
  if (cart.items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderOrderSummary();
  setupFormValidation();
  updateCartCount();

  const submitBtn = document.getElementById('submitOrderBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitOrder);
  }
});

function renderOrderSummary() {
  const orderSummary = document.getElementById('orderSummary');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryTax = document.getElementById('summaryTax');
  const summaryTotal = document.getElementById('summaryTotal');

  orderSummary.innerHTML = cart.items.map(item => `
    <div class="flex justify-between text-gray-700">
      <span>${item.name} x${item.quantity}</span>
      <span>₱${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');

  summarySubtotal.textContent = formatCurrency(cart.getTotal());
  summaryShipping.textContent = formatCurrency(cart.getShippingFee());
  summaryTax.textContent = formatCurrency(cart.getTax());
  summaryTotal.textContent = formatCurrency(cart.getFinal());
}

function setupFormValidation() {
  const form = document.getElementById('checkoutForm');

  // Populate with user data if logged in
  const user = session.getUser();
  if (user) {
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
  }

  // Form validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });
}

function validateForm() {
  const form = document.getElementById('checkoutForm');
  const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];
  let isValid = true;

  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.classList.add('border-red-500');
      isValid = false;
    } else {
      field.classList.remove('border-red-500');
    }
  });

  // Validate email
  const email = document.getElementById('email').value;
  if (email && !isValidEmail(email)) {
    document.getElementById('email').classList.add('border-red-500');
    isValid = false;
  }

  return isValid;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function submitOrder(e) {
  e.preventDefault();

  if (!validateForm()) {
    alert('Please fill in all required fields correctly.');
    return;
  }

  const submitBtn = document.getElementById('submitOrderBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';

  // Collect form data
  const orderData = {
    orderId: generateOrderId(),
    items: cart.items,
    customer: {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      province: document.getElementById('province').value,
      postalCode: document.getElementById('postalCode').value
    },
    paymentMethod: 'cod',
    notes: document.getElementById('notes').value,
    subtotal: cart.getTotal(),
    shipping: cart.getShippingFee(),
    tax: cart.getTax(),
    total: cart.getFinal(),
    orderDate: new Date().toISOString(),
    status: 'pending'
  };

  // Save order to localStorage (in production, send to backend)
  const orders = storage.get('orders') || [];
  orders.push(orderData);
  storage.set('orders', orders);

  // Save to user if logged in
  const user = session.getUser();
  if (user) {
    user.orders = user.orders || [];
    user.orders.push(orderData.orderId);
    session.setUser(user);
  }

  // Clear cart
  cart.clear();

  // Show success modal
  showSuccessModal(orderData.orderId);

  submitBtn.disabled = false;
  submitBtn.textContent = 'Place Order';
}

function showSuccessModal(orderId) {
  const modal = document.getElementById('successModal');
  document.getElementById('orderId').textContent = orderId;
  modal.classList.remove('hidden');

  // Auto redirect after 5 seconds
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 5000);
}
