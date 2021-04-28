import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import * as path from 'path';
import { externalsDependencies } from './getExternals';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@m78/admin': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    minify: false,
    assetsInlineLimit: 0,
    lib: {
      entry: path.resolve(__dirname, '../src/index.tsx'),
      // name: 'M78Admin',
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^@m78\/admin/, ...externalsDependencies()],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
