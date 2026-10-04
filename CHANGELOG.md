# Changelog

All notable changes to **Suzume Design** are recorded here.

The public release history of this distribution starts at `1.0.0`. Historical
releases of the upstream project this code was derived from are deliberately
**not** listed - see [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) for
provenance.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-04

First Suzume Design release. This is a complete rebrand and repackaging of the
MIT-licensed upstream component library.

### Added

- `@byonedot/web-react` - 71 components, 2 hooks, 19 locales,
  277 icons.
- `@byonedot/color` - palette generation and colour utilities, with the
  `suzumeblue` primary preset.
- `@byonedot/plugin-*` - optional webpack / Rspack / Vite build plugins.
- `suzume-design-pro` - Next.js / CRA / Vite admin dashboard templates with a
  vendored, rebranded Pro theme.
- `suzume-design-skill` - AI-agent skill teaching the Suzume Design APIs.
- `docs/` - getting started, Next.js, theming, icons, hooks, i18n, forms,
  tables, overlays, responsive design, accessibility, TypeScript, SSR, tree
  shaking, colour, plugins and migration guides.
- `'use client'` directives on the package entry points so the library works
  as an App Router client boundary out of the box.
- `scripts/check-branding.js` - branding regression scanner wired into CI.
- `scripts/pack-check.js` - `npm pack` + tarball audit.

### Changed

- npm scope: `@arco-design/*` -> `@byonedot/*`.
- Class-name / Less prefix: `arco` -> `suzume` (`.arco-btn` -> `.suzume-btn`).
- Primary palette token: `arcoblue` -> `suzumeblue` (`--suzumeblue-6`,
  `@suzumeblue-6`).
- CSS-variable Less helpers: `@arco-*` -> `@suzume-*`.
- Dark-mode attribute: `arco-theme` -> `suzume-theme`.
- Build outputs: `arco.min.js` -> `suzume.min.js`, `arco.css` -> `suzume.css`,
  `arco-icon.min.js` -> `suzume-icon.min.js`, `arco-hooks.min.js` ->
  `suzume-hooks.min.js`.
- UMD globals: `window.arco` -> `window.suzume`,
  `window.arcoicon` -> `window.suzumeicon`,
  `window.arcohooks` -> `window.suzumehooks`.
- Build tooling vendored into `tools/build-scripts` (no upstream build
  dependency remains).
- Version baseline reset to `1.0.0`.

### Removed

- Upstream documentation website and marketing assets.
- Upstream corporate logo icon from the `logo/color` category.
- Upstream release-history files (`components/*/__changelog__/`).
- Upstream Vue skill variant (this ecosystem targets React / Next.js).
- Upstream Vite Vue plugin (no Vue component library exists here).

[1.0.0]: https://byonedot.in
