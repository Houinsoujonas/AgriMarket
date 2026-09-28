// Configuration de Vite (l'outil qui compile et sert l'application en développement/production).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // Active le support de React (JSX, Fast Refresh, etc.).
  plugins: [react()],
  resolve: {
    // Permet d'écrire des imports "@/..." au lieu de chemins relatifs comme "../../".
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
