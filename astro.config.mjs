import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  redirects: {
    '/1d-ca/':           '/snes/1d-ca/',
    '/3d-wireframe/':    '/snes/3d-wireframe/',
    '/blossom/':         '/snes/blossom/',
    '/double-pendulum/': '/snes/double-pendulum/',
    '/nbody/':           '/snes/n-body/',
    '/space-invaders/':  '/snes/space-invaders/',
    '/spigot/':          '/snes/spigot/',
    '/spirograph/':      '/snes/spirograph/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
