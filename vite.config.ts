// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // This sets '@' to point to the 'src' folder
    },
  },
  optimizeDeps: {
    include: ['jwt-decode'],  // Make sure the 'jwt-decode' library is bundled correctly
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4444', // Adjust this to your backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    watch: {
      usePolling: true, // Useful if you're working in environments where file watchers might not work properly
    },
  },
});

