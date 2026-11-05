import { defineConfig } from 'vite';

// JSX → llamadas a h() de Náufrago (sin React, sin plugins).
export default defineConfig({
  esbuild: { jsxFactory: 'h', jsxFragment: 'Fragment' },
  server: { fs: { allow: ['../..'] } }, // permite servir el paquete enlazado con file:
});
