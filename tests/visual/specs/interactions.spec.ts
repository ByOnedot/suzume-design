import { test, expect, type Page } from '@playwright/test';
import { scenarios } from '../src/scenarios';
import {
  openScenario,
  assertConsoleIsClean,
  assertNoBrowserErrors,
  assertStageHasContent,
} from './helpers';

/**
 * Interaction states (hover / focus / active) are viewport independent, so they
 * are captured once, on the reference desktop viewport, in the light theme.
 */
const interactions: {
  id: string;
  apply: (page: Page, selector: string) => Promise<void>;
}[] = [
  { id: 'hover', apply: async (page, selector) => void (await page.locator(selector).first().hover({ force: true })) },
  {
    id: 'focus',
    apply: async (page, selector) => {
      await page.locator(selector).first().focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      await page.locator(selector).first().focus();
    },
  },
  {
    id: 'active',
    apply: async (page, selector) => {
      const box = await page.locator(selector).first().boundingBox();
      if (!box) return;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(30);
    },
  },
];

const targets = scenarios.filter((s) => !!s.act);

for (const scenario of targets) {
  const variant = scenario.variants[0];

  for (const interaction of interactions) {
    test(`${scenario.id} :: ${variant} :: ${interaction.id}`, async ({ page }) => {
      const problems = await openScenario(page, scenario.id, variant, 'light');
      await assertStageHasContent(page, `${scenario.id}/${variant}/${interaction.id}`, scenario.expectText !== false);
      await assertConsoleIsClean(page, `${scenario.id}/${variant}/${interaction.id}`);

      await interaction.apply(page, scenario.act!);
      await page.waitForTimeout(60);

      await expect(page).toHaveScreenshot(`${scenario.id}--${variant}--${interaction.id}.png`);

      await assertNoBrowserErrors(
        page,
        problems,
        `${scenario.id}/${variant}/${interaction.id}`
      );
    });
  }
}
