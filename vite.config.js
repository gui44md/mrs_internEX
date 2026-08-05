import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mrs_internEX/', // precisa bater com o nome exato do repo
})
