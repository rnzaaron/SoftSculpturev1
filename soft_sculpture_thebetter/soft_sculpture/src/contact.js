// Contact page functionality
import { storage, updateCartCount } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleContactForm);
  }
  updateCartCount();
});

async function handleContactForm(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    // Validate inputs
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      throw new Error('Please fill in all fields.');
    }

    // Save message to localStorage (in production, send to backend)
    const messages = storage.get('contactMessages') || [];
    messages.push({
      id: 'msg-' + Date.now(),
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString()
    });
    storage.set('contactMessages', messages);

    // Show success message
    formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
    formStatus.className = 'p-3 rounded-lg text-sm text-green-800 bg-green-100';
    formStatus.classList.remove('hidden');

    // Clear form
    document.getElementById('contactForm').reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      formStatus.classList.add('hidden');
    }, 5000);
  } catch (error) {
    formStatus.textContent = error.message || 'An error occurred. Please try again.';
    formStatus.className = 'p-3 rounded-lg text-sm text-red-800 bg-red-100';
    formStatus.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
}
