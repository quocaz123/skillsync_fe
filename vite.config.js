import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173,
    strictPort: true,
    // Mở http://localhost:5173 — trùng origin thường khai báo trong Google Cloud (khác với 127.0.0.1)
    open: 'http://localhost:5173',
  },
})
