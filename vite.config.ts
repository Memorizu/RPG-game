import { defineConfig } from 'vitest/config';


export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    open: true,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },

  test: {
    globals: true,
    environment: 'jsdom',

    include: [
      'tests/**/*.{test,spec}.{js,ts}',
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/js/**/*.{js,ts}'],
      exclude: ['**/*.d.ts'],
    },
  },
});