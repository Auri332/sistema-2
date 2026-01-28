
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que o process.env não cause crash se acessado
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    reportCompressedSize: false
  }
});
