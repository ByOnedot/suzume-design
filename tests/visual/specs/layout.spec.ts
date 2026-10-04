import { test, expect } from '@playwright/test';
import { scenarios, responsiveIds } from '../src/scenarios';
import {
  openScenario,
  assertConsoleIsClean,
  assertNoBrowserErrors,
  assertStageHasContent,
  REFERENCE_WIDTH,
} from './helpers';

const cases = scenarios.flatMap((scenario) =>
  scenario.variants.flatMap((variant) =>
    (['light', 'dark'] as const).map((theme) => ({ scenario, variant, theme }))
  )
);

for (const { scenario, variant, theme } of cases) {
  test(`${scenario.id} :: ${variant} :: ${theme}`, async ({ page }, testInfo) => {
    const width = testInfo.project.use.viewport?.width ?? REFERENCE_WIDTH;

    if (theme === 'dark' && width !== REFERENCE_WIDTH && !responsiveIds.has(scenario.id)) {
      test.skip(true, 'dark mode is captured on the reference viewport only');
    }

    const problems = await openScenario(page, scenario.id, variant, theme);
    await assertStageHasContent(page, `${scenario.id}/${variant}/${theme}`, scenario.expectText !== false);
    await assertConsoleIsClean(page, `${scenario.id}/${variant}/${theme}`);

    await expect(page).toHaveScreenshot(`${scenario.id}--${variant}--${theme}.png`);

    await assertNoBrowserErrors(page, problems, `${scenario.id}/${variant}/${theme}`);
  });
}
