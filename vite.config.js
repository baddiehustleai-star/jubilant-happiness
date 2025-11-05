import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite automatically loads environment variables from:
// - .env                  (all modes)
// - .env.local            (all modes, gitignored)
// - .env.[mode]           (specific mode)
// - .env.[mode].local     (specific mode, gitignored)
//
// Variables prefixed with VITE_ are exposed to the client code via import.meta.env
// Example: VITE_STRIPE_PRICE_ID is accessible as import.meta.env.VITE_STRIPE_PRICE_ID

export default defineConfig({
  plugins: [react()],
});
