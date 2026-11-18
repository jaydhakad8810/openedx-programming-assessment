import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: './',
define: {
  'process.env.NODE_ENV': JSON.stringify('production'),
},
  build: {
    lib: {
      entry: 'src/main.jsx',
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'index',
    },
  },
})
