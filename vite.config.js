import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable code splitting and optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunk for better caching
          vendor: ['react', 'react-dom'],
          // Separate chunk for external services that are actually used
          external: ['@vercel/analytics'],
        },
      },
    },
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Generate source maps for debugging in production
    sourcemap: true,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  // Performance optimizations
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false, // Disable error overlay for better DX
      port: 5173,
    },
  },
});
