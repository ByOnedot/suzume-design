import { defineConfig } from '@playwright/test';

/**
 * Deterministic visual regression setup.
 *
 * Everything that can vary between runs is pinned here:
 *  - browser build (locked by the `@playwright/test` version in the lockfile)
 *  - viewport / devicePixelRatio (one project per baseline viewport)
 *  - locale, timezone, colour scheme, reduced motion, caret, animations
 *  - fonts (the harness bundles `Inter`, the first entry of the library stack)
 *  - clock (the harness freezes `Date.now()`)
 *  - network (scenarios only use inline data-URI images)
 */
export const VIEWPORTS = [
  { name: 'mobile-375x812', width: 375, height: 812 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'desktop-1280x800', width: 1280, height: 800 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'wide-1920x1080', width: 1920, height: 1080 },
] as const;

const INTERACTION_VIEWPORT = { width: 1280, height: 800 };

export default defineConfig({
  testDir: 'tests/visual/specs',
  snapshotPathTemplate: 'tests/visual/snapshots/{projectName}/{testFileName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],

  expect: {
    toHaveScreenshot: {
      // Zero tolerance: a pixel difference must be investigated, never waived.
      maxDiffPixels: 0,
      maxDiffPixelRatio: 0,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0,
    },
  },

  use: {
    baseURL: 'http://127.0.0.1:5199',
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    locale: 'en-US',
    timezoneId: 'Asia/Singapore',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    animations: 'disabled',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: [
        // Kill every known source of rasterisation drift.
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning',
        '--disable-lcd-text',
        '--force-color-profile=srgb',
        '--disable-skia-runtime-opts',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
      ],
    },
  },

  projects: [
    ...VIEWPORTS.map((vp) => ({
      name: vp.name,
      testMatch: /layout\.spec\.ts$/,
      use: { viewport: { width: vp.width, height: vp.height } },
    })),
    {
      name: 'interactions-1280x800',
      testMatch: /interactions\.spec\.ts$/,
      use: { viewport: INTERACTION_VIEWPORT },
    },
  ],

  webServer: {
    command:
      'node ./node_modules/vite/bin/vite.js --config tests/visual/vite.config.ts --host 127.0.0.1',
    url: 'http://127.0.0.1:5199/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
