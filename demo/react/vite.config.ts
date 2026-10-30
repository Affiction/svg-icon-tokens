import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/react/',
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: '../dist/react',
    emptyOutDir: true,
  },
});
