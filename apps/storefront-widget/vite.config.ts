import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SkincareWidget',
      fileName: 'widget',
      formats: ['iife'],
    },
    target: 'es2020',
    minify: 'terser',
  },
});
