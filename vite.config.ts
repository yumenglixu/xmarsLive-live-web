import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { dependencies, peerDependencies } from './package.json';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      external: [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
      ],
      input: ['src/index.ts'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          dir: 'es',
          globals: {
            vue: 'Vue',
            pinia: 'pinia',
          },
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          dir: 'lib',
          globals: {
            vue: 'Vue',
            pinia: 'pinia',
          },
        },
      ],
    },
    lib: {
      entry: './src/index.ts',
      name: 'TUILiveKit',
    },
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({
      entryRoot: './src',
      outDir: ['lib/', 'es/'],
    }),
  ],
});
