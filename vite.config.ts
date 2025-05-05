import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/rebazzar/', // Replace with your repository name
  plugins: [react()],
});
