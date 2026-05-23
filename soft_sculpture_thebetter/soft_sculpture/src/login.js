// Login page functionality
import { isValidEmail, session, storage, updateCartCount } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
  updateCartCount();
});

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const submitBtn = document.getElementById('submitBtn');
  const serverError = document.getElementById('serverError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Clear previous errors
  emailError.classList.add('hidden');
  passwordError.classList.add('hidden');
  serverError.classList.add('hidden');

  // Validate email
  if (!isValidEmail(email)) {
    emailError.textContent = 'Please enter a valid email address.';
    emailError.classList.remove('hidden');
    return;
  }

  // Validate password
  if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters.';
    passwordError.classList.remove('hidden');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing in...';

  try {
    // Mock authentication - in production, call your backend API
    const users = storage.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      // Demo account
      if (email === 'demo@example.com' && password === 'demo123') {
        const demoUser = {
          id: 'demo-' + Date.now(),
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          createdAt: new Date().toISOString()
        };
        session.setUser(demoUser);
        window.location.href = 'index.html';
        return;
      }

      serverError.textContent = 'Invalid email or password. Try demo@example.com / demo123';
      serverError.classList.remove('hidden');
    } else {
      // Remove password from stored user data
      const { password: _, ...userWithoutPassword } = user;
      session.setUser(userWithoutPassword);
      window.location.href = 'index.html';
    }
  } catch (error) {
    serverError.textContent = 'An error occurred. Please try again.';
    serverError.classList.remove('hidden');
    console.error('Login error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
}
