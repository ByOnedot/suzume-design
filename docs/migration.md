# Migration, versioning and provenance

## Versioning

Suzume Design follows [Semantic Versioning](https://semver.org/).

- **Public release history starts at `1.0.0`.** `CHANGELOG.md` records
  Suzume releases only.
- The npm scope is `@suzume-design/*`; there are no upgrade paths from
  upstream package names, because this distribution is a new namespace.
- Internal packages (`@suzume-design/color`, the bundler plugins, the Pro
  templates) version independently but are released together when they change
  in concert.

## Migrating from the upstream component library

The component sources are derived from an MIT-licensed upstream project. The
migration is a **rename**, not a rewrite: component APIs, behaviour, class
name structure and design tokens are unchanged apart from the identifiers
below.

### Automated codemod

```bash
# application code
npx -p @suzume-design/web-react@latest true  # package installed
```

Then apply these replacements across your repository:

| Find | Replace |
| --- | --- |
| `@arco-design/web-react` | `@suzume-design/web-react` |
| `@arco-design/web-react/icon` | `@suzume-design/web-react/icon` |
| `@arco-design/web-react/hooks` | `@suzume-design/web-react/hooks` |
| `@arco-design/color` | `@suzume-design/color` |
| `arco-design` (import paths) | `suzume-design` |
| `.arco-` (class selectors in your CSS/tests) | `.suzume-` |
| `--arco-` (CSS variable names, if you prefixed) | `--suzume-` |
| `arcoblue` (palette token, `modifyVars` key) | `suzumeblue` |
| `arco-theme` (body attribute for dark mode) | `suzume-theme` |
| `@prefix: arco` (Less) | `@prefix: suzume` |
| `prefixCls: 'arco'` (JS) | `prefixCls: 'suzume'` |
| `dist/css/arco.css` | `dist/css/suzume.css` |
| `dist/arco.min.js` | `dist/suzume.min.js` |
| `window.arco` | `window.suzume` |

Example:

```bash
rg -l "@arco-design/web-react|\.arco-|arcoblue|arco-theme" src tests styles \
  | xargs sed -i '' \
      -e 's|@arco-design/web-react|@suzume-design/web-react|g' \
      -e 's|\.arco-|.suzume-|g' \
      -e 's|arcoblue|suzumeblue|g' \
      -e 's|arco-theme|suzume-theme|g'
```

### What intentionally changed

| Area | Change |
| --- | --- |
| npm packages | `@suzume-design/web-react`, `@suzume-design/color`, `@suzume-design/plugin-*` |
| Class prefix | `arco` -> `suzume` (`.arco-btn` -> `.suzume-btn`) |
| CSS variables | Unprefixed tokens are unchanged (`--color-text-1`); the primary ramp `--arcoblue-*` -> `--suzumeblue-*` |
| Less prefix variables | `@arco-*` -> `@suzume-*` (`@prefix`, `@suzume-vars-prefix`, `@suzume-cssvars-prefix`, `@suzume-theme-tag`) |
| Dark mode attribute | `arco-theme` -> `suzume-theme` |
| Storage keys in your app | If you copied upstream examples, `arco-lang` / `arco-theme` -> `suzume-lang` / `suzume-theme` |
| UMD globals | `window.arco` -> `window.suzume`, `window.arcoicon` -> `window.suzumeicon` |
| Build file names | `arco.min.js` -> `suzume.min.js`, `arco.css` -> `suzume.css`, `arco-icon.min.js` -> `suzume-icon.min.js` |
| Internal markers | `__ARCO_*` -> `__SUZUME_*`, `data-arco-*` -> `data-suzume-*` |
| Icons | The upstream corporate logo icon was removed (upstream branding); all other icons are unchanged |

### What did NOT change

- Component names, props, events, sub-components and slot shapes.
- Design token **values** (colours, spacing, radii, typography, motion,
  z-index, breakpoints) - only their brand-prefixed names moved.
- The `suzume` class prefix maps 1:1 onto the old `arco` prefix, so
  third-party selectors written against `.suzume-*` behave identically.
- Behaviour, accessibility, SSR assumptions, responsive breakpoints and
  localisation content.

### Version mapping

There is no version mapping. Upstream release numbers (2.x) are not carried
over, because that would imply a continuous release history this distribution
does not have. Treat `1.0.0` as the baseline and read the upstream changelog
only as provenance material.

## Provenance

This repository is a modified redistribution of an MIT-licensed upstream
component library. Upstream copyright notices are preserved verbatim in
`LICENSE`, and the details are recorded in
[`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md).

Upstream names appear only in:

- `LICENSE`
- `THIRD_PARTY_NOTICES.md`
- genuine `Copyright ...` lines inside generated bundle banners

Everything else is scanned in CI by `pnpm check:branding`
(`scripts/check-branding.js`).

## Upgrading Suzume Design

```bash
npm i @suzume-design/web-react@latest
```

Read `CHANGELOG.md` for the release you are moving to. Breaking changes are
listed under `### Breaking` and always come with a migration note in this
file.
