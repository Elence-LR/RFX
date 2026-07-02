import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 项目页地址：https://elence-lr.github.io/RFX/
const base = process.env.BASE_PATH || '/RFX/'

export default defineConfig({
  base,
  plugins: [react()],
})
