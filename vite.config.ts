import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages project site needs the repo name as base path.
const base = process.env.GITHUB_PAGES === 'true' ? '/multichoice-uganda-pnl/' : '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'node',
  },
});
