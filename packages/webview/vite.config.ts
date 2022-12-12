import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'http://localhost:5173',
  server: {
    port: 5173,
    origin: 'http://localhost:5173',
  },
  build: {
    outDir: '../core/out/webview',
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]"
      }
    },
  },
});
