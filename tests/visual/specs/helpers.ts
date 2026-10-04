import { expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/** Reference desktop viewport: the only one that captures dark mode for
 *  non-responsive scenarios, which keeps the baseline set bounded while still
 *  covering dark mode for every component and full responsive regression. */
export const REFERENCE_WIDTH = 1280;

/**
 * Console policy.
 *
 * - `enforce` (default): any console output, page error or unhandled
 *   rejection fails the test. This is the gate used by CI and by every run
 *   after the modernization.
 * - `baseline`: pre-existing output is appended to
 *   `console-baseline.jsonl` instead of failing, so the *visual* baseline can
 *   be captured before the library-side warnings are fixed. The recorded file
 *   is a report, never a waiver: `enforce` mode does not read it.
 *
 * Select with `SUZUME_CONSOLE_MODE=baseline npx playwright test ...`.
 */
export const CONSOLE_MODE = process.env.SUZUME_CONSOLE_MODE === 'baseline' ? 'baseline' : 'enforce';

const BASELINE_FILE = path.resolve(__dirname, '../console-baseline.jsonl');

/**
 * Messages emitted by the browser itself rather than by application or library
 * code. They cannot be prevented by library changes and are not React
 * warnings; they are still reported in baseline mode for visibility.
 */
const BROWSER_GENERATED = [
  'ResizeObserver loop completed with undelivered notifications.',
  'ResizeObserver loop undelivered notifications.',
];

const isBrowserGenerated = (message: string) =>
  BROWSER_GENERATED.some((m) => message.includes(m));

export async function openScenario(
  page: Page,
  id: string,
  variant: string,
  theme: 'light' | 'dark'
): Promise<string[]> {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      problems.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));

  await page.goto(`/?s=${encodeURIComponent(id)}&v=${encodeURIComponent(variant)}&t=${theme}`);
  await page.waitForSelector('#stage[data-ready="1"]', { state: 'attached', timeout: 30_000 });
  // Portals (Message / Notification / overlays) plus two animation frames, and
  // long enough for ResizeObserver-driven layout to settle.
  await page.waitForTimeout(400);
  return problems;
}

export async function assertStageHasContent(page: Page, context: string, expectText: boolean) {
  const state = await page.evaluate(() => {
    const stage = document.getElementById('stage');
    const descendants = stage ? stage.querySelectorAll('*').length : 0;
    const boxes = stage
      ? [...stage.querySelectorAll('*')].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }).length
      : 0;
    return { descendants, boxes, text: document.body.innerText.trim().length };
  });

  expect(state.descendants, `stage rendered no DOM during ${context}`).toBeGreaterThan(0);
  expect(state.boxes, `stage rendered no visible box during ${context}`).toBeGreaterThan(0);
  if (expectText) {
    expect(state.text, `stage rendered no visible text during ${context}`).toBeGreaterThan(0);
  }
}

export async function readHarnessConsole(page: Page): Promise<string[]> {
  return page.evaluate<string[]>(
    () => (globalThis as unknown as { __SUZUME_CONSOLE__: string[] }).__SUZUME_CONSOLE__ || []
  );
}

export async function assertConsoleIsClean(page: Page, context: string): Promise<void> {
  const reported = (await readHarnessConsole(page)).filter((m) => !isBrowserGenerated(m));

  if (CONSOLE_MODE === 'baseline') {
    if (reported.length) {
      fs.appendFileSync(BASELINE_FILE, `${JSON.stringify({ context, problems: reported })}\n`);
    }
    return;
  }

  expect(reported, `console output during ${context}`).toEqual([]);
}

export async function assertNoBrowserErrors(
  page: Page,
  captured: string[],
  context: string
): Promise<void> {
  const fresh = captured.filter((m) => !isBrowserGenerated(m));

  if (CONSOLE_MODE === 'baseline') {
    if (fresh.length) {
      fs.appendFileSync(BASELINE_FILE, `${JSON.stringify({ context, problems: fresh })}\n`);
    }
    return;
  }

  expect(fresh, `browser console during ${context}`).toEqual([]);
}
