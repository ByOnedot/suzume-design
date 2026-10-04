import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { mdDemo } from './tests/vitest/md-demo';
import { stubAssets } from './tests/vitest/stub-assets';

const root = __dirname;
const alias = [
  { find: /^@byonedot\/web-react$/, replacement: path.join(root, 'components/index.tsx') },
  { find: /^@byonedot\/web-react\/icon$/, replacement: path.join(root, 'icon/index.es.js') },
  { find: /^@byonedot\/web-react\/hooks$/, replacement: path.join(root, 'hooks/es/index.js') },
  { find: /^@byonedot\/web-react\/(.*)$/, replacement: path.join(root, '$1') },
  { find: /^test-utils$/, replacement: path.join(root, 'tests/util.ts') },
];

/**
 * Demos must render without a DOM: this is the modern equivalent of the old
 * `test:node` pass, which ran every `demo.test.*` under the node environment.
 */
export default defineConfig({
  plugins: [mdDemo(), stubAssets()],
  resolve: { alias },
  test: {
    name: 'node',
    globals: true,
    environment: 'node',
    setupFiles: [],
    include: [
      'components/**/__test__/**/demo.test.{ts,tsx}',
      'packages/**/__test__/**/*.test.{js,ts}',
      'packages/**/test/**/*.test.{js,ts}',
    ],
    exclude: ['**/node_modules/**', '**/dist/**'],
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
  },
});
