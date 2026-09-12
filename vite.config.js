import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // أضفنا هذا الجزء الخاص بالخادم للسماح بالاتصال من الشبكة المحلية (الهاتف)
  server: {
    host: true, 
  },
  build: {
    // إعدادات اختيارية لضمان أفضل ضغط وتقسيم للملفات عند الرفع على Netlify
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});