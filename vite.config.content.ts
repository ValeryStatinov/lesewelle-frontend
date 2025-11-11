import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8')) as Record<string, unknown>;
const EXT_VERSION = packageJson.version as string;

const manifestPlugin = (mode: string) => {
  return {
    name: 'manifest-plugin',
    writeBundle() {
      const manifestPath = resolve(__dirname, 'public/manifest.json');
      const outManifestPath = resolve(__dirname, 'dist/manifest.json');
      const env = loadEnv(mode, process.cwd(), 'VITE_');

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as Record<string, unknown>;

      const apiUrl = env.VITE_BACKEND_API_URL;
      if (!apiUrl) {
        console.error('env variable VITE_BACKEND_API_URL is not set');
        process.exit(1);
      }

      manifest.host_permissions = [`${apiUrl}/*`];

      fs.writeFileSync(outManifestPath, JSON.stringify(manifest, null, 2));
      console.log(`✓ Generated manifest.json with host_permissions from env`);
    },
  };
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [tailwindcss(), react(), tsconfigPaths(), svgr(), manifestPlugin(mode)],
    build: {
      rollupOptions: {
        input: {
          content: resolve(__dirname, 'src/content/content.tsx'),
        },
        output: {
          format: 'iife',
          entryFileNames: '[name].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      outDir: 'dist',
      emptyOutDir: false,
    },
    define: {
      EXT_VERSION: JSON.stringify(EXT_VERSION),
    },
  };
});
