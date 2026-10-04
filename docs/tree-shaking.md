# Tree shaking and bundle size

## What the package declares

```jsonc
{
  "sideEffects": [
    "dist/**/*",
    "es/**/style/*",
    "lib/**/style/*",
    "*.less",
    "es/_util/react-19-adapter.js"
  ]
}
```

Everything that is **not** listed is treated as side-effect free, so bundlers
may drop unused modules.

- `module` -> `./es/index.js` (ESM) is what webpack / Vite / Next use.
- `main` -> `./lib/index.js` (CommonJS) is used by Node and Jest.
- Style entries are marked side-effectful so importing a component's
  `style/index.less` is never removed.

## Importing

```ts
// good - one import, bundler drops what you do not use
import { Button, Table, Space } from '@byonedot/web-react';

// also fine
import Button from '@byonedot/web-react/es/Button';

// icons: import only what you use
import { IconSearch, IconPlus } from '@byonedot/web-react/icon';
```

Avoid:

```ts
// pulls the whole barrel before tree shaking, and defeats older bundlers
import * as Suzume from '@byonedot/web-react';
```

## CSS

The prebuilt stylesheet is **not** tree-shakeable - `suzume.css` contains every
component. Measured sizes of the current build (raw / gzip):

| Asset | Raw | Gzip |
| --- | --- | --- |
| `dist/css/suzume.min.css` | 590 kB | **64 kB** |
| `dist/suzume.min.js` | 1.0 MB | **269 kB** |
| `dist/suzume.development.js` | 3.6 MB | 563 kB |

The JS bundle keeps React external, so the 269 kB is library code only. Both
are smaller in a real app because unused components are tree shaken when you
import from the package root.

To pay only for what you use, compile the per-component Less entries instead
(see [getting-started.md](./getting-started.md)) or use one of the optional
[plugins](./plugins.md) that automate on-demand style injection.

## Icons

Icons are the largest single surface (277 components). They live in a separate
entry point and are individually importable, so a typical page adds only a few
hundred bytes:

```ts
import { IconLeft, IconRight } from '@byonedot/web-react/icon';
```

The UMD bundle `dist/suzume-icon.min.js` contains all of them - do not load it
on a page that only needs a handful.

## Measuring

```bash
# build your app, then
npx source-map-explorer 'dist/**/*.js'
# or
ANALYZE=1 next build   # with @next/bundle-analyzer configured
```

Rules of thumb:

- Each extra component from the barrel adds its code only if rendered.
- `lodash` is a runtime dependency of the library; bundlers dedupe it with
  your own copy.
- `dayjs` locales are only pulled in by the locale files you import.

## Code splitting

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('../components/chart'), { ssr: false });
```

Or split by route - Next.js does this automatically for the Pages Router and
per-`loading` boundary in the App Router.
