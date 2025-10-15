import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import os from 'os';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use cache directory outside OneDrive to avoid permission issues
  cacheDir: path.join(os.tmpdir(), 'vite-datatable-cache'),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate a single JS and CSS file for Liferay Custom Element
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'main.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    // Additional server options to avoid OneDrive conflicts
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  define: {
    // Make global variables available
    'process.env': {},
  },
});
