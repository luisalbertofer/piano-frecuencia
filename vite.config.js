import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createHtmlPlugin } from 'vite-plugin-html';

// Obtén la versión del package.json
const version = process.env.npm_package_version || '1.0.0';
const timestamp = Date.now();
const fullVersion = `v${version}-${timestamp}`;

export default defineConfig({
  base: '/piano-frecuencia/',
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      inject: {
        data: {
          APP_VERSION: fullVersion,
        },
      },
    }),
  ],
});