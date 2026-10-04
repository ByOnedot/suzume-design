# Next.js compatibility

Suzume Design is validated against Next.js in production builds. This page
documents exactly what works, what needs a boundary, and what is **not**
supported.

## App Router (recommended)

### Styles must be imported from a Client Component or the root layout

Next.js only allows **global CSS** to be imported in the root layout (or in a
file imported by it). The Suzume stylesheet is global:

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import '@suzume-design/web-react/dist/css/suzume.css';

export const metadata: Metadata = {
  title: 'Acme',
  description: 'Acme dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Interactive components need `'use client'`

Every Suzume component uses hooks, context and - for overlays - portals. Add a
client boundary in **your** component file:

```tsx
// app/components/save-button.tsx
'use client';

import { Button, message } from '@suzume-design/web-react';

export function SaveButton() {
  return (
    <Button type="primary" onClick={() => message.info('Saved')}>
      Save
    </Button>
  );
}
```

The package entry points (`@suzume-design/web-react`,
`@suzume-design/web-react/icon`, `@suzume-design/web-react/hooks`) already
carry a `'use client'` directive, so importing them from a Server Component
file resolves to a client boundary automatically. Keeping the directive in
your own wrapper file is still recommended: it makes the boundary explicit
and keeps your Server Component tree readable.

### Server Components

Server Components cannot render interactive components directly. Two patterns
work:

```tsx
// 1. Split the file
// app/page.tsx  (Server Component)
import { PageHeader } from './page-header';   // client
import { SaveButton } from './save-button';   // client

export default function Page() {
  return (
    <main>
      <PageHeader />
      <SaveButton />
    </main>
  );
}
```

```tsx
// 2. Pass plain serialisable props across the boundary
// app/components/stat.tsx
'use client';
import { Statistic } from '@suzume-design/web-react';
export function Stat({ value }: { value: number }) {
  return <Statistic value={value} />;
}
```

### Destructure namespace members inside the client boundary

Because the entry points carry `'use client'`, the value a Server Component
imports is a **client reference**, not the real module object. Destructuring
therefore returns `undefined`:

```tsx
// app/page.tsx (Server Component) - does not work
import { Grid, Typography } from '@suzume-design/web-react';
const { Row, Col } = Grid; // Grid is a client reference here
```

Keep the destructuring in a `'use client'` file and render that file from the
Server Component:

```tsx
// app/server-grid.tsx
'use client';
import { Grid } from '@suzume-design/web-react';
const { Row, Col } = Grid;
export function ServerGrid() {
  return (
    <Row>
      <Col span={12}>Rendered as a client boundary, still server-side rendered</Col>
    </Row>
  );
}
```

Directly imported components (`<Alert>`, `<Card>`, ...) are fine in a Server
Component - they become client boundaries automatically.

Never pass functions, class instances or `dayjs` objects from a Server
Component to a client component - they are not serialisable.

## Pages Router

Works unchanged:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@suzume-design/web-react/dist/css/suzume.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## SSR and hydration

- Components render to a stable string on the server: initial markup does not
  read `window`, `document`, `localStorage` or `matchMedia`.
- Browser-only work happens in `useEffect`. See [ssr.md](./ssr.md).
- Portals (Modal, Drawer, Dropdown, Tooltip, Message, Notification) create
  their container after mount, so no portal target is touched during SSR.
- If you enable dark mode, set the `suzume-theme` attribute in
  `_document.tsx` / the root layout (or inline `<script>`) so the first paint
  already matches - otherwise you get a flash of the light theme.

```tsx
// app/layout.tsx - apply the saved theme before hydration
<html lang="en" suppressHydrationWarning>
  <body
    // or set it with an inline <script> that runs before hydration
    suppressHydrationWarning
  >
```

## Dynamic imports

```tsx
const Chart = dynamic(() => import('../components/chart'), { ssr: false });
```

Components that draw on a canvas (charts, `ColorPicker` preview, `Watermark`)
are good candidates for `{ ssr: false }`.

## Fonts

Use `next/font` and set the token instead of relying on the library default:

```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

<html className={inter.className}>
```

## `next.config.js`

No plugin and no `transpilePackages` entry is required for the prebuilt CSS
route. If you compile the library's Less yourself (per-component style
imports), keep the usual Less options:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only needed if you import the library's .less sources:
  // (Next supports Less natively; you still need `less` installed)
};

module.exports = nextConfig;
```

The optional bundler plugins are covered in [plugins.md](./plugins.md) - note
that none of them is required, and none of them supports Turbopack.

## Turbopack

`next dev --turbo` works for the recommended setup (prebuilt CSS import +
`'use client'` boundaries) because nothing in that path needs a custom loader.
The Less-compilation path and the bundler plugins are **webpack only** today.

## Tree shaking

- `sideEffects` in `package.json` marks `dist/**`, `es/**/style/*`,
  `lib/**/style/*` and `*.less` as side-effectful, everything else as pure.
- Import components from the package root; unused ones are dropped in
  production builds.
- Icons are separate: `import { IconSearch } from '@suzume-design/web-react/icon'`
  only pulls in the icons you reference.

See [tree-shaking.md](./tree-shaking.md).

## ESM and CommonJS

| Field | Points to | Format |
| --- | --- | --- |
| `module` | `./es/index.js` | ES modules (webpack / Vite / Next default) |
| `main` | `./lib/index.js` | CommonJS (Node, Jest, older tooling) |
| `types` | `./es/index.d.ts` | TypeScript declarations |
| `unpkg` | `./dist/suzume.min.js` | UMD |

Both formats are published; pick automatically with the fields above.

## TypeScript

Works with `next build` out of the box. If you use `paths` in `tsconfig.json`
and also link the library locally (`link:` / `pnpm link`), map `dayjs`,
`lodash`, `react` and `react-dom` to your app's copy so the type identities
line up:

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "dayjs": ["./node_modules/dayjs"],
      "react": ["./node_modules/react"]
    }
  }
}
```

This is only needed for local `link:` setups; a normal registry install
hoists a single copy of each package and needs no mapping.

## Checklist

- [x] App Router + Pages Router
- [x] RSC boundaries via `'use client'`
- [x] SSR / hydration
- [x] Dynamic imports
- [x] No `document`/`window` access during server render
- [x] Global CSS constraint respected (import from the layout)
- [x] Tree shaking / ESM + CJS
- [x] TypeScript
- [x] Turbopack (prebuilt CSS path)
- [x] Webpack (all paths)
- [x] Production build (`next build`) validated
