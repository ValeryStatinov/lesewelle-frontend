import fs from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8')) as Record<string, unknown>;
const EXT_VERSION = packageJson.version as string;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
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
    define: {
      EXT_VERSION: mode === 'development' ? JSON.stringify(EXT_VERSION + '-dev') : JSON.stringify(EXT_VERSION),
    },
  };
});
