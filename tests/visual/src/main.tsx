import { StrictMode } from 'react';

// Deterministic fonts. The library's font stack starts with `Inter`; bundling
// it here guarantees that the first entry resolves identically on every
// platform, so screenshots are reproducible.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@suzume-design/web-react/dist/css/suzume.css';
import './harness.css';

import { App } from './app';
import { mountRoot } from './mount';
import { freezeClock } from './clock';

// Freeze "now" so date-driven components render identically on every run.
freezeClock('2026-04-15T10:30:00+08:00');

// The harness reports problems instead of silencing them; the visual spec
// asserts that the list stays empty.
const problems: string[] = [];
(globalThis as unknown as { __SUZUME_CONSOLE__: string[] }).__SUZUME_CONSOLE__ = problems;

const record = (level: string, args: unknown[]) => {
  const text = args
    .map((a) => {
      if (typeof a === 'string') return a;
      if (a instanceof Error) return `${a.name}: ${a.message}`;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(' ');
  problems.push(`${level}: ${text}`);
};

const originalError = console.error.bind(console);
const originalWarn = console.warn.bind(console);
console.error = (...args: unknown[]) => {
  record('error', args);
  originalError(...(args as []));
};
console.warn = (...args: unknown[]) => {
  record('warn', args);
  originalWarn(...(args as []));
};

window.addEventListener('error', (e) => record('window.error', [e.message]));
window.addEventListener('unhandledrejection', (e) =>
  record('unhandledrejection', [String(e.reason)])
);

const container = document.getElementById('root')!;

/**
 * Mount only after every family used by the library stack is available.
 *
 * Components such as `Typography` measure text during their first layout to
 * compute ellipsis. Measuring against the fallback font and repainting with
 * `Inter` afterwards moves the truncation point, which is exactly the kind of
 * nondeterminism this harness has to eliminate.
 */
const FONT_WAIT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([
    promise,
    new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms)),
  ]);
}

async function loadFonts() {
  try {
    const faces = ['400 14px Inter', '500 14px Inter', '600 14px Inter', '700 14px Inter'];
    // Bounded: a font request that never settles must never block the mount,
    // otherwise the harness would hang instead of failing loudly.
    await withTimeout(
      Promise.all(faces.map((f) => document.fonts.load(f))),
      FONT_WAIT_MS
    );
    await withTimeout(document.fonts.ready, FONT_WAIT_MS);
  } catch {
    // `document.fonts` is absent in exotic environments; the ready flag below
    // still gates the screenshot.
  }
}

// StrictMode is always on: the modernized library must behave identically with
// and without it, and this keeps the baseline comparable before/after.
loadFonts().then(() => {
  mountRoot(
    <StrictMode>
      <App />
    </StrictMode>,
    container
  );
});
