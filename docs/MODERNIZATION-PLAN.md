# Modernization plan - execution status

Every phase ends with a **visual parity gate**: build → unit/component tests →
visual regression against `tests/visual/snapshots/` → only then continue.

| # | Phase | Status |
| --- | --- | --- |
| 0 | Baseline capture (install, build, tests, inventory, visual baselines) | **PASS** - 1703 screenshots, verified deterministic |
| 1 | pnpm workspace migration (Yarn 1 removed) | **PASS** - `pnpm@12.9.1`, workspace + `catalog:` |
| 2 | React 19.3 runtime + TypeScript 6 + Vitest 5 | **PARTIAL** - runtime migrated and visually verified; `@types/react@19` migration has 46 remaining type errors (see "Open work") |
| 3 | Build system (remove webpack 4 / gulp pipeline) | **NOT STARTED** |
| 4 | Package `exports`, tree shaking, subpath API | **NOT STARTED** |
| 5 | SSR / hydration / StrictMode / memory / a11y hardening | **PARTIAL** - harness runs in StrictMode with a clean console |
| 6 | Consumers: Next.js 16 App Router + Turborepo | **NOT STARTED** |
| 7 | Lint/format/CI/docs/security | **PARTIAL** - ESLint 9 flat config + Prettier 3 + branding/links CI done; CI workflow not rewritten |
| 8 | Final acceptance matrix | **RECORDED** - see the delivery report |

## Open work (blocking `typecheck` and therefore `build`)

46 type errors remain after moving to `@types/react@19` / `@types/react-dom@19`.
They fall into three groups:

1. `ReactElement.props` is `unknown` in React 19 types (23 sites) - each needs a
   per-site narrowing rather than a blanket `any`.
2. `ref` callbacks that return a value are no longer assignable to `Ref<T>`
   (about 17 sites) - the callback body needs a block, not an expression body.
3. Assorted overload/generic mismatches (6 sites).

`tsc` still **emits** correct output (verified: 549 `.js` + 549 `.d.ts` in a
scratch `--outDir`); only the non-zero exit code fails the build wrapper.

## Phase 2 notes - React 19 correctness work

React 18/19 schedule state updates instead of flushing them, which silently
changed the contract of the library's **imperative** APIs. The following source
changes restore the historic synchronous behaviour:

| File | Change | Why |
| --- | --- | --- |
| `_util/react-dom.ts` | `render()` now uses `createRoot` + `flushSync`; `element.ref` replaced by the version-safe `getElementRef()`; `findDOMNode` guarded | `ReactDOM.render` / `element.ref` were removed in React 19 |
| `_util/react-19-adapter.ts` | **deleted** (it was dead code - nothing imported it) | no more legacy adapter |
| `Message` / `Notification` | `add`, `remove`, `clear` flushed through `flushNoticeUpdate` | callers could previously assert on the DOM immediately |
| `Message/useMessage`, `Notification/useNotification` | holder `addInstance` flushed; ref-callback updates left to React | same |
| `Trigger/portal.tsx` | container now owned by an effect instead of being created during render | React 19 StrictMode `setup → cleanup → setup` detached the container without a re-render, making every popup disappear |
| `Trigger/getPopupStyle.ts` | `arrowLeft` / `arrowTop` hoisted above the `switch` | latent TDZ bug hidden by the old ES5 output, exposed by ES2017 |
| `Table`, `VerificationCode`, `Breadcrumb`, `List` | `key` lifted out of spread props; array children keyed | React 19 rejects `key` inside a spread and warns on unkeyed arrays |

`react-dom/client` is the only mounting API - there is no React 16 fallback,
which is why `peerDependencies` now require React 19.

## Test migration (jest 26 + Enzyme → Vitest 5)

- `tests/setup.ts` / `tests/vitest-setup.ts` replace the Jest setup files; no
  Enzyme adapter remains.
- `tests/demoTest.ts` and `tests/componentConfigTest.tsx` now render with
  `renderToStaticMarkup` - the same function Enzyme's `render()` used, so the
  DOM is unchanged; the *snapshot format* changed because `enzyme-to-json`'s
  serializer is gone.
- `jest.*` → `vi.*` across all suites; `react-test-renderer`'s `act` replaced
  with Testing Library's.
- Fake timers are configured with an explicit `toFake` list so `Date` is **not**
  faked (component ids and countdowns derive from `Date.now()`).
- Demo tests run twice: once under jsdom (`vitest.config.ts`) and once under
  the `node` environment (`vitest.node.config.ts`), mirroring the old
  `test:client` / `test:node` split.

## Demo / documentation environment

Storybook **6** was removed with the npm dependencies: it is end-of-life and
does not support React 19. `.storybook/` (config) and `stories/` (62 stories)
are retained as the starting point for a Storybook 9 migration - the active
preview environment today is the Playwright harness in `tests/visual/`, which
renders every component and every visual state.
