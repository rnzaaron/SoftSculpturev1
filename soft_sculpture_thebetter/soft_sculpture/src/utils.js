// Utility functions for the entire application

// Product database (mock - in production, fetch from server)
export const products = [
  {
    id: 1,
    name: "Pink Fuzzy Flower Bouquet",
    price: 299,
    category: "flowers",
    description: "Beautiful pastel pink fuzzy wire flowers",
    rating: 5
  },
  {
    id: 2,
    name: "Rainbow Keychain Set",
    price: 149,
    category: "keychains",
    description: "Colorful fuzzy wire keychains",
    rating: 5
  },
  {
    id: 3,
    name: "Cute Character Charm",
    price: 99,
    category: "charms",
    description: "Adorable pastel character charms",
    rating: 5
  },
  {
    id: 4,
    name: "Pastel Flower Wall Decoration",
    price: 399,
    category: "decorations",
    description: "Large fuzzy wire flower for room decoration",
    rating: 5
  },
  {
    id: 5,
    name: "Mini Succulent Plant",
    price: 179,
    category: "flowers",
    description: "Cute fuzzy wire succulent plant",
    rating: 5
  },
  {
    id: 6,
    name: "Phone Charm Trio",
    price: 249,
    category: "charms",
    description: "Three cute phone hanging charms",
    rating: 5
  },
  {
    id: 7,
    name: "Butterfly Decoration Set",
    price: 349,
    category: "decorations",
    description: "Set of pastel butterfly decorations",
    rating: 5
  },
  {
    id: 8,
    name: "Heart Shaped Keychain",
    price: 129,
    category: "keychains",
    description: "Pink heart-shaped fuzzy wire keychain",
    rating: 5
  }
];

// Cart Management Class
export class Cart {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.notifyUpdate();
  }

  addItem(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity
      });
    }

    this.saveCart();
    return true;
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getShippingFee() {
    const total = this.getTotal();
    if (total === 0) return 0;
    if (total < 500) return 75;
    if (total < 1000) return 100;
    return 150;
  }

  getTax() {
    return this.getTotal() * 0.12;
  }

  getFinal() {
    return this.getTotal() + this.getShippingFee() + this.getTax();
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  notifyUpdate() {
    window.dispatchEvent(new Event('cartUpdated'));
  }
}

// Update cart count in navigation
export function updateCartCount() {
  const cart = new Cart();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartCounts = document.querySelectorAll('#cartCount');
  cartCounts.forEach(el => {
    el.textContent = totalItems;
  });
}

// Format currency
export function formatCurrency(amount) {
  return amount.toFixed(2);
}

// Validate email
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate password
export function isValidPassword(password) {
  return password.length >= 6;
}

// API endpoint (mock - adjust to your backend)
export const API_URL = '/api';

// Fetch with error handling
export async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Generate order ID
export function generateOrderId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Local storage helpers
export const storage = {
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear()
};

// User session
export const session = {
  setUser: (user) => storage.set('user', user),
  getUser: () => storage.get('user'),
  clearUser: () => storage.remove('user'),
  isLoggedIn: () => !!storage.get('user')
};
