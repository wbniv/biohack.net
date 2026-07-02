import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // Demo pages live ONLY under /snes/<slug>/. The old apex redirect stubs
  // (/1d-ca/, /blossom/, … → /snes/…) were removed 2026-07-02 — no demo paths
  // at the apex. (Non-demo redirects like /cv, /bishop live in public/_redirects.)
  vite: {
    plugins: [tailwindcss()],
  },
});
