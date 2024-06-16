import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/__tests__/*.test.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['**/index.ts'],
    },
  },
});
