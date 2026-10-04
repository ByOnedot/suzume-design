import { defineConfig } from 'vite';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');

export default defineConfig({
  root: __dirname,
  plugins: [],
  resolve: {
    alias: [
      { find: /^@byonedot\/web-react$/, replacement: path.join(root, 'es/index.js') },
      { find: /^@byonedot\/web-react\/icon$/, replacement: path.join(root, 'icon/index.es.js') },
      { find: /^@byonedot\/web-react\/hooks$/, replacement: path.join(root, 'hooks/es/index.js') },
      { find: /^@byonedot\/web-react\/(.*)$/, replacement: path.join(root, '$1') },
      { find: /^test-utils$/, replacement: path.join(root, 'tests/util.ts') },
      { find: /^react$/, replacement: path.join(root, 'node_modules/react') },
      {
        find: /^react-dom\/client$/,
        replacement: path.join(root, 'node_modules/react-dom/client'),
      },
      { find: /^react-dom$/, replacement: path.join(root, 'node_modules/react-dom') },
      {
        find: /^react\/jsx-runtime$/,
        replacement: path.join(root, 'node_modules/react/jsx-runtime'),
      },
    ],
  },
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  server: { port: 5199, strictPort: true, fs: { allow: [root] } },
  preview: { port: 5199, strictPort: true },
  build: { outDir: path.join(__dirname, 'dist'), emptyOutDir: true },
  css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
});
