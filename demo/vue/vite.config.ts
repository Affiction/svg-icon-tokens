import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/vue/',
  publicDir: false,
  plugins: [vue()],
  build: {
    outDir: '../dist/vue',
    emptyOutDir: true,
  },
});
