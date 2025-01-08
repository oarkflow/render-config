import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'RenderConfig',
      formats: ['es'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@measured/puck'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@measured/puck': 'Puck'
        },
        preserveModules: true,
        preserveModulesRoot: 'src'
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
})
