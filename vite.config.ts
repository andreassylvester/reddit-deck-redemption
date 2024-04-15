import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@svg": path.resolve(__dirname, "./svg"),
    }
  },
  plugins: [vue(), svgLoader()],
  test: {
    environment: 'happy-dom',
  }
}))
