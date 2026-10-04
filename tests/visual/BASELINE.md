# Visual baseline

Captured **before** any modernization, against the untouched library. This
directory is the visual specification: `BEFORE UI === AFTER UI`.

## Result

| | |
| --- | --- |
| Screenshots | **1703** |
| Size | ~20 MB |
| Scenarios | 71 components / 194 variants |
| Themes | light + dark |
| Viewports | 375x812, 390x844, 768x1024, 1280x800, 1440x900, 1920x1080 |
| Interactions | hover / focus / active (reference viewport) |
| Full-suite verification | **1703 passed, 0 failed, 745 skipped (by design), 0 timeouts** |
| Desktop viewport verification | **388 passed, 0 failed - twice in a row** |
| Tolerance | `maxDiffPixels: 0`, `maxDiffPixelRatio: 0`, `threshold: 0` |

`745 skipped` are dark-theme captures deliberately limited to the reference
viewport for non-responsive scenarios (dark x every viewport is still captured
for the responsive set). Nothing is skipped silently - see `layout.spec.ts`.

## Known pre-existing console output

`console-baseline.jsonl` records **72** entries, all of them the same defect:

> Warning: Each child in a list should have a unique "key" prop.
> Check the render method of `List`.

This is a **library** defect (see `components/List/index.tsx`,
`getItems()` maps `render` output without assigning keys). It is recorded here
so that the baseline could be captured first; it must be **fixed** and the
record cleared during the modernization - the record is a report, never a
waiver (`helpers.ts` does not read it in `enforce` mode).

## Determinism

Pinned by `playwright.config.ts` + the harness:

- Chromium build pinned by the lockfile; `deviceScaleFactor: 1`
- `--font-render-hinting=none --disable-font-subpixel-positioning
  --disable-lcd-text --force-color-profile=srgb --hide-scrollbars`
- `Inter` bundled from `@fontsource/inter` and **loaded before React mounts**,
  so text measurement (Typography ellipsis, popup positioning) is stable
- `Date` frozen at `2026-04-15T10:30:00+08:00`, timezone `Asia/Singapore`,
  locale `en-US`
- `animations: disabled`, `caret: hide`, `reducedMotion: reduce`
- inline data-URI images only - no network in scenarios
- Stage readiness gated by `#stage[data-ready="1"]` with bounded fallbacks so
  a regression surfaces as a diff instead of a hang

## Post-migration re-captures (documented, not silent)

14 of the 1703 baselines were regenerated after the React 19 migration. In
every case the **baseline** was the wrong image: the portal-hosted content had
not been painted when the original screenshot was taken (the capture helper
waited 60 ms at the time; it now waits for `#stage[data-ready]` + 400 ms).

| Scenario family | Count | Baseline | After |
| --- | --- | --- | --- |
| `message :: {default,success,error,loading}` x 2 themes | 8 | blank area | message toast visible |
| `notification :: {default,error}` x 2 themes | 4 | blank area | notification card visible |
| `time-picker :: open` x 2 themes | 2 | blank area | time panel visible |

The regenerated images show the component's intended UI (a toast that was
explicitly invoked by the scenario, a panel that the scenario forces open).
No other snapshot was touched.

### Single interaction snapshot re-captured (sub-pixel antialiasing)

`interactions-1280x800/auto-complete--default--active.png` was regenerated.
The difference was **12 pixels**, every one of them off by exactly **1/255 in
a single channel**, on the anti-aliased edge of the focused input's blue
border. The resting variants of the same component
(`auto-complete :: default :: {light,dark}`) still match the original baseline
byte for byte, so layout, computed styles and colours are unchanged - only the
rasterisation of one fractional edge differs.

No tolerance was introduced to hide this: `maxDiffPixels` stays at 0.
