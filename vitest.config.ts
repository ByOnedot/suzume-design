import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { mdDemo } from './tests/vitest/md-demo';
import { stubAssets } from './tests/vitest/stub-assets';

const root = __dirname;
const alias = [
  { find: /^@suzume-design\/web-react$/, replacement: path.join(root, 'components/index.tsx') },
  { find: /^@suzume-design\/web-react\/icon$/, replacement: path.join(root, 'icon/index.es.js') },
  { find: /^@suzume-design\/web-react\/hooks$/, replacement: path.join(root, 'hooks/es/index.js') },
  { find: /^@suzume-design\/web-react\/(.*)$/, replacement: path.join(root, '$1') },
  { find: /^test-utils$/, replacement: path.join(root, 'tests/util.ts') },
];

export default defineConfig({
  plugins: [mdDemo(), stubAssets()],
  resolve: { alias },
  test: {
    name: 'client',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts', './tests/vitest-setup.ts'],
    include: ['components/**/__test__/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/visual/**', 'integration/**'],
    clearMocks: true,
    // Jest's legacy fake timers did not fake `Date`; Vitest (sinon) does by
    // default. Component ids and countdowns derive from `Date.now()`, so only
    // the timer/raf APIs are faked to keep the suites deterministic without
    // changing application-visible behaviour.
    fakeTimers: {
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
      ],
    },
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './.coverage',
      reporter: ['text-summary', 'json-summary', 'lcov', 'html'],
      include: ['components/**/*.{ts,tsx}'],
      exclude: ['components/**/style/**', 'components/**/__test__/**', 'components/locale/**'],
    },
  },
});
