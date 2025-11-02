import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [tsconfigPaths()],
    build: {
      rollupOptions: {
        input: {
          background: resolve(__dirname, 'src/background/background.ts'),
        },
        output: {
          format: 'iife' as const,
          entryFileNames: '[name].js',
        },
      },
      outDir: 'dist',
      emptyOutDir: false,
    },
  };
});
