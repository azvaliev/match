import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dir: 'src',
    useAtomics: true,
    reporters: ['html', 'verbose'],
    watch: false,
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    alias: {
      '@app': path.resolve(__dirname, './src'),
    },
  },
});
