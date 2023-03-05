import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dir: 'src',
    useAtomics: true,
    reporters: ['default', 'html', 'verbose'],
    watch: false,
    alias: {
      '@app': path.resolve(__dirname, './src'),
    },
  },
});
