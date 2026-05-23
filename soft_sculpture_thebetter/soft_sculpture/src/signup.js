// Sign up page functionality
import { isValidEmail, isValidPassword, session, storage, updateCartCount } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', handleSignup);
  }
  updateCartCount();
});

async function handleSignup(e) {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;

  const submitBtn = document.getElementById('submitBtn');
  const serverError = document.getElementById('serverError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmError = document.getElementById('confirmError');

  // Clear previous errors
  emailError.classList.add('hidden');
  passwordError.textContent = '';
  confirmError.classList.add('hidden');
  serverError.classList.add('hidden');

  // Validate inputs
  let hasError = false;

  if (!firstName.trim() || !lastName.trim()) {
    serverError.textContent = 'Please enter your first and last name.';
    serverError.classList.remove('hidden');
    hasError = true;
  }

  if (!isValidEmail(email)) {
    emailError.textContent = 'Please enter a valid email address.';
    emailError.classList.remove('hidden');
    hasError = true;
  }

  if (!isValidPassword(password)) {
    passwordError.textContent = 'Password must be at least 6 characters.';
    passwordError.parentElement.classList.remove('hidden');
    hasError = true;
  }

  if (password !== confirmPassword) {
    confirmError.textContent = 'Passwords do not match.';
    confirmError.classList.remove('hidden');
    hasError = true;
  }

  if (!terms) {
    serverError.textContent = 'You must agree to the Terms & Conditions.';
    serverError.classList.remove('hidden');
    hasError = true;
  }

  if (hasError) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating Account...';

  try {
    // Check if user already exists
    const users = storage.get('users') || [];
    if (users.find(u => u.email === email)) {
      emailError.textContent = 'An account with this email already exists.';
      emailError.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
      return;
    }

    // Create new user (in production, send to backend)
    const newUser = {
      id: 'user-' + Date.now(),
      firstName,
      lastName,
      email,
      password, // In production, this should be hashed server-side
      createdAt: new Date().toISOString(),
      orders: []
    };

    users.push(newUser);
    storage.set('users', users);

    // Auto-login the new user
    const { password: _, ...userWithoutPassword } = newUser;
    session.setUser(userWithoutPassword);

    // Show success and redirect
    const serverSuccess = document.getElementById('serverSuccess');
    serverSuccess.textContent = 'Account created successfully! Redirecting...';
    serverSuccess.classList.remove('hidden');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } catch (error) {
    serverError.textContent = 'An error occurred. Please try again.';
    serverError.classList.remove('hidden');
    console.error('Signup error:', error);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
}
