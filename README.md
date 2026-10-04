# Suzume Design

**A React and Next.js component library for building product interfaces.**
Built for https://byonedot.in

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://img.shields.io/badge/CI-passing-brightgreen.svg)](./.github/workflows/ci.yml)

```bash
npm i @byonedot/web-react
# or
yarn add @byonedot/web-react
```

```tsx
import { Button, Table, Form, Input, Modal, Typography } from '@byonedot/web-react';
import '@byonedot/web-react/dist/css/suzume.css';

export function SaveButton() {
  return <Button type="primary">Save</Button>;
}
```

---

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [React](#react)
  - [Next.js](#nextjs)
  - [CSS](#css)
- [Documentation](#documentation)
- [Ecosystem](#ecosystem)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [License](#license)

## Features

- **70+ components** covering forms, tables, data entry, data display,
  feedback, navigation and layout.
- **Design tokens** exposed as CSS custom properties, so themes can be changed
  at runtime without a rebuild.
- **Dark mode** through a single `suzume-theme` attribute on `<body>`.
- **19 locales** built in, with a `ConfigProvider` for app-wide language and
  component configuration.
- **Icons** - 280+ tree-shakeable React icon components.
- **TypeScript first** - every component ships declarations.
- **SSR safe** - components render on the server without touching `window`,
  `document` or `localStorage` during the initial render.
- **No plugin required** - the prebuilt CSS works with any bundler.

## Installation

Peer requirements: `react ^19.0.0` and `react-dom ^19.0.0`.

```bash
# npm
npm i @byonedot/web-react

# yarn
yarn add @byonedot/web-react

# pnpm
pnpm add @byonedot/web-react
```

### CDN / UMD

```html
<!-- production -->
<script src="https://unpkg.com/@byonedot/web-react@latest/dist/suzume.min.js"></script>

<!-- development (unminified, with warnings) -->
<script src="https://unpkg.com/@byonedot/web-react@latest/dist/suzume.development.js"></script>

<!-- styles -->
<link rel="stylesheet" href="https://unpkg.com/@byonedot/web-react@latest/dist/css/suzume.min.css" />
```

The UMD bundles expose the global `window.suzume` (components),
`window.suzumeicon` (icons) and `window.suzumehooks`.

## Usage

### React

```tsx
// App.tsx
import { ConfigProvider, Button } from '@byonedot/web-react';
import zhCN from '@byonedot/web-react/es/locale/zh-CN';
import '@byonedot/web-react/dist/css/suzume.css';

export default function App() {
  return (
    <ConfigProvider locale={zhCN} prefixCls="suzume">
      <Button type="primary">确定</Button>
    </ConfigProvider>
  );
}
```

### Next.js

Suzume Design works with the Next.js **App Router** and the **Pages Router**.
Interactive components need a Client Component boundary:

```tsx
// app/components/save-button.tsx
'use client';

import { Button } from '@byonedot/web-react';

export function SaveButton() {
  return <Button type="primary">Save</Button>;
}
```

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import '@byonedot/web-react/dist/css/suzume.css';

export const metadata: Metadata = { title: 'My App' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Full details - Server Components, hydration, `next/font`, Turbopack, tree
shaking and `transpilePackages` - are in
[`docs/nextjs.md`](./docs/nextjs.md).

### CSS

Three ways to load styles, pick one:

| Style | Import | Notes |
| --- | --- | --- |
| Prebuilt CSS | `import '@byonedot/web-react/dist/css/suzume.css'` | Recommended. Works everywhere, no bundler config. |
| Per-component Less | `import '@byonedot/web-react/es/Button/style/index.less'` | Requires a Less loader; enables `modifyVars` theming. |
| CDN | `dist/css/suzume.min.css` | For UMD usage. |

## Documentation

| Topic | File |
| --- | --- |
| Getting started (React / Next.js / CSS) | [`docs/getting-started.md`](./docs/getting-started.md) |
| Next.js compatibility | [`docs/nextjs.md`](./docs/nextjs.md) |
| Theming, tokens, dark mode | [`docs/theming.md`](./docs/theming.md) |
| Icons | [`docs/icons.md`](./docs/icons.md) |
| Hooks | [`docs/hooks.md`](./docs/hooks.md) |
| Internationalization | [`docs/i18n.md`](./docs/i18n.md) |
| Forms and validation | [`docs/forms.md`](./docs/forms.md) |
| Tables | [`docs/tables.md`](./docs/tables.md) |
| Modals, drawers, notifications | [`docs/overlays.md`](./docs/overlays.md) |
| Responsive design | [`docs/responsive.md`](./docs/responsive.md) |
| Accessibility | [`docs/accessibility.md`](./docs/accessibility.md) |
| TypeScript | [`docs/typescript.md`](./docs/typescript.md) |
| Tree shaking and bundle size | [`docs/tree-shaking.md`](./docs/tree-shaking.md) |
| SSR and hydration | [`docs/ssr.md`](./docs/ssr.md) |
| Colour utilities | [`docs/color.md`](./docs/color.md) |
| Build plugins | [`docs/plugins.md`](./docs/plugins.md) |
| Migration and versioning | [`docs/migration.md`](./docs/migration.md) |
| Component reference | [`docs/components.md`](./docs/components.md) |

## Ecosystem

| Package | Purpose |
| --- | --- |
| [`@byonedot/web-react`](https://www.npmjs.com/package/@byonedot/web-react) | This repository - the React component library. |
| `@byonedot/color` | Palette generation and colour utilities used by the token system. |
| `@byonedot/plugin-*` | Optional webpack / Rspack / Vite build plugins. |
| `suzume-design-pro` | Admin dashboard templates (Next.js, CRA, Vite). |
| `suzume-design-skill` | AI-agent skill that teaches `@byonedot/web-react` APIs. |

## Versioning

Suzume Design follows [Semantic Versioning](https://semver.org/). The public
release history of this distribution starts at **1.0.0** - see
[`CHANGELOG.md`](./CHANGELOG.md). The upstream project this code was derived
from is documented in [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and the
[`Code of Conduct`](./CODE_OF_CONDUCT.md).

This repository is a pnpm workspace:

| path | package | published |
| --- | --- | --- |
| `.` | `@byonedot/web-react` | yes |
| `packages/color` | `@byonedot/color` | yes |
| `hooks/`, `icon/` | sub-packages of the library | no (`private`) |
| `tools/build-scripts` | vendored build tooling | no (`private`) |
| `tests/visual`, `integration/next-app` | test harnesses | no (`private`) |

Useful scripts:

```bash
pnpm install        # install dependencies
pnpm build          # build es / cjs / dist / css / hooks
pnpm icon           # regenerate the icon set
pnpm test           # run the full test suite (TZ=Asia/Singapore)
pnpm typecheck      # tsc --noEmit
pnpm eslint         # lint
pnpm stylelint      # lint Less
pnpm check:branding # fail on any upstream identifier outside the legal allowlist
pnpm pack:check     # npm pack + inspect the tarball
```

See [`RELEASING.md`](./RELEASING.md) for the publish process.

## License

[MIT](./LICENSE) - see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for
upstream attribution.
