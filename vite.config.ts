import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      include: ['src/index.ts', 'src/components/*.ts', 'src/components/*.tsx']
    }),
    react(),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        globals: {
          'react': 'React',
        }
      },
    },
  },
});
