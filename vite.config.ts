import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
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
    createHtmlPlugin(
      {
        minify: true,
        pages: [
          {
            entry: '@/options_vue.ts',
            filename: 'options.html',
            template: 'options/options_vue.html',
          },
        ],
      }
    ),
  ],
  build: {
    rollupOptions: {
      input: {
        //  "content-script": "@/content_script.ts",
        // "background": "@/background.ts",
        "options-vue": "@/options_vue.ts",
      },
      output: {
        dir: './build/dist',
        format: 'es',
        //  format: 'iife',
        entryFileNames: '[name]-bundle.js',
        compact: true,
      }
    },
  },
})
