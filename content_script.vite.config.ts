import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'

// https://vitejs.dev/config/
export default defineConfig({
  root: '../',
  base: '',
  plugins: [
    vue(),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        }
      ]
    }),
  ],
  build: {
    rollupOptions: {
      input: {
         "content-script": "@/content_script.ts",
      },
      output: {
        dir: './build/dist',
         format: 'iife',
        entryFileNames: '[name]-bundle.js',
        compact: true,
      }
    },
    emptyOutDir: false,
  },
})
