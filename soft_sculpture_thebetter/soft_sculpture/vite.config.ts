import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        shop: 'shop.html',
        cart: 'cart.html',
        checkout: 'checkout.html',
        login: 'login.html',
        signup: 'signup.html',
        about: 'about.html',
        contact: 'contact.html',
        terms: 'terms.html',
        shipping: 'shipping.html'
      },
      output: {
        entryFileNames: 'js/[name].js'
      }
    }
  }
});
