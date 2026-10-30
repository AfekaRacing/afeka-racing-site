import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH מוגדר רק בפריסה ל-GitHub Pages (למשל "/afeka-racing/"). ב-Vercel משאירים ריק.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
