import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { networkInterfaces } from 'os';

// 获取本地IP地址
function getLocalIP() {
  const nets = networkInterfaces();
  let localIP = '';
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // 跳过内部IP和非IPv4地址
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
    if (localIP) break;
  }
  
  return localIP || 'localhost';
}

const localIP = getLocalIP();
console.log(`本地IP地址：${localIP} (请使用此地址在局域网中访问)`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      overlay: false
    },
    cors: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'local.ai-qianban.app',
      '8548-44-231-117-13.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.io',
      'ngrok.io'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2015',
    minify: 'terser',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 600,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@mui/material', '@mui/icons-material']
        }
      }
    }
  },
  define: {
    'import.meta.env.VITE_LOCAL_IP': JSON.stringify(localIP)
  },
  base: './'
});